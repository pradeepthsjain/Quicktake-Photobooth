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

// EmailJS configuration
(function() {
    emailjs.init("NcUsKR8HmSBV0TN22"); // Your EmailJS public key
})();

let userAcceptedCookies = false;
let pendingDownload = null;

// Check if cookies were already accepted
window.onload = function() {
    if (localStorage.getItem('cookiesAccepted') === 'true') {
        document.getElementById('cookieBanner').style.display = 'none';
        userAcceptedCookies = true;
    }
};

function acceptCookies() {
    localStorage.setItem('cookiesAccepted', 'true');
    document.getElementById('cookieBanner').style.display = 'none';
    userAcceptedCookies = true;
}

function declineCookies() {
    document.getElementById('cookieBanner').style.display = 'none';
}

function trackQuotationClick(productName, pdfPath = null, fileName = null) {
    if (!userAcceptedCookies) {
        alert('Please accept cookies first to download quotations.');
        return;
    }
    
    // Store download info for later
    pendingDownload = { pdfPath, fileName, productName };
    
    // Show quick phone modal
    document.getElementById('quickEmailModal').style.display = 'flex';
    setTimeout(() => {
        const phoneInput = document.getElementById('quickEmail');
        phoneInput.focus();
        // Set cursor position after +91 
        phoneInput.setSelectionRange(4, 4);
    }, 100);
}

function submitQuickEmail() {
    const phoneNumber = document.getElementById('quickEmail').value;
    
    if (!phoneNumber) {
        skipEmail();
        return;
    }
    
    // Basic phone number validation
    const phoneRegex = /^[\+]?[0-9\s\-\(\)]{10,15}$/;
    if (!phoneRegex.test(phoneNumber)) {
        alert('Please enter a valid phone number');
        return;
    }
    
    // Send notification to you using your service ID
    emailjs.send("service_lmwi6zb", "template_aw2ibpe", {
        to_email: "enquiry@photobooths.in",
        customer_phone: phoneNumber,
        product_name: pendingDownload.productName,
        timestamp: new Date().toLocaleString(),
        message: `Phone: ${phoneNumber} requested quotation for ${pendingDownload.productName}`
    })
    .then(function() {
        alert('Thank you! We have your phone number and will contact you personally soon.');
        document.getElementById('quickEmailModal').style.display = 'none';
        document.getElementById('quickEmail').value = '';
        downloadPendingPDF();
    })
    .catch(function(error) {
        console.error('Email error:', error);
        alert('Contact details sent! Downloading your quotation...');
        document.getElementById('quickEmailModal').style.display = 'none';
        document.getElementById('quickEmail').value = '';
        downloadPendingPDF();
    });
}

function skipEmail() {
    document.getElementById('quickEmailModal').style.display = 'none';
    document.getElementById('quickEmail').value = '';
    downloadPendingPDF();
}

function downloadPendingPDF() {
    if (pendingDownload && pendingDownload.pdfPath) {
        const link = document.createElement('a');
        link.href = pendingDownload.pdfPath;
        link.download = pendingDownload.fileName;
        link.click();
    }
    pendingDownload = null;
}

// Close email modal when clicking outside
document.getElementById('quickEmailModal').addEventListener('click', function(e) {
    if (e.target === this) {
        skipEmail();
    }
});

// Close modal with Escape key
document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape') {
        const modal = document.getElementById('quickEmailModal');
        if (modal.style.display === 'flex') {
            skipEmail();
        }
    }
});

// Maintain +91 prefix in phone input
document.addEventListener('DOMContentLoaded', function() {
    const phoneInput = document.getElementById('quickEmail');
    
    phoneInput.addEventListener('input', function(e) {
        let value = e.target.value;
        
        // Always ensure it starts with +91 
        if (!value.startsWith('+91 ')) {
            e.target.value = '+91 ';
            e.target.setSelectionRange(4, 4);
        }
    });
    
    phoneInput.addEventListener('keydown', function(e) {
        const cursorPos = e.target.selectionStart;
        
        // Prevent deletion of +91 prefix
        if ((e.key === 'Backspace' || e.key === 'Delete') && cursorPos <= 4) {
            e.preventDefault();
        }
    });
    
    phoneInput.addEventListener('focus', function(e) {
        // Ensure cursor is after +91 when focused
        if (e.target.selectionStart < 4) {
            e.target.setSelectionRange(4, 4);
        }
    });
});
