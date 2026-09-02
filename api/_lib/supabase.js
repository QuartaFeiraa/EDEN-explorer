'use strict';

const SUPABASE_URL=process.env.SUPABASE_URL||'https://zycpeiyztqysjqejtour.supabase.co';
const SUPABASE_PUBLISHABLE_KEY=process.env.SUPABASE_PUBLISHABLE_KEY||'sb_publishable_heHXvAxo36EvgHg_8_XOXQ_rRxE5t5H';

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
  // New sb_secret_* keys are API keys, not JWTs. Legacy service-role keys are
  // JWTs and still need Authorization for Auth admin compatibility.
  if(!key.startsWith('sb_secret_'))headers.Authorization=`Bearer ${key}`;
  return headers;
}

async function userFromToken(token){
  if(!token)return null;
  const response=await fetch(`${SUPABASE_URL}/auth/v1/user`,{
    headers:{apikey:SUPABASE_PUBLISHABLE_KEY,Authorization:`Bearer ${token}`}
  });
  if(!response.ok)return null;
  return response.json();
}

async function adminDb(path,options={}){
  const key=adminKey();
  const response=await fetch(`${SUPABASE_URL}/rest/v1/${path}`,{
    ...options,
    headers:adminHeaders(key,jsonHeaders(options.headers||{}))
  });
  return response;
}

async function deleteAuthUser(userId){
  const key=adminKey();
  const response=await fetch(`${SUPABASE_URL}/auth/v1/admin/users/${encodeURIComponent(userId)}`,{
    method:'DELETE',
    headers:adminHeaders(key)
  });
  return response;
}

module.exports={
  SUPABASE_URL,
  SUPABASE_PUBLISHABLE_KEY,
  bearerToken,
  adminKey,
  adminHeaders,
  userFromToken,
  adminDb,
  deleteAuthUser
};
