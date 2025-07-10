// Lógica de gerenciamento de usuários (localStorage)
function getUsuarios() {
  return JSON.parse(localStorage.getItem('usuarios') || '[]');
}
function setUsuarios(users) {
  localStorage.setItem('usuarios', JSON.stringify(users));
}
function adicionarUsuario(username, password) {
  let users = getUsuarios();
  if (users.find(u => u.username === username)) return false;
  users.push({ username, password, banned: false });
  setUsuarios(users);
  return true;
}
function removerUsuario(username) {
  let users = getUsuarios();
  users = users.filter(u => u.username !== username);
  setUsuarios(users);
}
function banirUsuario(username) {
  let users = getUsuarios();
  users = users.map(u => u.username === username ? { ...u, banned: true } : u);
  setUsuarios(users);
}
function desbanirUsuario(username) {
  let users = getUsuarios();
  users = users.map(u => u.username === username ? { ...u, banned: false } : u);
  setUsuarios(users);
}
function checarLogin(username, password) {
  const user = getUsuarios().find(u => u.username === username);
  if (!user) return { ok: false, msg: 'Usuário não encontrado.' };
  if (user.banned) return { ok: false, msg: 'Usuário banido.' };
  if (user.password !== password) return { ok: false, msg: 'Senha incorreta.' };
  return { ok: true };
}

// Painel de Administração (Página 3)
function abrirPainelAdm() {
  document.body.innerHTML = '';
  document.body.classList.add('bg2');
  const painel = document.createElement('div');
  painel.className = 'painel-centralizado';
  painel.style.maxWidth = '420px';
  painel.innerHTML = `
    <div class='mensagem'>Painel de Administração de Usuários</div>
    <form id='add-user-form' style='margin-bottom:18px;'>
      <input type='text' id='novo-usuario' placeholder='Novo usuário' required style='margin-bottom:0;'>
      <input type='password' id='nova-senha' placeholder='Senha' required style='margin-bottom:0;'>
      <button type='submit'>Adicionar Usuário</button>
    </form>
    <div id='lista-usuarios'></div>
    <button id='voltar-login' style='margin-top:24px;background:#fff;color:#111;font-weight:bold;border-radius:8px;border:none;padding:8px 18px;box-shadow:0 0 8px #fff,0 0 2px #222;cursor:pointer;'>Voltar ao Login</button>
  `;
  document.body.appendChild(painel);
  renderUsuariosAdm();
  document.getElementById('add-user-form').addEventListener('submit', function(e) {
    e.preventDefault();
    const user = document.getElementById('novo-usuario').value.trim();
    const pass = document.getElementById('nova-senha').value;
    if (!user || !pass) return;
    if (!adicionarUsuario(user, pass)) {
      alert('Usuário já existe!');
      return;
    }
    document.getElementById('novo-usuario').value = '';
    document.getElementById('nova-senha').value = '';
    renderUsuariosAdm();
  });
  document.getElementById('voltar-login').onclick = function() { window.location.reload(); };
}
function renderUsuariosAdm() {
  const lista = document.getElementById('lista-usuarios');
  const users = getUsuarios();
  lista.innerHTML = users.length === 0 ? '<em>Nenhum usuário cadastrado.</em>' : '';
  users.forEach(u => {
    const div = document.createElement('div');
    div.className = 'user-item';
    div.innerHTML = `<b>${u.username}</b> ${u.banned ? '<span class="banido">(banido)</span>' : ''}` +
      `<button onclick="removerUsuarioUIAdm('${u.username}')">Remover</button>` +
      (u.banned
        ? `<button class='desbanir' onclick="desbanirUsuarioUIAdm('${u.username}')">Desbanir</button>`
        : `<button onclick="banirUsuarioUIAdm('${u.username}')">Banir</button>`);
    lista.appendChild(div);
  });
}
window.removerUsuarioUIAdm = function(username) { removerUsuario(username); renderUsuariosAdm(); };
window.banirUsuarioUIAdm = function(username) { banirUsuario(username); renderUsuariosAdm(); };
window.desbanirUsuarioUIAdm = function(username) { desbanirUsuario(username); renderUsuariosAdm(); };

// Login e painel de opções
const form = document.getElementById('login-form');
const resultado = document.getElementById('resultado');
let admLogado = false;
form.addEventListener('submit', function(e) {
  e.preventDefault();
  const usuario = document.getElementById('usuario').value;
  const senha = document.getElementById('senha').value;
  if (usuario === 'KoshKina' && senha === 'qPZ3E"T002l[') {
    admLogado = true;
    resultado.textContent = '';
    resultado.classList.remove('erro');
    // Remove todo o conteúdo do body e insere o painel de opções (com botão Painel Adm)
    document.body.innerHTML = '';
    document.body.classList.add('bg2');
    const painel = document.createElement('div');
    painel.id = 'painel-opcoes-root';
    painel.className = 'painel-centralizado';
    painel.innerHTML = `
      <button id='btn-admin-panel' style='position: absolute; top: 16px; right: 16px; z-index: 10; background: #fff; color: #111; font-weight: bold; border-radius: 6px; border: none; padding: 4px 10px; font-size: 0.95em; box-shadow: 0 0 6px #fff, 0 0 2px #222; cursor: pointer;'>Painel Adm</button>
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
    addPanelTilt();
    // Pausa o áudio da tela de login e toca o audio2.mp3
    const audioLogin = document.getElementById('bg-audio');
    if (audioLogin) audioLogin.pause();
    let audio2 = document.getElementById('bg-audio2');
    if (!audio2) {
      audio2 = document.createElement('audio');
      audio2.id = 'bg-audio2';
      audio2.src = 'audio2.mp3';
      audio2.loop = true;
      audio2.autoplay = true;
      audio2.volume = 0.5;
      document.body.appendChild(audio2);
    } else {
      audio2.play();
    }
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
    // Adiciona o evento do botão Painel Adm
    document.getElementById('btn-admin-panel').onclick = abrirPainelAdm;
    return;
  }
  const check = checarLogin(usuario, senha);
  if (check.ok) {
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
    addPanelTilt();
    // Pausa o áudio da tela de login e toca o audio2.mp3
    const audioLogin = document.getElementById('bg-audio');
    if (audioLogin) audioLogin.pause();
    let audio2 = document.getElementById('bg-audio2');
    if (!audio2) {
      audio2 = document.createElement('audio');
      audio2.id = 'bg-audio2';
      audio2.src = 'audio2.mp3';
      audio2.loop = true;
      audio2.autoplay = true;
      audio2.volume = 0.5;
      document.body.appendChild(audio2);
    } else {
      audio2.play();
    }
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
    resultado.textContent = check.msg;
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
    const rotateX = -((y - centerY) / centerY) * 32; // até 32 graus
    const rotateY = ((x - centerX) / centerX) * 32;
    loginContainer.style.transform = `translate(-50%, -50%) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
  });
  loginContainer.addEventListener('mouseleave', function() {
    loginContainer.style.transform = 'translate(-50%, -50%)';
  });
}

// Efeito tilt/parallax no painel de opções
function addPanelTilt() {
  const painel = document.querySelector('.painel-centralizado');
  if (painel) {
    painel.addEventListener('mousemove', function(e) {
      const rect = painel.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;
      const rotateX = -((y - centerY) / centerY) * 32;
      const rotateY = ((x - centerX) / centerX) * 32;
      painel.style.transform = `rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
    });
    painel.addEventListener('mouseleave', function() {
      painel.style.transform = '';
    });
  }
}