const btn = document.getElementById('ping');
const statusEl = document.getElementById('status');
btn.addEventListener('click', async () => {
  statusEl.textContent = 'Enviando...';
  try {
    const res = await chrome.runtime.sendMessage({ type: 'PING' });
    statusEl.textContent = `Background respondeu: ${res.time}`;
  } catch (error) {
    statusEl.textContent = 'Erro: O background não respondeu.';
    console.error(error);
  }
});