const SUPABASE_URL='https://zycpeiyztqysjqejtour.supabase.co';
const SUPABASE_KEY='sb_publishable_heHXvAxo36EvgHg_8_XOXQ_rRxE5t5H';
const MP_URL='https://api.mercadopago.com/preapproval';

function json(res,status,data){res.status(status).setHeader('Content-Type','application/json; charset=utf-8');res.setHeader('Cache-Control','no-store');res.end(JSON.stringify(data))}
async function supa(path,token,options={}){return fetch(`${SUPABASE_URL}${path}`,{...options,headers:{apikey:SUPABASE_KEY,Authorization:`Bearer ${token}`,'Content-Type':'application/json',...(options.headers||{})}})}

module.exports=async function handler(req,res){
  if(req.method!=='POST')return json(res,405,{error:'method_not_allowed'});
  const authorization=req.headers.authorization||'';
  if(!authorization.startsWith('Bearer '))return json(res,401,{error:'auth_required'});
  const token=authorization.slice(7);
  const mpToken=process.env.MERCADO_PAGO_ACCESS_TOKEN;
  const serviceKey=process.env.SUPABASE_SERVICE_ROLE_KEY;
  if(!mpToken||!serviceKey)return json(res,503,{error:'billing_not_configured'});

  try{
    const userRes=await supa('/auth/v1/user',token);
    if(!userRes.ok)return json(res,401,{error:'invalid_session'});
    const user=await userRes.json();
    const cycle=(req.body?.cycle==='annual')?'annual':'monthly';
    const plan=cycle==='annual'
      ?{amount:199,frequency:12,label:'RUMO Pro Anual'}
      :{amount:24.90,frequency:1,label:'RUMO Pro Mensal'};
    const publicUrl=(process.env.RUMO_PUBLIC_URL||'https://eden-rumo.vercel.app').replace(/\/$/,'');
    const externalReference=`rumo:${user.id}:${cycle}`;

    const mpRes=await fetch(MP_URL,{method:'POST',headers:{Authorization:`Bearer ${mpToken}`,'Content-Type':'application/json'},body:JSON.stringify({
      reason:plan.label,
      external_reference:externalReference,
      payer_email:user.email,
      auto_recurring:{frequency:plan.frequency,frequency_type:'months',transaction_amount:plan.amount,currency_id:'BRL'},
      back_url:`${publicUrl}/?billing=return`,
      status:'pending'
    })});
    const mp=await mpRes.json().catch(()=>({}));
    if(!mpRes.ok||!mp.id||!mp.init_point){console.error('Mercado Pago checkout',mpRes.status,mp);return json(res,502,{error:'provider_error'});}

    const upsert=await fetch(`${SUPABASE_URL}/rest/v1/subscriptions?on_conflict=user_id`,{method:'POST',headers:{apikey:serviceKey,Authorization:`Bearer ${serviceKey}`,'Content-Type':'application/json',Prefer:'resolution=merge-duplicates,return=minimal'},body:JSON.stringify({
      user_id:user.id,plan:'pro',billing_cycle:cycle,status:'pending',provider:'mercadopago',provider_subscription_id:String(mp.id),updated_at:new Date().toISOString()
    })});
    if(!upsert.ok)console.error('subscription upsert failed',await upsert.text());

    return json(res,200,{checkout_url:mp.init_point,subscription_id:String(mp.id),cycle});
  }catch(error){console.error('RUMO checkout',error);return json(res,500,{error:'internal_error'});}
};
