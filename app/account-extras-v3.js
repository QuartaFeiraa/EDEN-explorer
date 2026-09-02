(() => {
  'use strict';
  const R=()=>window.RUMO;
  let recoveryBound=false;

  function recoveryModal(){
    const r=R();
    if(r.qs('#recovery-v2'))return;
    document.body.insertAdjacentHTML('beforeend',`<div id="recovery-v2" class="modal"><div class="modal-card auth-shell"><div class="eyebrow">NOVA SENHA</div><h2>Crie uma nova senha.</h2><form id="recovery-form-v2" class="form-grid"><div class="field"><label>Nova senha</label><input id="recovery-password-v2" type="password" minlength="6" required placeholder="Mínimo de 6 caracteres"></div><div id="recovery-message-v2" class="form-message"></div><button class="primary" type="submit">Atualizar senha</button></form></div></div>`);
    r.qs('#recovery-form-v2').onsubmit=async e=>{
      e.preventDefault();
      const pass=r.qs('#recovery-password-v2').value,msg=r.qs('#recovery-message-v2');
      const {error}=await r.sb.auth.updateUser({password:pass});
      msg.className=`form-message ${error?'error':'success'}`;
      msg.textContent=error?'Não consegui atualizar a senha.':'Senha atualizada.';
      if(!error)setTimeout(()=>r.qs('#recovery-v2').classList.remove('open'),600);
    };
  }

  function injectFooterStyles(){
    if(document.querySelector('#eden-footer-v3-style'))return;
    const s=document.createElement('style');
    s.id='eden-footer-v3-style';
    s.textContent=`
      .sidebar .eden-footer{
        display:grid!important;
        justify-items:center!important;
        align-items:center!important;
        gap:8px!important;
        margin:16px 0 2px!important;
        padding-top:14px!important;
        border-top:1px solid rgba(255,255,255,.055)!important;
        color:inherit!important;
        letter-spacing:0!important;
        text-transform:none!important;
      }
      .sidebar .eden-brand-lockup{display:flex;align-items:center;justify-content:center;gap:7px;min-height:20px}
      .sidebar .eden-brand-lockup img{width:18px!important;height:18px!important;display:block;flex:0 0 18px;opacity:.9}
      .sidebar .eden-brand-lockup .eden-word{
        font-family:"Plus Jakarta Sans",Inter,sans-serif!important;
        font-size:13px!important;
        font-weight:600!important;
        letter-spacing:-.035em!important;
        line-height:1!important;
        color:rgba(232,238,248,.76)!important;
        text-transform:lowercase!important;
      }
      .sidebar .eden-links-v3{display:flex;align-items:center;justify-content:center;gap:8px;font-size:9px;line-height:1}
      .sidebar .eden-links-v3 a{color:rgba(139,151,171,.72)!important;text-decoration:none!important;font-weight:500!important;transition:color .18s ease}
      .sidebar .eden-links-v3 a:hover{color:rgba(226,233,244,.9)!important;text-decoration:none!important}
      .sidebar .eden-links-v3 .eden-link-dot{color:rgba(100,113,135,.45);font-size:8px;user-select:none}
      @media(max-width:780px){
        .sidebar .eden-footer{margin-top:12px!important;padding-top:12px!important}
        .sidebar .eden-links-v3{font-size:9px}
      }
    `;
    document.head.appendChild(s);
  }

  function footer(){
    const f=R().qs('.eden-footer');
    if(!f)return;
    injectFooterStyles();
    if(f.dataset.footerVersion==='3')return;
    f.dataset.footerVersion='3';
    f.removeAttribute('data-links');
    f.innerHTML=`
      <div class="eden-brand-lockup" aria-label="EDEN">
        <img src="./eden-mark.svg" alt="" aria-hidden="true">
        <span class="eden-word">eden</span>
      </div>
      <div class="eden-links-v3" aria-label="Links legais">
        <a href="./privacidade.html">Privacidade</a>
        <span class="eden-link-dot" aria-hidden="true">•</span>
        <a href="./termos.html">Termos</a>
      </div>`;
  }

  function bindRecovery(){
    if(recoveryBound)return;
    recoveryBound=true;
    R().sb.auth.onAuthStateChange(event=>{
      if(event==='PASSWORD_RECOVERY'){
        recoveryModal();
        R().qs('#recovery-v2')?.classList.add('open');
      }
    });
  }

  recoveryModal();
  footer();
  bindRecovery();
  document.addEventListener('rumo:booted',footer,{once:true});
})();
