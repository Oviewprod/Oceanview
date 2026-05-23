/* ─── Preloader ──────────────────────────────── */
(function () {
  const preloader = document.getElementById('preloader');
  if (!preloader) return;

  const photos = [
    'assets/photos/accueil/0O0A0684.jpg',
    'assets/photos/accueil/0O0A1290.jpg',
    'assets/photos/accueil/0O0A5658.jpg',
    'assets/photos/accueil/0O0A8897.jpg',
    'assets/photos/accueil/0O0A4457.jpg',
  ];

  const photoBg = document.getElementById('preloaderPhoto');
  const content = preloader.querySelector('.preloader__content');
  const barSpan = preloader.querySelector('.preloader__bar span');

  const chosen = photos[Math.floor(Math.random() * photos.length)];
  photoBg.style.backgroundImage = "url('" + chosen + "')";

  requestAnimationFrame(() => {
    content.classList.add('visible');
    setTimeout(() => { photoBg.classList.add('visible'); }, 200);
    setTimeout(() => { barSpan.classList.add('running'); }, 300);
    setTimeout(() => {
      preloader.classList.add('exit');
      setTimeout(() => { preloader.style.display = 'none'; }, 750);
    }, 2600);
  });
})();

/* ─── Filtre tarifs ─── */
(function () {
  const btns = document.querySelectorAll('.work-filter__btn[data-tarif]');
  if (!btns.length) return;
  btns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const scrollY = window.scrollY;
      btns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const target = btn.dataset.tarif;
      document.querySelectorAll('.tarifs-body').forEach(section => {
        section.classList.toggle('hidden', section.dataset.tarifSection !== target);
      });
      window.scrollTo({ top: scrollY, behavior: 'instant' });
    });
  });
})();



/* ─── Logo background removal (overlay only) ─── */
(function () {
  const navOverlay = document.querySelector('.nav--overlay');
  if (!navOverlay) return;

  const img = navOverlay.querySelector('.nav__logo img');
  if (!img) return;

  function removeBg() {
    if (img.src.startsWith('data:')) return;
    const canvas = document.createElement('canvas');
    canvas.width  = img.naturalWidth;
    canvas.height = img.naturalHeight;
    const ctx = canvas.getContext('2d');
    ctx.drawImage(img, 0, 0);

    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const px = imageData.data;

    /* Sample background color from top-left corner */
    const bgR = px[0], bgG = px[1], bgB = px[2];
    const threshold = 55;

    for (let i = 0; i < px.length; i += 4) {
      const dr = px[i] - bgR, dg = px[i + 1] - bgG, db = px[i + 2] - bgB;
      if (Math.sqrt(dr * dr + dg * dg + db * db) < threshold) px[i + 3] = 0;
    }

    ctx.putImageData(imageData, 0, 0);
    img.src = canvas.toDataURL('image/png');
  }

  if (img.complete && img.naturalWidth) removeBg();
  else img.addEventListener('load', removeBg);
})();

/* ─── Navigation active state ─────────────────── */
(function () {
  const path = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav__links a').forEach(a => {
    if (a.getAttribute('href') === path) a.classList.add('active');
  });
})();

/* ─── Slideshow ──────────────────────────────── */
(function () {
  const slides  = document.querySelectorAll('.slide');
  const prevBtn = document.querySelector('.slide-arrow--prev');
  const nextBtn = document.querySelector('.slide-arrow--next');

  if (!slides.length) return;

  const total = slides.length;
  let current = 0;
  let timer   = null;
  const DELAY = 5500;

  /* Précharge la 1ère image avant de l'afficher */
  const firstBg = slides[0].style.backgroundImage.slice(5, -2);
  const img = new Image();
  img.src = firstBg;
  if (!slides[0].classList.contains('active')) {
    slides[0].classList.remove('active');
    img.onload = () => slides[0].classList.add('active');
  }

  function go(idx) {
    slides[current].classList.remove('active');
    current = (idx + total) % total;
    slides[current].classList.add('active');
  }

  function next() { go(current + 1); }
  function prev() { go(current - 1); }

  function startAuto() {
    clearInterval(timer);
    timer = setInterval(next, DELAY);
  }

  if (nextBtn) nextBtn.addEventListener('click', () => { next(); startAuto(); });
  if (prevBtn) prevBtn.addEventListener('click', () => { prev(); startAuto(); });

  /* Swipe support */
  let touchX = 0;
  document.addEventListener('touchstart', e => { touchX = e.touches[0].clientX; }, { passive: true });
  document.addEventListener('touchend', e => {
    const dx = e.changedTouches[0].clientX - touchX;
    if (Math.abs(dx) > 50) { dx < 0 ? next() : prev(); startAuto(); }
  }, { passive: true });

  startAuto();
})();

/* ─── Fade-in on scroll ──────────────────────── */
(function () {
  const items = document.querySelectorAll('.fade-in');
  if (!items.length) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((e, i) => {
      if (e.isIntersecting) {
        setTimeout(() => e.target.classList.add('visible'), i * 80);
        observer.unobserve(e.target);
      }
    });
  }, { threshold: 0.12 });

  items.forEach(el => observer.observe(el));
})();

/* ─── Filtre travail ─────────────────────────── */
(function () {
  const btns = document.querySelectorAll('.work-filter__btn');
  if (!btns.length) return;
  const items = document.querySelectorAll('.work-item');

  btns.forEach(btn => {
    btn.addEventListener('click', () => {
      btns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const filter = btn.dataset.filter;
      items.forEach(item => {
        if (filter === 'all' || item.dataset.category === filter) {
          item.classList.remove('hidden');
        } else {
          item.classList.add('hidden');
        }
      });
    });
  });
})();

/* ─── Masonry stagger (pages client) ────────── */
(function () {
  const container = document.querySelector('.client-photos');
  if (!container) return;

  const imgs = Array.from(container.querySelectorAll('img'));
  if (!imgs.length) return;

  const leftCol = document.createElement('div');
  leftCol.className = 'client-photos__col';
  const rightCol = document.createElement('div');
  rightCol.className = 'client-photos__col client-photos__col--right';

  imgs.forEach((img, i) => {
    if (i % 2 === 0) leftCol.appendChild(img);
    else rightCol.appendChild(img);
  });

  container.innerHTML = '';
  container.appendChild(leftCol);
  container.appendChild(rightCol);
})();

/* ─── Zoom photos (pages client) ─────────────── */
(function () {
  const photos = document.querySelector('.client-photos');
  if (!photos) return;

  const overlay = document.createElement('div');
  overlay.className = 'zoom-overlay';
  overlay.innerHTML = '<button class="zoom-close" aria-label="Fermer">&#x2715;</button><img src="" alt="Zoom" />';
  document.body.appendChild(overlay);

  const zoomImg  = overlay.querySelector('img');
  const closeBtn = overlay.querySelector('.zoom-close');

  function open(src) {
    zoomImg.src = src;
    overlay.classList.add('open');
    document.body.style.overflow = 'hidden';
  }

  function close() {
    overlay.classList.remove('open');
    document.body.style.overflow = '';
  }

  photos.addEventListener('click', e => {
    if (e.target.tagName === 'IMG') open(e.target.src);
  });

  closeBtn.addEventListener('click', close);
  overlay.addEventListener('click', e => { if (e.target === overlay) close(); });
  document.addEventListener('keydown', e => { if (e.key === 'Escape') close(); });
})();
