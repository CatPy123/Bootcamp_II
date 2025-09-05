// Função para salvar as opções no chrome.storage
function saveOptions() {
  const isEnabled = document.getElementById('featureEnabled').checked;
  const color = document.getElementById('highlightColor').value;

  chrome.storage.sync.set(
    { enabled: isEnabled, favoriteColor: color },
    () => {
      // Exibe uma mensagem de confirmação para o usuário
      const status = document.getElementById('status');
      status.textContent = 'Opções salvas!';
      setTimeout(() => {
        status.textContent = '';
      }, 1500);
    }
  );
}

// Função para carregar as opções salvas e exibi-las na página
function restoreOptions() {
  // Define valores padrão
  chrome.storage.sync.get(
    { enabled: true, favoriteColor: '#ec0089' },
    (items) => {
      document.getElementById('featureEnabled').checked = items.enabled;
      document.getElementById('highlightColor').value = items.favoriteColor;
    }
  );
}

// Adiciona os event listeners
document.addEventListener('DOMContentLoaded', restoreOptions);
document.getElementById('save').addEventListener('click', saveOptions);