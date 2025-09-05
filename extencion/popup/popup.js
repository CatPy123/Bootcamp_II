const btn = document.getElementById('ping');
const statusEl = document.getElementById('status');
btn.addEventListener('click', async () => {
  const res = await chrome.runtime.sendMessage({ type: 'PING' });
  statusEl.textContent = `Background está vivo: ${res.time}`;
});