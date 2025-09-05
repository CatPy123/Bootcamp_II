let currentSettings = {
  enabled: true,
  favoriteColor: '#ec0089'
};

// Função para aplicar ou remover os destaques
function applyHighlights(settings) {
  const links = document.querySelectorAll('a');
  for (const link of links) {
    if (settings.enabled) {
      link.style.outline = `2px solid ${settings.favoriteColor}`;
    } else {
      link.style.outline = 'none';
    }
  }
}

// Carrega as configurações iniciais e aplica os destaques
chrome.storage.sync.get(currentSettings, (items) => {
  currentSettings = items;
  applyHighlights(currentSettings);
});

// Ouve por mudanças nas configurações e reaplica os destaques
chrome.storage.onChanged.addListener((changes, namespace) => {
  for (let [key, { newValue }] of Object.entries(changes)) {
    currentSettings[key] = newValue;
  }
  applyHighlights(currentSettings);
});