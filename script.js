const tg = window.Telegram.WebApp;
tg.ready();

// Инициализация данных
let coins = parseInt(localStorage.getItem('mm_coins')) || 0;
let difficulty = parseInt(localStorage.getItem('mm_difficulty')) || 5;
let passivePerSec = parseInt(localStorage.getItem('mm_passive')) || 0;

const coinsEl = document.getElementById('coins');
const difficultyEl = document.getElementById('difficulty');
const hashDisplay = document.getElementById('hashDisplay');
const progressBar = document.getElementById('progressBar');
const statusText = document.getElementById('statusText');
const tapBtn = document.getElementById('tapBtn');
const buyDifficultyBtn = document.getElementById('buyDifficultyBtn');
const buyPassiveBtn = document.getElementById('buyPassiveBtn');

function saveData() {
  localStorage.setItem('mm_coins', coins);
  localStorage.setItem('mm_difficulty', difficulty);
  localStorage.setItem('mm_passive', passivePerSec);
  updateUI();
}

function updateUI() {
  coinsEl.textContent = coins;
  difficultyEl.textContent = difficulty;
}

updateUI();

// Имитация майнинга
function startMining() {
  if (tapBtn.classList.contains('disabled')) return;
  tapBtn.classList.add('disabled');
  statusText.textContent = 'Вычисление хеша...';
  hashDisplay.textContent = '--';

  const target = Math.pow(10, difficulty); // порог для «успеха»
  let attempts = 0;
  const maxAttempts = 1000; // защита от зависания

  function attempt() {
    const hash = Math.random().toString(36).substring(2, 10);
    const num = parseInt(hash, 36) || 0;
    attempts++;

    // Визуализация прогресса
    const progress = Math.min(100, (attempts / maxAttempts) * 100);
    progressBar.style.width = progress + '%';
    hashDisplay.textContent = hash;

    if (num < target || attempts >= maxAttempts) {
      if (num < target) {
        // Блок найден
        coins++;
        statusText.textContent = 'Блок найден! +1 монета';
        hashDisplay.style.color = '#00ff88';
      } else {
        // Не нашли за лимит попыток
        statusText.textContent = 'Не удалось найти подходящий хеш';
        hashDisplay.style.color = '#ff563d';
      }
      saveData();
      // Возвращаем кнопку через 1.5 сек
      setTimeout(() => {
        tapBtn.classList.remove('disabled');
        progressBar.style.width = '0%';
        statusText.textContent = 'Готов к майнингу';
        hashDisplay.style.color = '';
      }, 1500);
      return;
    }

    requestAnimationFrame(attempt);
  }

  attempt();
}

tapBtn.addEventListener('click', startMining);

// Улучшения
buyDifficultyBtn.addEventListener('click', () => {
  const cost = 100;
  if (coins >= cost) {
    coins -= cost;
    difficulty++;
    saveData();
    statusText.textContent = `Сложность повышена! Теперь майнить сложнее, но интереснее.`;
  } else {
    statusText.textContent = `Не хватает монет (нужно ${cost})`;
  }
});

buyPassiveBtn.addEventListener('click', () => {
  const cost = 200;
  if (coins >= cost) {
    coins -= cost;
    passivePerSec++;
    saveData();
    statusText.textContent = `Пассивный доход: +1 монета/сек`;
  } else {
    statusText.textContent = `Не хватает монет (нужно ${cost})`;
  }
});

// Пассивный доход
setInterval(() => {
  if (passivePerSec > 0) {
    coins += passivePerSec;
    updateUI();
    saveData();
  }
}, 1000);
