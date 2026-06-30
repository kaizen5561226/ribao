const API_BASE = 'http://localhost:3000';

// 检查登录状态
(function init() {
  const token = localStorage.getItem('token');
  if (!token) {
    window.location.href = 'index.html';
    return;
  }

  fetch(`${API_BASE}/api/verify`, {
    headers: { 'Authorization': `Bearer ${token}` }
  })
  .then(res => res.json())
  .then(data => {
    if (data.code === 200) {
      const phone = data.data.phone;
      document.getElementById('phoneDisplay').textContent = phone.replace(/(\d{3})\d{4}(\d{4})/, '$1****$2');
    } else {
      localStorage.removeItem('token');
      localStorage.removeItem('phone');
      window.location.href = 'index.html';
    }
  })
  .catch(() => {
    window.location.href = 'index.html';
  });
})();

function logout() {
  localStorage.removeItem('token');
  localStorage.removeItem('phone');
  window.location.href = 'index.html';
}
