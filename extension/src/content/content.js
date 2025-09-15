let currentSettings = {
  enabled: true,
  favoriteColor: '#E5A4CB' // Nova cor padrão (rosé)
};

// --- FUNÇÃO ANTIGA: APLICAR DESTAQUES ---
function applyHighlights(settings) {
  const links = document.querySelectorAll('a');
  for (const link of links) {
    link.style.outline = settings.enabled ? `2px solid ${settings.favoriteColor}` : 'none';
  }
}

// --- NOVA FUNÇÃO: ADICIONAR BOTÕES DE COPIAR ---
function addCopyToCodeBlocks() {
  const codeBlocks = document.querySelectorAll('pre');
  
  codeBlocks.forEach((block, index) => {
    if (block.querySelector('.copy-code-button')) {
      return;
    }
    
    const button = document.createElement('button');
    button.className = 'copy-code-button';
    button.textContent = 'Copiar';
    
    button.addEventListener('click', () => {
      const code = block.querySelector('code');
      if (code) {
        const codeText = code.innerText;
        navigator.clipboard.writeText(codeText).then(() => {
          button.textContent = 'Copiado!';
          setTimeout(() => {
            button.textContent = 'Copiar';
          }, 2000);
        }).catch(err => {
          console.error('Falha ao copiar código: ', err);
          button.textContent = 'Erro!';
        });
      }
    });
    
    block.prepend(button);
  });
}

// --- LÓGICA PRINCIPAL ---

// Carrega as configurações iniciais e executa as funções
chrome.storage.sync.get(currentSettings, (items) => {
  currentSettings = items;
  if (currentSettings.enabled) {
    applyHighlights(currentSettings);
    addCopyToCodeBlocks();
  }
});

// Ouve por mudanças nas configurações e reaplica tudo
chrome.storage.onChanged.addListener((changes, namespace) => {
  const oldStatus = currentSettings.enabled;
  for (let [key, { newValue }] of Object.entries(changes)) {
    currentSettings[key] = newValue;
  }
  
  applyHighlights(currentSettings);
  if (currentSettings.enabled) {
    addCopyToCodeBlocks();
  } else if (!currentSettings.enabled && oldStatus) {
    document.querySelectorAll('.copy-code-button').forEach(btn => btn.remove());
  }
});
