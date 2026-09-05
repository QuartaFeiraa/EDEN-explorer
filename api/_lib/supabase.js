'use strict';

const SUPABASE_URL=process.env.SUPABASE_URL||'https://zycpeiyztqysjqejtour.supabase.co';
const SUPABASE_PUBLISHABLE_KEY=process.env.SUPABASE_PUBLISHABLE_KEY||'sb_publishable_heHXvAxo36EvgHg_8_XOXQ_rRxE5t5H';
const UPSTREAM_TIMEOUT_MS=8000;
const UUID_RE=/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

function jsonHeaders(extra={}){
  return {'Content-Type':'application/json',...extra};
}

function bearerToken(req){
  const value=String(req.headers?.authorization||'');
  const match=value.match(/^Bearer\s+(.+)$/i);
  return match?.[1]?.trim()||'';
}

function adminKey(){
  return process.env.SUPABASE_SECRET_KEY||process.env.SUPABASE_SERVICE_ROLE_KEY||'';
}

function adminHeaders(key,extra={}){
  if(!key)throw new Error('supabase_admin_not_configured');
  const headers={apikey:key,...extra};
  // New sb_secret_* values are API keys rather than JWTs. Legacy service-role
  // keys still need Authorization for Auth admin endpoints.
  if(!key.startsWith('sb_secret_'))headers.Authorization=`Bearer ${key}`;
  return headers;
}

function timeoutSignal(ms=UPSTREAM_TIMEOUT_MS){
  return typeof AbortSignal!=='undefined'&&typeof AbortSignal.timeout==='function'
    ? AbortSignal.timeout(ms)
    : undefined;
}

function jwtPayload(token){
  if(typeof token!=='string'||token.length>16384)return null;
  const parts=token.split('.');
  if(parts.length!==3||!parts[1])return null;
  try{
    const normalized=parts[1].replace(/-/g,'+').replace(/_/g,'/');
    const padded=normalized+'='.repeat((4-normalized.length%4)%4);
    const parsed=JSON.parse(Buffer.from(padded,'base64').toString('utf8'));
    return parsed&&typeof parsed==='object'?parsed:null;
  }catch{return null}
}

function sessionIdFromToken(token){
  const value=String(jwtPayload(token)?.session_id||'').trim();
  return UUID_RE.test(value)?value:'';
}

async function userFromToken(token){
  if(!token)return null;
  const response=await fetch(`${SUPABASE_URL}/auth/v1/user`,{
    headers:{apikey:SUPABASE_PUBLISHABLE_KEY,Authorization:`Bearer ${token}`},
    signal:timeoutSignal()
  });
  if(!response.ok)return null;
  return response.json();
}

async function adminDb(path,options={}){
  const key=adminKey();
  const response=await fetch(`${SUPABASE_URL}/rest/v1/${path}`,{
    ...options,
    signal:options.signal||timeoutSignal(),
    headers:adminHeaders(key,jsonHeaders(options.headers||{}))
  });
  return response;
}

async function sessionIsActive(userId,sessionId){
  if(!UUID_RE.test(String(userId||''))||!UUID_RE.test(String(sessionId||'')))return false;
  const response=await adminDb('rpc/rumo_session_active',{
    method:'POST',
    body:JSON.stringify({p_user_id:userId,p_session_id:sessionId})
  });
  if(!response.ok)throw new Error('session_check_failed');
  return (await response.json().catch(()=>false))===true;
}

async function userOwnsStorageObjects(userId){
  if(!UUID_RE.test(String(userId||'')))return false;
  const response=await adminDb('rpc/rumo_user_owns_storage_objects',{
    method:'POST',
    body:JSON.stringify({p_user_id:userId})
  });
  if(!response.ok)throw new Error('storage_preflight_failed');
  return (await response.json().catch(()=>false))===true;
}

async function revokeAuthSessions(token,scope='global'){
  const allowed=new Set(['global','local','others']);
  const safeScope=allowed.has(scope)?scope:'global';
  return fetch(`${SUPABASE_URL}/auth/v1/logout?scope=${safeScope}`,{
    method:'POST',
    headers:{apikey:SUPABASE_PUBLISHABLE_KEY,Authorization:`Bearer ${token}`},
    signal:timeoutSignal()
  });
}

async function deleteAuthUser(userId){
  const key=adminKey();
  const response=await fetch(`${SUPABASE_URL}/auth/v1/admin/users/${encodeURIComponent(userId)}`,{
    method:'DELETE',
    headers:adminHeaders(key),
    signal:timeoutSignal()
  });
  return response;
}

module.exports={
  SUPABASE_URL,
  SUPABASE_PUBLISHABLE_KEY,
  UPSTREAM_TIMEOUT_MS,
  bearerToken,
  adminKey,
  adminHeaders,
  timeoutSignal,
  jwtPayload,
  sessionIdFromToken,
  userFromToken,
  adminDb,
  sessionIsActive,
  userOwnsStorageObjects,
  revokeAuthSessions,
  deleteAuthUser
};
