// Max date for input is today
const startDateInput = document.getElementById('startDate');
const todayStr = new Date().toISOString().split('T')[0];
startDateInput.setAttribute('max', todayStr);

const yourNameInput = document.getElementById('yourName');
const partnerNameInput = document.getElementById('partnerName');
const loveForm = document.getElementById('loveForm');
const resultDiv = document.getElementById('result');
const resetBtn = document.getElementById('resetBtn');

let timerInterval = null;

// Russian pluralization helper
function pluralize(n, forms) {
  n = Math.abs(n) % 100;
  let n1 = n % 10;
  if (n > 10 && n < 20) return forms[2];
  if (n1 > 1 && n1 < 5) return forms[1];
  if (n1 === 1) return forms[0];
  return forms[2];
}

// Save data to localStorage
function saveData(yourName, partnerName, startDate) {
  localStorage.setItem('loveCounterData', JSON.stringify({
    yourName, partnerName, startDate
  }));
}

// Load data from localStorage
function loadData() {
  const data = localStorage.getItem('loveCounterData');
  if (!data) return null;
  try {
    return JSON.parse(data);
  } catch {
    return null;
  }
}

// Clear data
function clearData() {
  localStorage.removeItem('loveCounterData');
  yourNameInput.value = '';
  partnerNameInput.value = '';
  startDateInput.value = '';
  resultDiv.textContent = '';
  resultDiv.style.opacity = 0;
  clearInterval(timerInterval);
  timerInterval = null;
}

// Format time difference into years, months, days, hours, minutes, seconds
function formatDuration(diffMs) {
  let seconds = Math.floor(diffMs / 1000);
  const years = Math.floor(seconds / (365 * 24 * 60 * 60));
  seconds -= years * 365 * 24 * 60 * 60;
  const months = Math.floor(seconds / (30 * 24 * 60 * 60));
  seconds -= months * 30 * 24 * 60 * 60;
  const days = Math.floor(seconds / (24 * 60 * 60));
  seconds -= days * 24 * 60 * 60;
  const hours = Math.floor(seconds / (60 * 60));
  seconds -= hours * 60 * 60;
  const minutes = Math.floor(seconds / 60);
  seconds -= minutes * 60;

  return { years, months, days, hours, minutes, seconds };
}

// Build the display message
function buildMessage(yourName, partnerName, diffMs) {
  const d = formatDuration(diffMs);

  // Compose main part
  let mainText = '';
  if (d.years > 0) {
    mainText += `${d.years} ${pluralize(d.years, ['год', 'года', 'лет'])}`;
    if (d.months > 0) {
      mainText += ` и ${d.months} ${pluralize(d.months, ['месяц', 'месяца', 'месяцев'])}`;
    }
  } else if (d.months > 0) {
    mainText += `${d.months} ${pluralize(d.months, ['месяц', 'месяца', 'месяцев'])}`;
    if (d.days > 0) {
      mainText += ` и ${d.days} ${pluralize(d.days, ['день', 'дня', 'дней'])}`;
    }
  } else if (d.days > 0) {
    mainText += `${d.days} ${pluralize(d.days, ['день', 'дня', 'дней'])}`;
  } else {
    mainText += 'меньше дня';
  }

  // Time part (hours, minutes, seconds)
  const timeParts = [];
  if (d.hours > 0) timeParts.push(`${d.hours} ${pluralize(d.hours, ['час', 'часа', 'часов'])}`);
  if (d.minutes > 0) timeParts.push(`${d.minutes} ${pluralize(d.minutes, ['минута', 'минуты', 'минут'])}`);
  if (d.seconds > 0) timeParts.push(`${d.seconds} ${pluralize(d.seconds, ['секунда', 'секунды', 'секунд'])}`);

  let timeText = '';
  if (timeParts.length > 0) {
    timeText = timeParts.join(' и ');
  }

  let fullMessage = `Вы вместе уже ${mainText}`;
  if (timeText) fullMessage += ` и ${timeText}`;
  fullMessage += ' 💕';

  return `Привет, ${yourName}!\nС ${partnerName} ${fullMessage}`;
}

// Show the result and animate
function showResult(text) {
  resultDiv.textContent = text;
  resultDiv.style.opacity = 0;
  resultDiv.style.transform = "translateY(25px)";
  void resultDiv.offsetWidth; // trigger reflow
  resultDiv.style.animation = "fadeInResult 0.6s ease forwards";
}

// Start live timer updating every second
function startTimer(yourName, partnerName, startDate) {
  if (timerInterval) clearInterval(timerInterval);
  timerInterval = setInterval(() => {
    const now = new Date();
    const diffMs = now - startDate;
    if (diffMs < 0) {
      showResult("Дата начала не может быть в будущем.");
      clearInterval(timerInterval);
      return;
    }
    const message = buildMessage(yourName, partnerName, diffMs);
    showResult(message);
  }, 1000);
}

// Load saved data on page load
window.addEventListener('DOMContentLoaded', () => {
  const saved = loadData();
  if (saved) {
    yourNameInput.value = saved.yourName;
    partnerNameInput.value = saved.partnerName;
    startDateInput.value = saved.startDate;
    startTimer(saved.yourName, saved.partnerName, new Date(saved.startDate));
  }
});

// Form submission handler
loveForm.addEventListener('submit', e => {
  e.preventDefault();

  const yourName = yourNameInput.value.trim();
  const partnerName = partnerNameInput.value.trim();
  const startDateVal = startDateInput.value;
  const startDate = new Date(startDateVal);

  if (!yourName || !partnerName || !startDateVal) {
    alert("Пожалуйста, заполните все поля корректно.");
    return;
  }
  if (startDate > new Date()) {
    alert("Дата начала не может быть в будущем.");
    return;
  }

  saveData(yourName, partnerName, startDateVal);
  startTimer(yourName, partnerName, startDate);
});

// Reset button handler
resetBtn.addEventListener('click', () => {
  if (confirm("Вы уверены, что хотите сбросить данные?")) {
    clearData();
  }
});

// Floating hearts animation (unchanged from before)
function createFloatingHeart() {
  const heartsContainer = document.getElementById('floating-hearts');
  const heart = document.createElement('div');
  heart.classList.add('floating-heart');
  heart.style.left = Math.random() * window.innerWidth + 'px';
  heart.style.fontSize = 12 + Math.random() * 20 + 'px';
  heart.style.animationDuration = 3 + Math.random() * 3 + 's';
  heart.style.animationDelay = Math.random() * 5 + 's';
  heart.textContent = '❤️';

  heartsContainer.appendChild(heart);

  setTimeout(() => {
    heart.remove();
  }, 6000);
}

setInterval(createFloatingHeart, 700);
