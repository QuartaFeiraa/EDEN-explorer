(() => {
  'use strict';
  const R=()=>window.RUMO;
  const SUPABASE_AUTH_PREFIX='sb-zycpeiyztqysjqejtour-auth-token';

  const OWNED_TABLES=[
    'user_goals','user_concursos','plano_tarefas','sessoes_estudo','study_sessions',
    'caderno_erros','edital_imports','contest_watchlist','course_progress','user_preferences',
    'user_consents','subscriptions','product_events','ai_usage','push_subscriptions'
  ];

  function safeFilenamePart(value='usuario'){
    return String(value||'usuario').toLowerCase().replace(/[^a-z0-9._-]+/g,'-').replace(/^-+|-+$/g,'').slice(0,48)||'usuario';
  }

  async function fetchRows(table,userId){
    const {data,error}=await R().sb.from(table).select('*').eq('user_id',userId);
    if(error){
      console.warn(`RUMO export: ${table} unavailable`,error.code||error.message);
      return {rows:[],unavailable:true};
    }
    return {rows:data||[],unavailable:false};
  }

  async function exportData(){
    const r=R(),user=r.state.user;
    if(!user){r.toast('Entre na conta para exportar seus dados.');return}
    r.toast('Preparando sua exportação...');

    const results=await Promise.all(OWNED_TABLES.map(async table=>[table,await fetchRows(table,user.id)]));
    const data={},unavailable=[];
    for(const [table,result] of results){data[table]=result.rows;if(result.unavailable)unavailable.push(table)}

    const userConcursos=data.user_concursos||[];
    const concursoIds=userConcursos.map(x=>x.id).filter(Boolean);
    let materias=[];
    if(concursoIds.length){
      const {data:rows,error}=await r.sb.from('materias').select('*').in('user_concurso_id',concursoIds);
      if(error)unavailable.push('materias');else materias=rows||[];
    }
    const materiaIds=materias.map(x=>x.id).filter(Boolean);
    let topicos=[];
    if(materiaIds.length){
      const {data:rows,error}=await r.sb.from('topicos').select('*').in('materia_id',materiaIds);
      if(error)unavailable.push('topicos');else topicos=rows||[];
    }

    const {data:profile,error:profileError}=await r.sb.from('profiles').select('*').eq('id',user.id).maybeSingle();
    if(profileError)unavailable.push('profiles');

    const payload={
      format:'EDEN-RUMO-export',
      schema_version:1,
      exported_at:new Date().toISOString(),
      account:{id:user.id,email:user.email||null,user_metadata:user.user_metadata||{}},
      data:{profile:profile||null,...data,materias,topicos},
      unavailable_tables:[...new Set(unavailable)]
    };

    const blob=new Blob([JSON.stringify(payload,null,2)],{type:'application/json;charset=utf-8'});
    const url=URL.createObjectURL(blob),a=document.createElement('a');
    a.href=url;
    a.download=`eden-rumo-dados-${safeFilenamePart(user.email?.split('@')[0])}-${new Date().toISOString().slice(0,10)}.json`;
    document.body.appendChild(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(url),1000);
    r.toast(unavailable.length?'Exportação criada com alguns dados indisponíveis.':'Seus dados foram exportados.');
  }

  function injectDeleteModal(){
    const r=R();if(r.qs('#delete-account-v1'))return;
    document.body.insertAdjacentHTML('beforeend',`<div id="delete-account-v1" class="modal"><div class="modal-card account-shell"><button class="close" id="delete-account-close-v1">×</button><div class="eyebrow">EXCLUIR CONTA</div><h2>Excluir sua conta e seus dados?</h2><p>Esta ação remove permanentemente seu perfil, plano, sessões, progresso, erros e preferências salvas. Antes de excluir, você pode exportar seus dados.</p><div class="field"><label>Digite <strong>EXCLUIR</strong> para confirmar</label><input id="delete-account-confirm-v1" autocomplete="off" spellcheck="false" placeholder="EXCLUIR"></div><div id="delete-account-message-v1" class="form-message"></div><div class="account-actions" style="margin-top:16px"><button id="delete-export-v1">Exportar meus dados primeiro</button><button id="delete-account-submit-v1" class="danger">Excluir permanentemente</button></div></div></div>`);
    const modal=r.qs('#delete-account-v1');
    r.qs('#delete-account-close-v1').onclick=()=>modal.classList.remove('open');
    modal.onclick=e=>{if(e.target===modal)modal.classList.remove('open')};
    r.qs('#delete-export-v1').onclick=exportData;
    r.qs('#delete-account-submit-v1').onclick=deleteAccount;
  }

  function openDelete(){
    injectDeleteModal();const r=R();
    r.qs('#delete-account-confirm-v1').value='';
    r.qs('#delete-account-message-v1').textContent='';
    r.qs('#delete-account-v1').classList.add('open');
    setTimeout(()=>r.qs('#delete-account-confirm-v1')?.focus(),80);
  }

  function clearLocalUserData(){
    ['rumo-guest-goal','rumo-lessons-v2','rumo-course-state','rumo-beta-interest'].forEach(k=>localStorage.removeItem(k));
    for(let i=localStorage.length-1;i>=0;i--){
      const key=localStorage.key(i);
      if(key?.startsWith(SUPABASE_AUTH_PREFIX))localStorage.removeItem(key);
    }
    sessionStorage.removeItem('rumo-onboarding-shown');
  }

  async function deleteAccount(){
    const r=R(),input=r.qs('#delete-account-confirm-v1'),msg=r.qs('#delete-account-message-v1'),button=r.qs('#delete-account-submit-v1');
    if(input.value.trim()!=='EXCLUIR'){msg.className='form-message error';msg.textContent='Digite EXCLUIR para confirmar.';return}
    const {data:{session}}=await r.sb.auth.getSession();
    if(!session?.access_token){msg.className='form-message error';msg.textContent='Sua sessão expirou. Entre novamente antes de excluir.';return}
    button.disabled=true;msg.className='form-message';msg.textContent='Excluindo conta...';
    try{
      const response=await fetch('/api/delete-account',{method:'POST',headers:{'Content-Type':'application/json',Authorization:`Bearer ${session.access_token}`},body:JSON.stringify({confirm:'EXCLUIR'})});
      const result=await response.json().catch(()=>({}));
      if(response.status===409&&result.error==='active_subscription'){
        msg.className='form-message error';msg.textContent='Existe uma assinatura ativa. Cancele a assinatura antes de excluir sua conta.';return
      }
      if(response.status===409&&result.error==='owned_storage_objects'){
        msg.className='form-message error';msg.textContent='Ainda existem arquivos associados à conta. A exclusão foi interrompida com segurança.';return
      }
      if(!response.ok){msg.className='form-message error';msg.textContent='Não foi possível excluir a conta agora.';return}
      await r.sb.auth.signOut({scope:'local'}).catch(()=>{});
      clearLocalUserData();
      location.replace(location.origin+location.pathname);
    }catch(_){
      msg.className='form-message error';msg.textContent='Não foi possível excluir a conta agora.';
    }finally{button.disabled=false}
  }

  function install(){
    const r=R(),actions=r.qs('#account-v3 .account-actions');
    if(!actions||actions.dataset.dataRightsV1)return;
    actions.dataset.dataRightsV1='1';
    const exportButton=document.createElement('button');exportButton.id='account-export-v1';exportButton.textContent='⇩ Exportar meus dados';exportButton.onclick=exportData;
    const deleteButton=document.createElement('button');deleteButton.id='account-delete-v1';deleteButton.className='danger';deleteButton.textContent='Excluir minha conta';deleteButton.onclick=openDelete;
    const logout=r.qs('#account-logout-v3');actions.insertBefore(exportButton,logout||null);actions.appendChild(deleteButton);
    injectDeleteModal();
  }

  install();
  document.addEventListener('rumo:context',install);
  document.addEventListener('click',e=>{if(e.target.closest?.('#account-btn'))setTimeout(install,0)},true);
  window.RUMO_DATA_RIGHTS={exportData,openDelete};
})();
