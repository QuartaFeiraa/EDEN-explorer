(() => {
  'use strict';
  const api=window.RUMO_ENEM;if(!api)return;
  const {data,q,qa,sb,state,escapeHTML}=api;
  let current=null;
  const key=id=>`rumo-enem-draft:${id}`;
  function count(){const text=q('#enem-essay-text')?.value||'',words=text.trim()?text.trim().split(/\s+/).length:0;const el=q('#enem-essay-count');if(el)el.textContent=`${words} palavras · ${text.length} caracteres`}
  async function select(id,focus=true){
    current=data.essays.find(x=>x.id===id)||data.essays[0];if(!current)return;
    qa('[data-essay-id]',q('#enem-essay-list')).forEach(b=>b.classList.toggle('active',b.dataset.essayId===current.id));
    const head=q('#enem-essay-head');if(head)head.innerHTML=`<small>TEMA</small><h2>${escapeHTML(current.title)}</h2><p>${escapeHTML(current.prompt)}</p>`;
    let content=localStorage.getItem(key(current.id))||'';
    if(state.user){try{const res=await sb.from('essay_drafts').select('content').eq('user_id',state.user.id).eq('essay_topic_id',current.id).maybeSingle();if(res.data?.content)content=res.data.content}catch(err){console.warn('Essay draft read degraded',err)}}
    const area=q('#enem-essay-text');if(area){area.value=content;count();if(focus)area.focus()}
  }
  function render(){
    const list=q('#enem-essay-list');if(!list)return;
    if(!data.essays.length){list.innerHTML='<div class="rumo-state"><b>Temas indisponíveis agora.</b><span>O editor será liberado quando a base responder.</span></div>';return}
    list.innerHTML='<small>TEMAS DE TREINO</small>'+data.essays.map((x,i)=>`<button data-essay-id="${escapeHTML(x.id)}" class="${i===0?'active':''}"><b>${escapeHTML(x.title)}</b><span>Tema autoral RUMO</span></button>`).join('');
    qa('[data-essay-id]',list).forEach(b=>b.onclick=()=>select(b.dataset.essayId));select(current?.id||data.essays[0].id,false)
  }
  async function save(){
    if(!current)return;const text=q('#enem-essay-text')?.value||'',status=q('#enem-essay-save');localStorage.setItem(key(current.id),text);if(status)status.textContent='Salvo neste dispositivo';
    if(state.user){const res=await sb.from('essay_drafts').upsert({user_id:state.user.id,essay_topic_id:current.id,content:text,updated_at:new Date().toISOString()},{onConflict:'user_id,essay_topic_id'});if(!res.error&&status)status.textContent='Sincronizado';if(res.error)console.warn('Essay sync degraded',res.error)}
  }
  q('#enem-essay-text')?.addEventListener('input',count);q('#enem-save-draft')?.addEventListener('click',save);
  document.addEventListener('rumo:enem-ready',render);document.addEventListener('rumo:context',()=>{if(current)select(current.id,false)});
  if(data.essays?.length)render();
  window.RUMO_ENEM_ESSAY={render,select,save};
})();