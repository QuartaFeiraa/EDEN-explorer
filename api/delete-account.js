'use strict';

const {
  bearerToken,
  userFromToken,
  adminKey,
  adminDb,
  sessionIdFromToken,
  sessionIsActive,
  userOwnsStorageObjects,
  revokeAuthSessions,
  deleteAuthUser
}=require('./_lib/supabase');

const TERMINAL_SUBSCRIPTION_STATUS=new Set(['canceled','cancelled','expired','inactive','failed','rejected','free']);
const MAX_BODY_BYTES=1024;

function respond(res,status,data){
  res.status(status);
  res.setHeader('Content-Type','application/json; charset=utf-8');
  res.setHeader('Cache-Control','no-store');
  res.setHeader('X-Content-Type-Options','nosniff');
  res.end(JSON.stringify(data));
}

function requestBody(req){
  const length=Number(req.headers?.['content-length']||0);
  if(Number.isFinite(length)&&length>MAX_BODY_BYTES)throw new Error('body_too_large');
  if(req.body&&typeof req.body==='object'&&!Buffer.isBuffer(req.body))return req.body;
  if(typeof req.body==='string'){
    if(Buffer.byteLength(req.body,'utf8')>MAX_BODY_BYTES)throw new Error('body_too_large');
    try{return JSON.parse(req.body)}catch{return {}}
  }
  return {};
}

function crossSiteRequest(req){
  const site=String(req.headers?.['sec-fetch-site']||'').trim().toLowerCase();
  if(site==='cross-site')return true;
  const origin=String(req.headers?.origin||'').trim();
  if(!origin)return false;
  const proto=String(req.headers?.['x-forwarded-proto']||'https').split(',')[0].trim().toLowerCase();
  const host=String(req.headers?.['x-forwarded-host']||req.headers?.host||'').split(',')[0].trim().toLowerCase();
  if(!host||!['http','https'].includes(proto))return true;
  try{return new URL(origin).origin.toLowerCase()!==`${proto}://${host}`}
  catch{return true}
}

async function activeProviderSubscription(userId){
  const query=`subscriptions?user_id=eq.${encodeURIComponent(userId)}&select=status,provider,provider_subscription_id,cancel_at_period_end&limit=20`;
  const response=await adminDb(query);
  if(!response.ok)throw new Error('subscription_check_failed');
  const rows=await response.json().catch(()=>[]);
  return (Array.isArray(rows)?rows:[]).find(row=>{
    const providerId=String(row?.provider_subscription_id||'').trim();
    if(!providerId)return false;
    const status=String(row?.status||'').trim().toLowerCase();
    return !TERMINAL_SUBSCRIPTION_STATUS.has(status);
  })||null;
}

module.exports=async function handler(req,res){
  if(req.method!=='POST'){
    res.setHeader('Allow','POST');
    return respond(res,405,{error:'method_not_allowed'});
  }
  if(crossSiteRequest(req))return respond(res,403,{error:'cross_site_request_blocked'});

  let body;
  try{body=requestBody(req)}catch(error){
    if(error?.message==='body_too_large')return respond(res,413,{error:'request_too_large'});
    return respond(res,400,{error:'invalid_request'});
  }
  if(body.confirm!=='EXCLUIR')return respond(res,400,{error:'confirmation_required'});

  const token=bearerToken(req);
  if(!token)return respond(res,401,{error:'unauthorized'});
  if(!adminKey())return respond(res,503,{error:'account_deletion_unavailable'});

  try{
    const user=await userFromToken(token);
    if(!user?.id)return respond(res,401,{error:'unauthorized'});

    const sessionId=sessionIdFromToken(token);
    if(!sessionId||!(await sessionIsActive(user.id,sessionId))){
      return respond(res,401,{error:'inactive_session'});
    }

    const active=await activeProviderSubscription(user.id);
    if(active){
      return respond(res,409,{
        error:'active_subscription',
        message:'Cancele a assinatura antes de excluir a conta.'
      });
    }

    if(await userOwnsStorageObjects(user.id)){
      return respond(res,409,{error:'owned_storage_objects'});
    }

    const revoke=await revokeAuthSessions(token,'global');
    if(!revoke.ok){
      console.error('delete-account: session revocation failed',revoke.status);
      return respond(res,502,{error:'session_revocation_failed'});
    }

    const deletion=await deleteAuthUser(user.id);
    if(!deletion.ok){
      const text=await deletion.text().catch(()=>'');
      if(/storage|object owner|owns/i.test(text)){
        return respond(res,409,{error:'owned_storage_objects',sessions_revoked:true});
      }
      console.error('delete-account: auth deletion failed',deletion.status);
      return respond(res,502,{error:'account_deletion_failed',sessions_revoked:true});
    }

    return respond(res,200,{ok:true});
  }catch(error){
    console.error('delete-account:',String(error?.message||error).slice(0,160));
    return respond(res,500,{error:'account_deletion_failed'});
  }
};
