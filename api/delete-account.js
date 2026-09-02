'use strict';

const {bearerToken,userFromToken,adminKey,adminDb,deleteAuthUser}=require('./_lib/supabase');

const TERMINAL_SUBSCRIPTION_STATUS=new Set(['canceled','cancelled','expired','inactive','failed','rejected','free']);

function respond(res,status,data){
  res.status(status);
  res.setHeader('Content-Type','application/json; charset=utf-8');
  res.setHeader('Cache-Control','no-store');
  res.setHeader('X-Content-Type-Options','nosniff');
  res.end(JSON.stringify(data));
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
  if(req.method!=='POST')return respond(res,405,{error:'method_not_allowed'});

  const body=req.body&&typeof req.body==='object'?req.body:{};
  if(body.confirm!=='EXCLUIR')return respond(res,400,{error:'confirmation_required'});

  const token=bearerToken(req);
  if(!token)return respond(res,401,{error:'unauthorized'});
  if(!adminKey())return respond(res,503,{error:'account_deletion_unavailable'});

  try{
    const user=await userFromToken(token);
    if(!user?.id)return respond(res,401,{error:'unauthorized'});

    const active=await activeProviderSubscription(user.id);
    if(active){
      return respond(res,409,{
        error:'active_subscription',
        message:'Cancele a assinatura antes de excluir a conta.'
      });
    }

    const deletion=await deleteAuthUser(user.id);
    if(!deletion.ok){
      const text=await deletion.text().catch(()=>'');
      if(/storage|object owner|owns/i.test(text)){
        return respond(res,409,{error:'owned_storage_objects'});
      }
      console.error('delete-account: auth deletion failed',deletion.status);
      return respond(res,502,{error:'account_deletion_failed'});
    }

    return respond(res,200,{ok:true});
  }catch(error){
    console.error('delete-account:',String(error?.message||error).slice(0,160));
    return respond(res,500,{error:'account_deletion_failed'});
  }
};
