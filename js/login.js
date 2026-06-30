const API_BASE = 'http://localhost:3000';

// 检查是否已登录
(function checkLogin() {
  const token = localStorage.getItem('token');
  if (token) {
    fetch(`${API_BASE}/api/verify`, {
      headers: { 'Authorization': `Bearer ${token}` }
    })
    .then(res => res.json())
    .then(data => {
      if (data.code === 200) {
        window.location.href = 'home.html';
      }
    })
    .catch(() => {});
  }
})();

function showMessage(text, type) {
  const el = document.getElementById('message');
  el.textContent = text;
  el.className = `message ${type}`;
}

// 发送验证码
let countdown = 0;
function sendCode() {
  const phone = document.getElementById('phone').value.trim();
  if (!/^1\d{10}$/.test(phone)) {
    showMessage('请输入正确的11位手机号码', 'error');
    return;
  }
  if (countdown > 0) return;

  const btn = document.getElementById('sendCodeBtn');
  btn.disabled = true;

  fetch(`${API_BASE}/api/send-code`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ phone })
  })
  .then(res => res.json())
  .then(data => {
    if (data.code === 200) {
      showMessage(`验证码已发送！模拟验证码: ${data.data.code}`, 'success');
      // 开始倒计时
      countdown = 60;
      btn.textContent = `${countdown}s`;
      const timer = setInterval(() => {
        countdown--;
        if (countdown <= 0) {
          clearInterval(timer);
          btn.textContent = '获取验证码';
          btn.disabled = false;
        } else {
          btn.textContent = `${countdown}s`;
        }
      }, 1000);
    } else {
      showMessage(data.message, 'error');
      btn.disabled = false;
    }
  })
  .catch(() => {
    showMessage('网络错误，请稍后重试', 'error');
    btn.disabled = false;
  });
}

// 登录
function login() {
  const phone = document.getElementById('phone').value.trim();
  const code = document.getElementById('code').value.trim();

  if (!/^1\d{10}$/.test(phone)) {
    showMessage('请输入正确的11位手机号码', 'error');
    return;
  }
  if (!/^\d{6}$/.test(code)) {
    showMessage('请输入6位数字验证码', 'error');
    return;
  }

  const loginBtn = document.getElementById('loginBtn');
  loginBtn.disabled = true;

  fetch(`${API_BASE}/api/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ phone, code })
  })
  .then(res => res.json())
  .then(data => {
    if (data.code === 200) {
      showMessage('登录成功，正在跳转...', 'success');
      localStorage.setItem('token', data.data.token);
      localStorage.setItem('phone', data.data.phone);
      setTimeout(() => {
        window.location.href = 'home.html';
      }, 800);
    } else {
      showMessage(data.message, 'error');
      loginBtn.disabled = false;
    }
  })
  .catch(() => {
    showMessage('网络错误，请稍后重试', 'error');
    loginBtn.disabled = false;
  });
}

// 回车键提交
document.getElementById('code').addEventListener('keydown', function(e) {
  if (e.key === 'Enter') login();
});
document.getElementById('phone').addEventListener('keydown', function(e) {
  if (e.key === 'Enter') document.getElementById('code').focus();
});
