(() => {
  'use strict';
  const R=()=>window.RUMO;
  const q=(s,r=document)=>r.querySelector(s);
  let recoveryEventSeen=false;

  function ensureModal(){
    if(q('#password-recovery-v5'))return q('#password-recovery-v5');
    document.body.insertAdjacentHTML('beforeend',`
      <div id="password-recovery-v5" class="modal" role="dialog" aria-modal="true" aria-labelledby="password-recovery-title-v5">
        <div class="modal-card password-recovery-shell">
          <button type="button" class="close" id="password-recovery-close-v5" aria-label="Fechar">×</button>
          <div class="eyebrow">SEGURANÇA DA CONTA</div>
          <h2 id="password-recovery-title-v5">Crie uma nova senha</h2>
          <p>Use pelo menos 8 caracteres. Depois da troca, continue usando seu e-mail normalmente para entrar no RUMO.</p>
          <form id="password-recovery-form-v5" class="form-grid" novalidate>
            <div class="field">
              <label for="password-new-v5">Nova senha</label>
              <input id="password-new-v5" type="password" autocomplete="new-password" minlength="8" required placeholder="Mínimo de 8 caracteres">
            </div>
            <div class="field">
              <label for="password-confirm-v5">Confirmar nova senha</label>
              <input id="password-confirm-v5" type="password" autocomplete="new-password" minlength="8" required placeholder="Digite novamente">
            </div>
            <div id="password-recovery-message-v5" class="form-message" role="status" aria-live="polite"></div>
            <button type="submit" class="primary auth-submit" id="password-recovery-submit-v5">Atualizar senha</button>
          </form>
        </div>
      </div>`);
    const modal=q('#password-recovery-v5');
    q('#password-recovery-close-v5')?.addEventListener('click',()=>modal.classList.remove('open'));
    modal.addEventListener('click',e=>{if(e.target===modal)modal.classList.remove('open')});
    q('#password-recovery-form-v5')?.addEventListener('submit',submit);
    return modal;
  }

  function open(){
    const modal=ensureModal();
    const message=q('#password-recovery-message-v5');
    const p1=q('#password-new-v5'),p2=q('#password-confirm-v5');
    if(message)message.textContent='';
    if(p1)p1.value='';if(p2)p2.value='';
    modal.classList.add('open');
    setTimeout(()=>p1?.focus(),0);
  }

  async function submit(e){
    e.preventDefault();
    const r=R(),p1=q('#password-new-v5'),p2=q('#password-confirm-v5'),message=q('#password-recovery-message-v5'),button=q('#password-recovery-submit-v5');
    if(!r?.sb||!p1||!p2||!message||!button)return;
    const password=p1.value;
    if(password.length<8){message.textContent='A senha precisa ter pelo menos 8 caracteres.';return}
    if(password!==p2.value){message.textContent='As senhas não coincidem.';return}
    button.disabled=true;button.textContent='Atualizando…';message.textContent='';
    try{
      const {error}=await r.sb.auth.updateUser({password});
      if(error){message.textContent='Não foi possível atualizar a senha. Abra novamente o link de recuperação enviado ao seu e-mail.';return}
      message.textContent='Senha atualizada com sucesso.';
      setTimeout(()=>q('#password-recovery-v5')?.classList.remove('open'),850);
    }catch(_){
      message.textContent='Não foi possível atualizar a senha agora. Tente novamente.';
    }finally{
      button.disabled=false;button.textContent='Atualizar senha';
    }
  }

  function bindAuth(){
    const r=R();if(!r?.sb||window.__RUMO_RECOVERY_BOUND__)return;
    window.__RUMO_RECOVERY_BOUND__=true;
    r.sb.auth.onAuthStateChange((event)=>{
      if(event!=='PASSWORD_RECOVERY')return;
      recoveryEventSeen=true;
      // Supabase holds an auth lock during the callback. Open UI after returning.
      setTimeout(open,0);
    });
  }

  function boot(){ensureModal();bindAuth()}
  document.addEventListener('rumo:booted',boot,{once:true});
  boot();
  window.RUMO_ACCOUNT_RECOVERY={open,wasTriggered:()=>recoveryEventSeen};
})();
