const SUPABASE_URL='https://zycpeiyztqysjqejtour.supabase.co';
const SUPABASE_KEY='sb_publishable_heHXvAxo36EvgHg_8_XOXQ_rRxE5t5H';
const GATEWAY_URL='https://ai-gateway.vercel.sh/v1/chat/completions';
const MODEL=process.env.RUMO_AI_MODEL||'google/gemini-3.6-flash';
const DAILY_LIMIT=20;

function json(res,status,data){res.status(status).setHeader('Content-Type','application/json; charset=utf-8');res.setHeader('Cache-Control','no-store');res.end(JSON.stringify(data))}
function safeText(v,max=2000){return String(v||'').replace(/[\u0000-\u001f]/g,' ').trim().slice(0,max)}
function midnightUTC(){const d=new Date();return new Date(Date.UTC(d.getUTCFullYear(),d.getUTCMonth(),d.getUTCDate())).toISOString()}
async function supa(path,token,options={}){return fetch(`${SUPABASE_URL}${path}`,{...options,headers:{apikey:SUPABASE_KEY,Authorization:`Bearer ${token}`,'Content-Type':'application/json',...(options.headers||{})}})}

module.exports=async function handler(req,res){
  if(req.method!=='POST')return json(res,405,{error:'method_not_allowed'});
  const auth=req.headers.authorization||'';
  if(!auth.startsWith('Bearer '))return json(res,401,{error:'auth_required'});
  const token=auth.slice(7);

  try{
    const userRes=await supa('/auth/v1/user',token);
    if(!userRes.ok)return json(res,401,{error:'invalid_session'});
    const user=await userRes.json();

    const usageRes=await supa(`/rest/v1/ai_usage?user_id=eq.${encodeURIComponent(user.id)}&created_at=gte.${encodeURIComponent(midnightUTC())}&select=id`,token,{headers:{Prefer:'count=exact',Range:'0-0'}});
    const range=usageRes.headers.get('content-range')||'';
    const used=Number((range.split('/')[1]||'0').replace('*','0'))||0;
    if(used>=DAILY_LIMIT)return json(res,429,{error:'daily_limit',limit:DAILY_LIMIT});

    const body=typeof req.body==='string'?JSON.parse(req.body||'{}'):(req.body||{});
    const question=safeText(body.question,2200);
    if(!question)return json(res,400,{error:'empty_question'});
    const context=body.context&&typeof body.context==='object'?body.context:{};
    const history=Array.isArray(body.history)?body.history.slice(-6).map(x=>({role:x.role==='assistant'?'assistant':'user',content:safeText(x.content,1200)})):[];

    const goal=safeText(context.goal,300),role=safeText(context.role,200),examDate=safeText(context.examDate,40),weeklyHours=Number(context.weeklyHours)||0;
    const tasks=Array.isArray(context.tasks)?context.tasks.slice(0,6).map(x=>safeText(x,220)).join('\n'):'';
    const weak=Array.isArray(context.weakPoints)?context.weakPoints.slice(0,5).map(x=>safeText(x,220)).join('\n'):'';
    const system=`Você é o Assistente RUMO, parte do produto EDEN RUMO. Responda em português brasileiro, de forma objetiva, clara e útil para estudo e concursos. Use o contexto do usuário quando ele for relevante, mas nunca invente dados ausentes. Não prometa aprovação. Para informações de edital, datas, leis ou regras que possam mudar, avise quando for necessário conferir fonte oficial. Mantenha o foco em estudo, organização, revisão, conteúdo educacional e estratégia de preparação. Se o pedido fugir desse escopo, redirecione brevemente para o uso educacional do RUMO.\n\nContexto atual:\nObjetivo: ${goal||'não informado'}\nCargo/foco: ${role||'não informado'}\nData da prova: ${examDate||'não informada'}\nHoras semanais: ${weeklyHours||'não informadas'}\nTarefas de hoje:\n${tasks||'nenhuma informada'}\nPontos fracos:\n${weak||'ainda sem dados suficientes'}`;

    const gatewayToken=process.env.AI_GATEWAY_API_KEY||process.env.VERCEL_OIDC_TOKEN;
    if(!gatewayToken)return json(res,503,{error:'gateway_not_configured'});
    const aiRes=await fetch(GATEWAY_URL,{method:'POST',headers:{Authorization:`Bearer ${gatewayToken}`,'Content-Type':'application/json','ai-reporting-tags':'product:eden-rumo,feature:assistant,env:production','ai-reporting-user':user.id},body:JSON.stringify({model:MODEL,temperature:.35,max_tokens:700,messages:[{role:'system',content:system},...history,{role:'user',content:question}]})});
    if(!aiRes.ok){const detail=safeText(await aiRes.text(),500);console.error('AI Gateway error',aiRes.status,detail);return json(res,502,{error:'gateway_error'});}
    const data=await aiRes.json(),answer=safeText(data?.choices?.[0]?.message?.content,7000);
    if(!answer)return json(res,502,{error:'empty_gateway_response'});
    await supa('/rest/v1/ai_usage',token,{method:'POST',headers:{Prefer:'return=minimal'},body:JSON.stringify({user_id:user.id,model:MODEL,prompt_chars:question.length,response_chars:answer.length})}).catch(()=>{});
    return json(res,200,{answer,model:MODEL,remaining:Math.max(0,DAILY_LIMIT-used-1)});
  }catch(err){console.error('RUMO assistant error',err);return json(res,500,{error:'internal_error'});}
};
