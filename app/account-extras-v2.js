(() => {
  'use strict';
  const R=()=>window.RUMO;let recoveryBound=false;
  function recoveryModal(){
    const r=R();if(r.qs('#recovery-v2'))return;
    document.body.insertAdjacentHTML('beforeend',`<div id="recovery-v2" class="modal"><div class="modal-card auth-shell"><div class="eyebrow">NOVA SENHA</div><h2>Crie uma nova senha.</h2><form id="recovery-form-v2" class="form-grid"><div class="field"><label>Nova senha</label><input id="recovery-password-v2" type="password" minlength="6" required placeholder="Mínimo de 6 caracteres"></div><div id="recovery-message-v2" class="form-message"></div><button class="primary" type="submit">Atualizar senha</button></form></div></div>`);
    r.qs('#recovery-form-v2').onsubmit=async e=>{e.preventDefault();const pass=r.qs('#recovery-password-v2').value,msg=r.qs('#recovery-message-v2');const {error}=await r.sb.auth.updateUser({password:pass});msg.className=`form-message ${error?'error':'success'}`;msg.textContent=error?'Não consegui atualizar a senha.':'Senha atualizada.';if(!error)setTimeout(()=>r.qs('#recovery-v2').classList.remove('open'),600)};
  }
  function footer(){const f=R().qs('.eden-footer');if(!f||f.dataset.links)return;f.dataset.links='1';f.innerHTML='<span>EDEN</span><div class="eden-links-v2"><a href="./privacidade.html">Privacidade</a><a href="./termos.html">Termos</a></div>'}
  function bindRecovery(){if(recoveryBound)return;recoveryBound=true;R().sb.auth.onAuthStateChange(event=>{if(event==='PASSWORD_RECOVERY'){recoveryModal();R().qs('#recovery-v2')?.classList.add('open')}})}
  recoveryModal();footer();bindRecovery();
})();
