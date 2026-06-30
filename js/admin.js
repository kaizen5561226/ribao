const API_BASE = 'http://localhost:3000';

// 加载白名单
function loadWhitelist() {
  fetch(`${API_BASE}/api/admin/whitelist`)
    .then(res => res.json())
    .then(data => {
      const tbody = document.getElementById('whitelistBody');
      const emptyTip = document.getElementById('emptyTip');
      const phones = data.data || [];

      if (phones.length === 0) {
        tbody.innerHTML = '';
        emptyTip.style.display = 'block';
        return;
      }

      emptyTip.style.display = 'none';
      tbody.innerHTML = phones.map((phone, index) => `
        <tr>
          <td>${index + 1}</td>
          <td>${phone}</td>
          <td><button class="btn-delete" onclick="deletePhone('${phone}')">删除</button></td>
        </tr>
      `).join('');
    })
    .catch(() => {
      showAdminMessage('网络错误，无法加载白名单', 'error');
    });
}

// 添加手机号
function addPhone() {
  const input = document.getElementById('newPhone');
  const phone = input.value.trim();

  if (!/^1\d{10}$/.test(phone)) {
    showAdminMessage('请输入正确的11位手机号码', 'error');
    return;
  }

  fetch(`${API_BASE}/api/admin/whitelist`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ phone })
  })
  .then(res => res.json())
  .then(data => {
    if (data.code === 200) {
      showAdminMessage(data.message, 'success');
      input.value = '';
      loadWhitelist();
    } else {
      showAdminMessage(data.message, 'error');
    }
  })
  .catch(() => {
    showAdminMessage('网络错误', 'error');
  });
}

// 删除手机号
function deletePhone(phone) {
  if (!confirm(`确定要删除手机号 ${phone} 吗？`)) return;

  fetch(`${API_BASE}/api/admin/whitelist/${phone}`, {
    method: 'DELETE'
  })
  .then(res => res.json())
  .then(data => {
    if (data.code === 200) {
      showAdminMessage(data.message, 'success');
      loadWhitelist();
    } else {
      showAdminMessage(data.message, 'error');
    }
  })
  .catch(() => {
    showAdminMessage('网络错误', 'error');
  });
}

function showAdminMessage(text, type) {
  const el = document.getElementById('adminMessage');
  el.textContent = text;
  el.className = `message ${type}`;
  setTimeout(() => { el.className = 'message'; }, 3000);
}

// 回车键添加
document.getElementById('newPhone').addEventListener('keydown', function(e) {
  if (e.key === 'Enter') addPhone();
});

// 初始加载
loadWhitelist();
