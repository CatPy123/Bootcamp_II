// src/popup/popup.js (NOVA VERSÃO)

const timerDisplay = document.getElementById('timer-display');
const startBtn = document.getElementById('start-btn');
const stopBtn = document.getElementById('stop-btn');
let countdown; // Para o intervalo que atualiza a tela

// Função para atualizar o display do timer
function updateDisplay(minutes, seconds) {
    timerDisplay.textContent = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
}

// Iniciar o timer
startBtn.addEventListener('click', () => {
    chrome.runtime.sendMessage({ command: 'start' }, (response) => {
        if (response.success) {
            window.close(); // Fecha o popup para não distrair
        }
    });
});

// Parar o timer
stopBtn.addEventListener('click', () => {
    chrome.runtime.sendMessage({ command: 'stop' });
});

// Função principal que roda quando o popup é aberto
function syncWithBackground() {
    chrome.storage.local.get(['isRunning', 'timerMinutes', 'mode'], (res) => {
        updateDisplay(res.timerMinutes, 0); // Atualiza o display inicial
        // Lógica para atualizar o estado dos botões e do pet...
    });
    // Você precisaria de uma lógica mais avançada aqui para mostrar o tempo restante
    // O background gerencia o alarme, o popup apenas mostra o estado atual
}

document.addEventListener('DOMContentLoaded', syncWithBackground);


