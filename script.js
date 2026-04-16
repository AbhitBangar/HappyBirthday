const TARGET_CODE = "2002";
let currentCode = "";

/* --- Router Logic --- */
document.addEventListener('DOMContentLoaded', () => {
  if (window.location.hash === '#music') {
    document.getElementById('stage1').classList.remove('active');
    document.getElementById('stage1').classList.add('hidden');
    document.getElementById('stage5').classList.remove('hidden');
    document.getElementById('stage5').classList.add('active');
  }
});

/* --- DOM Elements --- */
const dots = document.querySelectorAll('.dot');
const passcodeDotsContainer = document.querySelector('.passcode-dots');
const stage1 = document.getElementById('stage1');
const stage2 = document.getElementById('stage2');
const stage3 = document.getElementById('stage3');
const stage4 = document.getElementById('stage4');
const stage5 = document.getElementById('stage5');

/* --- Stage 1: Padlock Logic --- */
function updateDots() {
  dots.forEach((dot, index) => {
    if (index < currentCode.length) {
      dot.classList.add('filled');
    } else {
      dot.classList.remove('filled');
      dot.classList.remove('error');
    }
  });
}

function pressKey(num) {
  if (currentCode.length < 4) {
    currentCode += num;
    updateDots();

    if (currentCode.length === 4) {
      setTimeout(checkCode, 200);
    }
  }
}

function deleteKey() {
  if (currentCode.length > 0) {
    currentCode = currentCode.slice(0, -1);
    updateDots();
  }
}

function clearCode() {
  currentCode = "";
  updateDots();
}

function checkCode() {
  if (currentCode === TARGET_CODE) {
    stage1.classList.remove('active');
    stage1.classList.add('hidden');
    setTimeout(() => {
      stage2.classList.remove('hidden');
      stage2.classList.add('active');
    }, 600);
  } else {
    passcodeDotsContainer.classList.add('shake');
    dots.forEach(dot => dot.classList.add('error'));
    setTimeout(() => {
      passcodeDotsContainer.classList.remove('shake');
      currentCode = "";
      updateDots();
    }, 500);
  }
}

/* --- Stage 2: Gateway Runaway Button --- */
const noBtn = document.getElementById('no-btn');
const yesBtn = document.getElementById('yes-btn');

function runaway() {
  const maxMove = 70;
  const moveX = (Math.random() - 0.5) * 2 * maxMove;
  const moveY = (Math.random() - 0.5) * 2 * maxMove;
  noBtn.style.transform = `translate(${moveX}px, ${moveY}px)`;
}

noBtn.addEventListener('mouseenter', runaway);
noBtn.addEventListener('touchstart', (e) => {
  e.preventDefault();
  runaway();
});

yesBtn.addEventListener('click', () => {
  stage2.classList.remove('active');
  stage2.classList.add('hidden');
  setTimeout(() => {
    stage3.classList.remove('hidden');
    stage3.classList.add('active');
  }, 600);
});

/* --- Stage 3: Blowing Candles --- */
let tapCount = 0;
const cakeContainerDOM = document.getElementById('cake-blow-area');
const maskFlames = [
  document.getElementById('flame1'),
  document.getElementById('flame2'),
  document.getElementById('flame3')
];

cakeContainerDOM.addEventListener('click', () => {
  if (tapCount < 3) {
    if (maskFlames[tapCount]) maskFlames[tapCount].classList.add('blown');
    tapCount++;

    if (tapCount >= 3) {
      setTimeout(() => {
        stage3.classList.remove('active');
        stage3.classList.add('hidden');
        setTimeout(() => {
          stage4.classList.remove('hidden');
          stage4.classList.add('active');
        }, 600);
      }, 500);
    }
  }
});

/* --- Stage 4: Pick a Gift --- */
const wishes = [
  "Because some people are just built different — and you are one of them. 🌟",
  "You're going to be the kind of doctor people remember for the rest of their lives. 🩺",
  "Every hard chapter wasn't a setback. It was the universe making sure you were strong enough. 💖"
];

function openGift(boxElement) {
  // Add shake animation
  boxElement.classList.add('shake');

  setTimeout(() => {
    // Pick random wish
    const randomWish = wishes[Math.floor(Math.random() * wishes.length)];
    document.getElementById('wish-text').innerText = randomWish;

    // Show modal
    document.getElementById('wish-modal').classList.add('visible');
  }, 400);
}

function proceedToFinal() {
  stage4.classList.remove('active');
  stage4.classList.add('hidden');

  setTimeout(() => {
    stage5.classList.remove('hidden');
    stage5.classList.add('active');
    window.location.hash = 'music';
    fireConfetti();
  }, 600);
}

/* --- Stage 5: Confetti --- */
function fireConfetti() {
  const duration = 4000;
  const end = Date.now() + duration;

  (function frame() {
    confetti({
      particleCount: 4,
      angle: 60,
      spread: 55,
      origin: { x: 0 },
      colors: ['#FCA5A5', '#FFF']
    });
    confetti({
      particleCount: 4,
      angle: 120,
      spread: 55,
      origin: { x: 1 },
      colors: ['#FCA5A5', '#FFF']
    });
    if (Date.now() < end) {
      requestAnimationFrame(frame);
    }
  }());
}

/* --- Music Customizer --- */
const updateMusicBtn = document.getElementById('update-music-btn');
const musicLinkInput = document.getElementById('custom-music-link');
const musicFrame = document.getElementById('music-frame');

// Romantic Hindi Spotify Playlists (Audio-only widget)
// User's specific Romantic playlist (Audio-only widget)
const defaultPlaylists = [
  "https://open.spotify.com/embed/playlist/0zc6Hq9OIAengtGG6a3lfs?utm_source=generator&theme=0"
];

// Initialize with a random playlist
if (musicFrame) {
  musicFrame.src = defaultPlaylists[Math.floor(Math.random() * defaultPlaylists.length)];
}

if (updateMusicBtn) {
  updateMusicBtn.addEventListener('click', () => {
    const link = musicLinkInput.value.trim();
    if (!link) return;

    let embedUrl = link;
    let isValid = false;

    // Spotify
    if (link.includes('spotify.com')) {
      if (!link.includes('/embed/')) {
        embedUrl = link.replace('spotify.com/', 'spotify.com/embed/');
      }
      if (embedUrl.includes('?')) embedUrl = embedUrl.split('?')[0];
      embedUrl += '?utm_source=generator&theme=0';
      isValid = true;
    } 
    // Apple Music
    else if (link.includes('music.apple.com')) {
      if (!link.includes('embed.music.apple.com')) {
        embedUrl = link.replace('music.apple.com/', 'embed.music.apple.com/');
      }
      isValid = true;
    }
    // YouTube
    else if (link.includes('youtube.com') || link.includes('youtu.be')) {
      if (link.includes('playlist?list=')) {
        const listId = link.split('list=')[1].split('&')[0];
        embedUrl = `https://www.youtube.com/embed/videoseries?list=${listId}`;
        isValid = true;
      } else if (link.includes('watch?v=')) {
        const videoId = link.split('v=')[1].split('&')[0];
        embedUrl = `https://www.youtube.com/embed/${videoId}`;
        isValid = true;
      } else if (link.includes('youtu.be/')) {
        const videoId = link.split('youtu.be/')[1].split('?')[0];
        embedUrl = `https://www.youtube.com/embed/${videoId}`;
        isValid = true;
      }
    }

    if (isValid) {
      musicFrame.src = embedUrl;
      updateMusicBtn.innerText = 'Done!';
      setTimeout(() => updateMusicBtn.innerText = 'Update', 2000);
    } else {
      updateMusicBtn.innerText = 'Invalid';
      setTimeout(() => updateMusicBtn.innerText = 'Update', 2000);
    }
  });
}

/* --- Restart / Back Navigation Flow --- */
window.addEventListener('hashchange', () => {
  // If the user swipes back or presses native mobile back button, the #music hash is removed
  if (window.location.hash === '') {
    // Hide Stage 5
    document.getElementById('stage5').classList.remove('active');
    document.getElementById('stage5').classList.add('hidden');
    
    // Clear and restore Stage 1 passcode
    clearCode();
    tapCount = 0; // Reset candle taps
    maskFlames.forEach(f => { if(f) f.classList.remove('blown') }); // restore flames
    document.getElementById('wish-modal').classList.remove('visible'); // hide opened gift
    
    // Return to Stage 1
    document.getElementById('stage1').classList.remove('hidden');
    document.getElementById('stage1').classList.add('active');
    window.scrollTo(0, 0);
  }
});
