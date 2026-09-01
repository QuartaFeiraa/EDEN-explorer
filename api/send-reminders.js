const webpush=require('web-push');
const SUPABASE_URL='https://zycpeiyztqysjqejtour.supabase.co';
function json(res,status,data){res.status(status).setHeader('Content-Type','application/json; charset=utf-8');res.setHeader('Cache-Control','no-store');res.end(JSON.stringify(data))}
async function db(path,key,options={}){return fetch(`${SUPABASE_URL}${path}`,{...options,headers:{apikey:key,Authorization:`Bearer ${key}`,'Content-Type':'application/json',...(options.headers||{})}})}
function saoPauloDate(){return new Intl.DateTimeFormat('en-CA',{timeZone:'America/Sao_Paulo',year:'numeric',month:'2-digit',day:'2-digit'}).format(new Date())}
module.exports=async function handler(req,res){
  if(req.method!=='GET')return json(res,405,{error:'method_not_allowed'});
  const cron=process.env.CRON_SECRET,key=process.env.SUPABASE_SERVICE_ROLE_KEY,pub=process.env.VAPID_PUBLIC_KEY,priv=process.env.VAPID_PRIVATE_KEY;
  if(!cron||req.headers.authorization!==`Bearer ${cron}`)return json(res,401,{error:'unauthorized'});
  if(!key||!pub||!priv)return json(res,503,{error:'push_not_configured'});
  webpush.setVapidDetails(process.env.VAPID_SUBJECT||'https://eden-rumo.vercel.app',pub,priv);
  let sent=0,disabled=0,errors=0;
  try{
    const prefRes=await db('/rest/v1/user_preferences?reminder_enabled=eq.true&select=user_id',key);const prefs=await prefRes.json();const allowed=new Set((Array.isArray(prefs)?prefs:[]).map(x=>x.user_id));
    if(!allowed.size)return json(res,200,{ok:true,sent,disabled,errors});
    const subRes=await db('/rest/v1/push_subscriptions?enabled=eq.true&select=*',key);const subs=(await subRes.json()).filter(x=>allowed.has(x.user_id));
    const today=saoPauloDate(),ids=[...new Set(subs.map(x=>x.user_id))];
    const tasksByUser=new Map();if(ids.length){const taskRes=await db(`/rest/v1/plano_tarefas?user_id=in.(${ids.join(',')})&data=eq.${today}&concluida=eq.false&select=user_id,minutos,titulo`,key);const tasks=await taskRes.json();for(const t of Array.isArray(tasks)?tasks:[]){const arr=tasksByUser.get(t.user_id)||[];arr.push(t);tasksByUser.set(t.user_id,arr)}}
    for(const sub of subs){const tasks=tasksByUser.get(sub.user_id)||[];if(!tasks.length)continue;const minutes=tasks.reduce((a,x)=>a+(Number(x.minutos)||0),0),payload=JSON.stringify({title:'Seu RUMO de hoje',body:`${tasks.length} ${tasks.length===1?'sessão':'sessões'} · ${minutes||30} min planejados. Abra e comece pelo próximo passo.`,url:'/?from=push',tag:`rumo-study-${today}`});try{await webpush.sendNotification({endpoint:sub.endpoint,keys:{p256dh:sub.p256dh,auth:sub.auth_secret}},payload,{TTL:60*60*8,urgency:'normal'});sent++}catch(error){const code=Number(error?.statusCode)||0;if(code===404||code===410){disabled++;await db(`/rest/v1/push_subscriptions?id=eq.${sub.id}`,key,{method:'PATCH',headers:{Prefer:'return=minimal'},body:JSON.stringify({enabled:false,updated_at:new Date().toISOString()})})}else{errors++;console.warn('push reminder',code,error?.message)}}}
    return json(res,200,{ok:true,sent,disabled,errors,date:today});
  }catch(error){console.error('send-reminders',error);return json(res,500,{error:'reminder_failed',sent,disabled,errors:errors+1})}
};
