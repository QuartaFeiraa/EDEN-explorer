(() => {
  'use strict';
  const R=()=>window.RUMO;let cycle='monthly',recoveryBound=false;
  function pricing(){
    const r=R(),modal=r.qs('#upgrade-modal'),card=modal?.querySelector('.pricing-modal');if(!card||card.dataset.v2)return;card.dataset.v2='1';
    const title=card.querySelector('h2');if(title)title.textContent='Escolha seu RUMO sem pagar caro.';
    const p=card.querySelector('p');if(p)p.textContent='Durante o beta, os recursos estão liberados para teste. A cobrança real só entra quando a plataforma estiver pronta para venda.';
    const cards=[...card.querySelectorAll('.price-card')];cards.forEach((x,i)=>x.onclick=()=>{cards.forEach(y=>y.classList.remove('selected'));x.classList.add('selected');cycle=i===0?'monthly':'annual'});
    const btn=card.querySelector('.primary.full');if(btn){btn.textContent='Continuar no beta grátis';btn.onclick=()=>{localStorage.setItem('rumo-beta-interest',cycle);modal.classList.remove('open');r.toast('Beta liberado. Nenhuma cobrança foi feita.')}}
    if(!card.querySelector('.plan-readiness')){const note=document.createElement('div');note.className='plan-readiness';note.innerHTML='<strong>Sem cobrança no beta.</strong> Checkout e webhook entram somente quando houver uma conta de pagamentos configurada.';btn?.after(note)}
  }
  function recoveryModal(){
    const r=R();if(r.qs('#recovery-v2'))return;
    document.body.insertAdjacentHTML('beforeend',`<div id="recovery-v2" class="modal"><div class="modal-card auth-shell"><div class="eyebrow">NOVA SENHA</div><h2>Crie uma nova senha.</h2><form id="recovery-form-v2" class="form-grid"><div class="field"><label>Nova senha</label><input id="recovery-password-v2" type="password" minlength="6" required placeholder="Mínimo de 6 caracteres"></div><div id="recovery-message-v2" class="form-message"></div><button class="primary" type="submit">Atualizar senha</button></form></div></div>`);
    r.qs('#recovery-form-v2').onsubmit=async e=>{e.preventDefault();const pass=r.qs('#recovery-password-v2').value,msg=r.qs('#recovery-message-v2');const {error}=await r.sb.auth.updateUser({password:pass});msg.className=`form-message ${error?'error':'success'}`;msg.textContent=error?'Não consegui atualizar a senha.':'Senha atualizada.';if(!error)setTimeout(()=>r.qs('#recovery-v2').classList.remove('open'),600)};
  }
  function addRecovery(){
    const r=R(),form=r.qs('#auth-form');if(!form||r.qs('#forgot-password-v2'))return;const b=document.createElement('button');b.type='button';b.id='forgot-password-v2';b.className='soft-btn forgot-password-v2';b.textContent='Esqueci minha senha';const field=r.qs('#auth-password')?.closest('.field');field?.after(b);b.onclick=async()=>{const email=r.qs('#auth-email')?.value.trim(),msg=r.qs('#auth-message');if(!email){if(msg)msg.textContent='Digite seu e-mail primeiro.';return}const {error}=await r.sb.auth.resetPasswordForEmail(email,{redirectTo:location.origin});if(msg){msg.className=`form-message ${error?'error':'success'}`;msg.textContent=error?'Não consegui enviar o e-mail agora.':'Enviamos um link de recuperação para seu e-mail.'}};
  }
  function footer(){const f=R().qs('.eden-footer');if(!f||f.dataset.links)return;f.dataset.links='1';f.innerHTML='<span>EDEN</span><div class="eden-links-v2"><a href="./privacidade.html">Privacidade</a><a href="./termos.html">Termos</a></div>'}
  function bindRecovery(){if(recoveryBound)return;recoveryBound=true;R().sb.auth.onAuthStateChange(event=>{if(event==='PASSWORD_RECOVERY'){recoveryModal();R().qs('#recovery-v2')?.classList.add('open')}})}
  recoveryModal();pricing();footer();bindRecovery();addRecovery();
  document.addEventListener('click',e=>{if(e.target.closest?.('#account-btn'))setTimeout(addRecovery,0);if(e.target.closest?.('#upgrade-btn'))setTimeout(pricing,0)},true);
})();