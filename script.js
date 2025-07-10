// Lógica simples de login
const form = document.getElementById('login-form');
const resultado = document.getElementById('resultado');

form.addEventListener('submit', function(e) {
  e.preventDefault();
  const usuario = document.getElementById('usuario').value;
  const senha = document.getElementById('senha').value;
  if (usuario === 'KoshKina' && senha === 'admin') {
    resultado.textContent = '';
    resultado.classList.remove('erro');
    // Remove todo o conteúdo do body e insere o painel de opções
    document.body.innerHTML = '';
    document.body.classList.add('bg2');
    const painel = document.createElement('div');
    painel.id = 'painel-opcoes-root';
    painel.className = 'painel-centralizado';
    painel.innerHTML = `
      <div class='mensagem'>Bem-vindo ao KoshKina Panel</div>
      <div class='painel-opcoes'>
        <div class='painel-col esq'>
          <div class='painel-item'>
            <label class='painel-label' for='dominio'>Delete Website</label>
            <input class='painel-input' id='dominio' type='text' placeholder='Digite o domínio (ex: exemplo.com)'>
            <button class='toggle-btn' id='toggle-site' type='button'>OFF</button>
            <div class='success-msg' id='msg-site' style='display:none'>successful deletion...</div>
          </div>
          <div class='painel-item'>
            <label class='painel-label' for='phishing'>Phishing</label>
            <input class='painel-input' id='phishing' type='text' placeholder='URL alvo'>
            <button class='toggle-btn' id='toggle-phishing' type='button'>OFF</button>
            <div class='success-msg' id='msg-phishing' style='display:none'>Created successfully...</div>
          </div>
          <div class='painel-item'>
            <label class='painel-label' for='rat'>RAT</label>
            <input class='painel-input' id='rat' type='text' placeholder='IP ou host'>
            <button class='toggle-btn' id='toggle-rat' type='button'>OFF</button>
            <div class='success-msg' id='msg-rat' style='display:none'>Created successfully...</div>
          </div>
          <div class='painel-item'>
            <label class='painel-label' for='keylogger'>Keylogger</label>
            <input class='painel-input' id='keylogger' type='text' placeholder='Destino'>
            <button class='toggle-btn' id='toggle-keylogger' type='button'>OFF</button>
            <div class='success-msg' id='msg-keylogger' style='display:none'>Created successfully...</div>
          </div>
        </div>
        <div class='painel-col dir'>
          <div class='painel-item'>
            <label class='painel-label' for='perfil'>Delete Profile</label>
            <input class='painel-input' id='perfil' type='text' placeholder='Digite o @perfil'>
            <button class='toggle-btn' id='toggle-perfil' type='button'>OFF</button>
            <div class='success-msg' id='msg-perfil' style='display:none'>Deleted successfully...</div>
          </div>
          <div class='painel-item'>
            <label class='painel-label' for='ip'>Tracked</label>
            <input class='painel-input' id='ip' type='text' placeholder='Digite o IP (ex: 123.123.123.123)'>
            <button class='toggle-btn' id='toggle-ip' type='button'>OFF</button>
            <div class='success-msg' id='msg-ip' style='display:none'>Tracked successfully...</div>
          </div>
          <div class='painel-item'>
            <label class='painel-label' for='sniffer'>Sniffer</label>
            <input class='painel-input' id='sniffer' type='text' placeholder='Rede alvo'>
            <button class='toggle-btn' id='toggle-sniffer' type='button'>OFF</button>
            <div class='success-msg' id='msg-sniffer' style='display:none'>Sucessfully Tracked...</div>
          </div>
          <div class='painel-item'>
            <label class='painel-label' for='spoofing'>Spoofing</label>
            <input class='painel-input' id='spoofing' type='text' placeholder='Alvo'>
            <button class='toggle-btn' id='toggle-spoofing' type='button'>OFF</button>
            <div class='success-msg' id='msg-spoofing' style='display:none'>Successfully masked...</div>
          </div>
        </div>
      </div>
    `;
    document.body.appendChild(painel);
    // Adiciona a lógica dos botões
    function toggleBtn(btn, msgId) {
      btn.classList.toggle('on');
      btn.textContent = btn.classList.contains('on') ? 'ON' : 'OFF';
      if (msgId) {
        var msg = document.getElementById(msgId);
        if (msg) msg.style.display = btn.classList.contains('on') ? 'block' : 'none';
      }
    }
    const ids = [
      {id: 'site', msg: 'msg-site'},
      {id: 'perfil', msg: 'msg-perfil'},
      {id: 'ip', msg: 'msg-ip'},
      {id: 'phishing', msg: 'msg-phishing'},
      {id: 'rat', msg: 'msg-rat'},
      {id: 'keylogger', msg: 'msg-keylogger'},
      {id: 'sniffer', msg: 'msg-sniffer'},
      {id: 'spoofing', msg: 'msg-spoofing'}
    ];
    ids.forEach(obj => {
      const btn = document.getElementById('toggle-' + obj.id);
      if (btn) btn.onclick = function() { toggleBtn(this, obj.msg); };
    });
  } else {
    resultado.textContent = 'Senha incorreta ou usuário não registrado.';
    resultado.classList.add('erro');
  }
});

// Efeito tilt/parallax na tela de login
const loginContainer = document.querySelector('.login-container');
if (loginContainer) {
  loginContainer.addEventListener('mousemove', function(e) {
    const rect = loginContainer.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    const rotateX = -((y - centerY) / centerY) * 40; // até 40 graus
    const rotateY = ((x - centerX) / centerX) * 40;
    loginContainer.style.transform = `translate(-50%, -50%) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
  });
  loginContainer.addEventListener('mouseleave', function() {
    loginContainer.style.transform = 'translate(-50%, -50%)';
  });
} 