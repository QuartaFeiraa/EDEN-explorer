const { WebhookSignatureValidator, InvalidWebhookSignatureError }=require('mercadopago');
const SUPABASE_URL='https://zycpeiyztqysjqejtour.supabase.co';

function reply(res,status,data={ok:true}){res.status(status).setHeader('Content-Type','application/json; charset=utf-8');res.end(JSON.stringify(data))}
function mapStatus(status){if(status==='authorized')return'active';if(status==='paused')return'paused';if(status==='cancelled'||status==='canceled')return'canceled';return'pending'}
async function mpGet(path,token){const r=await fetch(`https://api.mercadopago.com${path}`,{headers:{Authorization:`Bearer ${token}`}});if(!r.ok)throw new Error(`MP ${path} ${r.status}`);return r.json()}
async function db(path,serviceKey,options={}){return fetch(`${SUPABASE_URL}${path}`,{...options,headers:{apikey:serviceKey,Authorization:`Bearer ${serviceKey}`,'Content-Type':'application/json',...(options.headers||{})}})}
async function patchByProvider(id,patch,serviceKey){return db(`/rest/v1/subscriptions?provider_subscription_id=eq.${encodeURIComponent(id)}`,serviceKey,{method:'PATCH',headers:{Prefer:'return=minimal'},body:JSON.stringify({...patch,updated_at:new Date().toISOString()})})}

module.exports=async function handler(req,res){
  if(req.method!=='POST')return reply(res,405,{error:'method_not_allowed'});
  const mpToken=process.env.MERCADO_PAGO_ACCESS_TOKEN;
  const webhookSecret=process.env.MERCADO_PAGO_WEBHOOK_SECRET;
  const serviceKey=process.env.SUPABASE_SERVICE_ROLE_KEY;
  if(!mpToken||!webhookSecret||!serviceKey)return reply(res,503,{error:'billing_not_configured'});

  const xSignature=req.headers['x-signature'];
  const xRequestId=req.headers['x-request-id'];
  const dataId=String(req.query?.['data.id']||req.query?.data_id||req.body?.data?.id||'');
  if(!xSignature||!xRequestId||!dataId)return reply(res,400,{error:'invalid_webhook'});

  try{
    WebhookSignatureValidator.validate({xSignature,xRequestId,dataId,secret:webhookSecret});
  }catch(error){
    if(error instanceof InvalidWebhookSignatureError)return reply(res,401,{error:'invalid_signature'});
    console.error('Webhook signature',error);return reply(res,401,{error:'invalid_signature'});
  }

  const type=String(req.body?.type||req.query?.type||'');
  const eventId=String(req.body?.id||`${type}:${dataId}:${req.body?.action||''}`);
  try{
    const eventInsert=await db('/rest/v1/payment_events?on_conflict=provider,provider_event_id',serviceKey,{method:'POST',headers:{Prefer:'resolution=ignore-duplicates,return=minimal'},body:JSON.stringify({provider:'mercadopago',provider_event_id:eventId,event_type:type,payload:req.body||{}})});
    if(!eventInsert.ok)console.warn('payment event insert',await eventInsert.text());

    if(type==='subscription_preapproval'){
      const subscription=await mpGet(`/preapproval/${encodeURIComponent(dataId)}`,mpToken);
      const external=String(subscription.external_reference||'');
      const match=external.match(/^rumo:([0-9a-f-]{36}):(monthly|annual)$/i);
      const patch={status:mapStatus(subscription.status),provider:'mercadopago',provider_subscription_id:String(subscription.id),current_period_end:subscription.next_payment_date||null};
      if(match){
        const userId=match[1],cycle=match[2];
        await db('/rest/v1/subscriptions?on_conflict=user_id',serviceKey,{method:'POST',headers:{Prefer:'resolution=merge-duplicates,return=minimal'},body:JSON.stringify({user_id:userId,plan:'pro',billing_cycle:cycle,...patch})});
      }else await patchByProvider(String(subscription.id),patch,serviceKey);
    }else if(type==='subscription_authorized_payment'){
      const invoice=await mpGet(`/authorized_payments/${encodeURIComponent(dataId)}`,mpToken);
      if(invoice.preapproval_id){
        await patchByProvider(String(invoice.preapproval_id),{status:invoice.status==='approved'?'active':undefined,last_payment_at:invoice.status==='approved'?new Date().toISOString():undefined,provider_payment_id:String(invoice.payment?.id||invoice.id||dataId)},serviceKey);
      }
    }else if(type==='payment'){
      const payment=await mpGet(`/v1/payments/${encodeURIComponent(dataId)}`,mpToken);
      const external=String(payment.external_reference||'');
      const match=external.match(/^rumo:([0-9a-f-]{36}):(monthly|annual)$/i);
      if(match&&payment.status==='approved'){
        await db(`/rest/v1/subscriptions?user_id=eq.${match[1]}`,serviceKey,{method:'PATCH',headers:{Prefer:'return=minimal'},body:JSON.stringify({plan:'pro',billing_cycle:match[2],status:'active',last_payment_at:new Date().toISOString(),provider_payment_id:String(payment.id),updated_at:new Date().toISOString()})});
      }
    }

    await db(`/rest/v1/payment_events?provider=eq.mercadopago&provider_event_id=eq.${encodeURIComponent(eventId)}`,serviceKey,{method:'PATCH',headers:{Prefer:'return=minimal'},body:JSON.stringify({processed:true,processed_at:new Date().toISOString()})});
    return reply(res,200);
  }catch(error){
    console.error('Mercado Pago webhook processing',error);
    await db(`/rest/v1/payment_events?provider=eq.mercadopago&provider_event_id=eq.${encodeURIComponent(eventId)}`,serviceKey,{method:'PATCH',headers:{Prefer:'return=minimal'},body:JSON.stringify({processing_error:String(error?.message||error).slice(0,800)})}).catch(()=>{});
    return reply(res,200,{ok:true,deferred:true});
  }
};
