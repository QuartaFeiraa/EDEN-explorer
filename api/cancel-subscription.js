const SUPABASE_URL='https://zycpeiyztqysjqejtour.supabase.co';
const SUPABASE_KEY='sb_publishable_heHXvAxo36EvgHg_8_XOXQ_rRxE5t5H';
function json(res,status,data){res.status(status).setHeader('Content-Type','application/json; charset=utf-8');res.setHeader('Cache-Control','no-store');res.end(JSON.stringify(data))}
async function supa(path,token,options={}){return fetch(`${SUPABASE_URL}${path}`,{...options,headers:{apikey:SUPABASE_KEY,Authorization:`Bearer ${token}`,'Content-Type':'application/json',...(options.headers||{})}})}
module.exports=async function handler(req,res){
  if(req.method!=='POST')return json(res,405,{error:'method_not_allowed'});
  const authorization=req.headers.authorization||'';if(!authorization.startsWith('Bearer '))return json(res,401,{error:'auth_required'});const token=authorization.slice(7);
  const mpToken=process.env.MERCADO_PAGO_ACCESS_TOKEN,serviceKey=process.env.SUPABASE_SERVICE_ROLE_KEY;if(!mpToken||!serviceKey)return json(res,503,{error:'billing_not_configured'});
  try{
    const userRes=await supa('/auth/v1/user',token);if(!userRes.ok)return json(res,401,{error:'invalid_session'});const user=await userRes.json();
    const subRes=await fetch(`${SUPABASE_URL}/rest/v1/subscriptions?user_id=eq.${user.id}&select=*`,{headers:{apikey:serviceKey,Authorization:`Bearer ${serviceKey}`}});const rows=await subRes.json();const sub=Array.isArray(rows)?rows[0]:null;
    if(!sub?.provider_subscription_id)return json(res,404,{error:'subscription_not_found'});
    const mpRes=await fetch(`https://api.mercadopago.com/preapproval/${encodeURIComponent(sub.provider_subscription_id)}`,{method:'PUT',headers:{Authorization:`Bearer ${mpToken}`,'Content-Type':'application/json'},body:JSON.stringify({status:'cancelled'})});
    if(!mpRes.ok){console.error('cancel MP',mpRes.status,await mpRes.text());return json(res,502,{error:'provider_error'});}
    await fetch(`${SUPABASE_URL}/rest/v1/subscriptions?user_id=eq.${user.id}`,{method:'PATCH',headers:{apikey:serviceKey,Authorization:`Bearer ${serviceKey}`,'Content-Type':'application/json',Prefer:'return=minimal'},body:JSON.stringify({status:'canceled',cancel_at_period_end:false,updated_at:new Date().toISOString()})});
    return json(res,200,{ok:true});
  }catch(error){console.error('cancel-subscription',error);return json(res,500,{error:'internal_error'});}
};
