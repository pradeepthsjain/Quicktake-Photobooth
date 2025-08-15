// Shooting stars animation
const canvas = document.getElementById('starfield');
const ctx = canvas.getContext('2d');
let stars = [];
let shootingStars = [];
const STAR_COUNT = 100;
const SHOOTING_STAR_FREQ = 0.012; // chance per frame

function resize() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}

function createStars() {
  stars = [];
  for (let i = 0; i < STAR_COUNT; i++) {
    stars.push({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      r: 0.7 + Math.random() * 1.2,
      o: 0.3 + Math.random() * 0.7
    });
  }
}

function drawStars() {
  for (let s of stars) {
    ctx.globalAlpha = s.o;
    ctx.beginPath();
    ctx.arc(s.x, s.y, s.r, 0, 2 * Math.PI);
    ctx.fillStyle = '#fff';
    ctx.shadowColor = '#fff';
    ctx.shadowBlur = 6;
    ctx.fill();
    ctx.shadowBlur = 0;
  }
  ctx.globalAlpha = 1;
}

function spawnShootingStar() {
  // Random edge (top or left)
  let fromTop = Math.random() < 0.5;
  let x = fromTop ? Math.random() * canvas.width : 0;
  let y = fromTop ? 0 : Math.random() * canvas.height;
  // Random angle (down-right)
  let angle = Math.PI / 4 + (Math.random() - 0.5) * Math.PI / 8;
  let speed = 8 + Math.random() * 6;
  shootingStars.push({
    x, y, angle, speed, len: 0, maxLen: 80 + Math.random() * 60, alpha: 1
  });
}

function drawShootingStars() {
  for (let i = shootingStars.length - 1; i >= 0; i--) {
    let s = shootingStars[i];
    let dx = Math.cos(s.angle) * s.speed;
    let dy = Math.sin(s.angle) * s.speed;
    ctx.save();
    ctx.globalAlpha = s.alpha;
    ctx.strokeStyle = '#fff';
    ctx.shadowColor = '#fff';
    ctx.shadowBlur = 12;
    ctx.beginPath();
    ctx.moveTo(s.x, s.y);
    ctx.lineTo(s.x - dx * s.len / s.speed, s.y - dy * s.len / s.speed);
    ctx.lineWidth = 2;
    ctx.stroke();
    ctx.restore();
    s.x += dx;
    s.y += dy;
    if (s.len < s.maxLen) s.len += s.speed * 1.5;
    else s.alpha -= 0.04;
    if (s.x > canvas.width || s.y > canvas.height || s.alpha <= 0) {
      shootingStars.splice(i, 1);
    }
  }
}

function animate() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  drawStars();
  if (Math.random() < SHOOTING_STAR_FREQ) spawnShootingStar();
  drawShootingStars();
  requestAnimationFrame(animate);
}

window.addEventListener('resize', () => {
  resize();
  createStars();
});

resize();
createStars();
animate();

// Back to Top button logic
const backToTop = document.getElementById('backToTop');
window.addEventListener('scroll', () => {
  backToTop.style.display = window.scrollY > 200 ? 'block' : 'none';
});
backToTop.onclick = () => {
  window.scrollTo({ top: 0, behavior: 'smooth' });
};

// Floating sublink menu logic (all screens)
const sublinkMenuBtn = document.getElementById('sublinkMenuBtn');
const sublinkMenu = document.getElementById('sublinkMenu');
sublinkMenuBtn.style.display = 'flex';
sublinkMenuBtn.addEventListener('click', () => {
  sublinkMenu.classList.toggle('show');
});

// Hide menu when clicking outside
document.addEventListener('click', (e) => {
  if (!sublinkMenu.contains(e.target) && !sublinkMenuBtn.contains(e.target)) {
    sublinkMenu.classList.remove('show');
  }
});

// Drag and drop for floating button
let isDragging = false;
let offsetX = 0, offsetY = 0;

sublinkMenuBtn.addEventListener('mousedown', function(e) {
  isDragging = true;
  offsetX = e.clientX - sublinkMenuBtn.getBoundingClientRect().left;
  offsetY = e.clientY - sublinkMenuBtn.getBoundingClientRect().top;
  document.body.style.userSelect = 'none';
});

document.addEventListener('mousemove', function(e) {
  if (!isDragging) return;
  let x = e.clientX - offsetX;
  let y = e.clientY - offsetY;
  // Keep button within viewport
  x = Math.max(0, Math.min(window.innerWidth - sublinkMenuBtn.offsetWidth, x));
  y = Math.max(0, Math.min(window.innerHeight - sublinkMenuBtn.offsetHeight, y));
  sublinkMenuBtn.style.top = y + 'px';
  sublinkMenuBtn.style.left = x + 'px';
  sublinkMenuBtn.style.right = 'auto';
  sublinkMenuBtn.style.bottom = 'auto';
  // Move menu with button
  sublinkMenu.style.top = (y + sublinkMenuBtn.offsetHeight + 10) + 'px';
  sublinkMenu.style.left = x + 'px';
  sublinkMenu.style.right = 'auto';
});

document.addEventListener('mouseup', function() {
  isDragging = false;
  document.body.style.userSelect = '';
});

// Touch support
sublinkMenuBtn.addEventListener('touchstart', function(e) {
  isDragging = true;
  const touch = e.touches[0];
  offsetX = touch.clientX - sublinkMenuBtn.getBoundingClientRect().left;
  offsetY = touch.clientY - sublinkMenuBtn.getBoundingClientRect().top;
  document.body.style.userSelect = 'none';
});

document.addEventListener('touchmove', function(e) {
  if (!isDragging) return;
  const touch = e.touches[0];
  let x = touch.clientX - offsetX;
  let y = touch.clientY - offsetY;
  x = Math.max(0, Math.min(window.innerWidth - sublinkMenuBtn.offsetWidth, x));
  y = Math.max(0, Math.min(window.innerHeight - sublinkMenuBtn.offsetHeight, y));
  sublinkMenuBtn.style.top = y + 'px';
  sublinkMenuBtn.style.left = x + 'px';
  sublinkMenuBtn.style.right = 'auto';
  sublinkMenuBtn.style.bottom = 'auto';
  sublinkMenu.style.top = (y + sublinkMenuBtn.offsetHeight + 10) + 'px';
  sublinkMenu.style.left = x + 'px';
  sublinkMenu.style.right = 'auto';
}, { passive: false });

document.addEventListener('touchend', function() {
  isDragging = false;
  document.body.style.userSelect = '';
});
