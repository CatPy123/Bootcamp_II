const timerDisplay = document.getElementById('timer-display');
const progressBar = document.getElementById('progress-bar');
const startBtn = document.getElementById('start-btn');
const stopBtn = document.getElementById('stop-btn');
const resetBtn = document.getElementById('reset-btn');
const petImage = document.getElementById('pet-image');
const petStatus = document.getElementById('pet-status');

let countdown;

function updateUI(state) {
  const minutes = Math.floor(state.timeLeft / 60);
  const seconds = state.timeLeft % 60;
  timerDisplay.textContent = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  
  const totalDuration = (state.mode === 'focus' ? 25 : 5) * 60; // Simplificado, idealmente viria do storage.sync
  const progressPercent = (totalDuration - state.timeLeft) / totalDuration * 100;
  progressBar.style.width = `${progressPercent}%`;

  petImage.src = `../images/${state.pet.state || 'egg'}.png`;
  petStatus.textContent = `XP: ${state.pet.xp}`;

  startBtn.disabled = state.isRunning;
  stopBtn.disabled = !state.isRunning;
}

function startCountdown(endTime) {
  if (countdown) clearInterval(countdown);
  countdown = setInterval(() => {
    const timeLeft = Math.round((endTime - Date.now()) / 1000);
    if (timeLeft < 0) {
      clearInterval(countdown);
      return;
    }
    const minutes = Math.floor(timeLeft / 60);
    const seconds = timeLeft % 60;
    timerDisplay.textContent = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  }, 1000);
}

startBtn.addEventListener('click', () => {
  chrome.runtime.sendMessage({ command: 'start' }, () => window.close());
});

stopBtn.addEventListener('click', () => {
  chrome.runtime.sendMessage({ command: 'stop' }, () => window.close());
});

resetBtn.addEventListener('click', () => {
    chrome.runtime.sendMessage({ command: 'reset' }, () => window.close());
});

// Ao abrir o popup, pegar o estado atual
chrome.runtime.sendMessage({ command: 'getState' }, (state) => {
  updateUI(state);
  if (state.isRunning) {
    chrome.alarms.get('pomodoroTimer', (alarm) => {
      if (alarm) {
        startCountdown(alarm.scheduledTime);
      }
    });
  }
});


