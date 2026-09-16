(() => {
  'use strict';
  const R=()=>window.RUMO;
  const q=(s,r=document)=>r.querySelector(s);

  function ensureAuthCopy(){
    const modal=q('#auth-v3 .auth-shell');
    if(!modal)return;
    const brand=q('.auth-brand',modal);
    if(brand){
      const mark=q('.auth-brand-mark',brand),strong=q('strong',brand),sub=q('span',brand);
      if(mark)mark.textContent='R';
      if(strong)strong.textContent='RUMO';
      if(sub)sub.textContent='Sua preparação salva e sincronizada.';
    }
    const title=q('h2',modal),intro=title?.nextElementSibling;
    if(title)title.textContent='Acesse seu RUMO';
    if(intro?.tagName==='P')intro.textContent='Entre ou crie sua conta grátis para manter plano, questões, redações e revisões no mesmo lugar.';
    if(!q('.auth-security-note',modal)){
      const form=q('#auth-form-v3',modal);
      const note=document.createElement('div');
      note.className='auth-security-note';
      note.innerHTML='<div><b>Conta gratuita e sincronizada.</b><br>Seu progresso fica ligado ao seu login para continuar em outro dispositivo.</div>';
      form?.after(note);
    }
    const email=q('#auth-email-v3');
    const password=q('#auth-password-v3');
    if(email){email.placeholder='seuemail@exemplo.com';email.autocapitalize='none';email.spellcheck=false}
    if(password)password.placeholder='Sua senha';
  }

  function ensureAccountCard(){
    const modal=q('#account-v3 .account-shell');
    if(!modal)return;
    const title=q('h2',modal);if(title)title.textContent='Sua conta';
    let summary=q('.account-summary',modal);
    if(summary&&!q('.account-status-v4',summary)){
      const copy=summary.lastElementChild;
      const status=document.createElement('span');
      status.className='account-status-v4';
      status.textContent='Conta sincronizada';
      copy?.appendChild(status);
    }
    const config=q('#account-config-v3'),sync=q('#account-sync-v3'),logout=q('#account-logout-v3');
    if(config)config.innerHTML='Objetivo e rotina<span>Altere prova, disponibilidade e nível atual.</span>';
    if(sync)sync.innerHTML='Sincronizar agora<span>Atualize o progresso salvo neste dispositivo.</span>';
    if(logout)logout.innerHTML='Sair da conta<span>Encerra esta sessão do RUMO.</span>';
  }

  function accountButton(){
    const r=R(),button=q('#account-btn');if(!r||!button)return;
    const user=r.state?.user;
    button.classList.toggle('is-authenticated',!!user);
    button.setAttribute('aria-label',user?'Abrir minha conta':'Entrar ou criar conta');
    const label=q('#account-label',button);
    if(label){
      if(user){
        const name=user.user_metadata?.display_name||user.email?.split('@')[0]||'Minha conta';
        label.textContent=name.split(/\s+/)[0];
      }else label.textContent='Entrar / Criar conta';
    }
  }

  function authMode(){
    const form=q('#auth-form-v3'),password=q('#auth-password-v3'),name=q('#auth-name-v3');if(!form||!password)return;
    const mode=form.dataset.mode||'login';
    password.autocomplete=mode==='signup'?'new-password':'current-password';
    password.minLength=mode==='signup'?8:6;
    if(name)name.required=mode==='signup';
    const submit=q('.auth-submit',form);if(submit)submit.textContent=mode==='signup'?'Criar minha conta':'Entrar na minha conta';
  }

  function watchAuthTabs(){
    document.querySelectorAll('[data-auth-v3]').forEach(btn=>{
      if(btn.dataset.uxV4)return;
      btn.dataset.uxV4='1';
      btn.addEventListener('click',()=>queueMicrotask(authMode));
    });
  }

  async function validateSessionPresentation(){
    const r=R();if(!r?.sb)return;
    try{
      const {data}=await r.sb.auth.getSession();
      if(data?.session?.user&&!r.state.user)r.state.user=data.session.user;
      accountButton();
    }catch(_){accountButton()}
  }

  function enhance(){ensureAuthCopy();ensureAccountCard();accountButton();authMode();watchAuthTabs()}

  document.addEventListener('rumo:booted',()=>{enhance();validateSessionPresentation()},{once:true});
  document.addEventListener('rumo:context',()=>queueMicrotask(()=>{enhance();validateSessionPresentation()}));
  document.addEventListener('click',e=>{
    if(e.target.closest?.('#account-btn,#account-v3,[data-auth-v3]'))queueMicrotask(enhance);
  },true);
  enhance();
})();
