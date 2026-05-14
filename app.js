/* ═══════════════════════════════════════════════════════════
   app.js — Forever Home Interiors
   ═══════════════════════════════════════════════════════════ */

'use strict';

/* ─────────────────────────────────────────────────────────
   NAV / HAMBURGER
   ───────────────────────────────────────────────────────── */
(function initNav() {
  const toggle = document.getElementById('navToggle');
  const links  = document.getElementById('navLinks');
  if (!toggle || !links) return;

  function setOpen(open) {
    toggle.setAttribute('aria-expanded', String(open));
    links.classList.toggle('open', open);
  }

  toggle.addEventListener('click', () => {
    setOpen(toggle.getAttribute('aria-expanded') !== 'true');
  });

  // Close menu when any link is activated
  links.querySelectorAll('a').forEach(a => {
    a.addEventListener('click', () => setOpen(false));
  });

  // Close on Escape
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape' && toggle.getAttribute('aria-expanded') === 'true') {
      setOpen(false);
      toggle.focus();
    }
  });

  // Close on outside click
  document.addEventListener('click', e => {
    if (!toggle.contains(e.target) && !links.contains(e.target)) {
      setOpen(false);
    }
  });
})();

/* ─────────────────────────────────────────────────────────
   SCROLL REVEAL
   ───────────────────────────────────────────────────────── */
(function initReveal() {
  const obs = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.classList.add('visible');
        obs.unobserve(e.target);
      }
    });
  }, { threshold: 0.08, rootMargin: '0px 0px -40px 0px' });

  document.querySelectorAll('.reveal').forEach(el => obs.observe(el));
})();

/* ─────────────────────────────────────────────────────────
   VIDEO — no more prompt()
   Replace VIDEO_SRC with your actual YouTube embed URL:
     https://www.youtube.com/embed/YOUR_VIDEO_ID?autoplay=1&rel=0
   Or a direct mp4 path:  'videos/demo.mp4'
   ───────────────────────────────────────────────────────── */
(function initVideo() {
  const placeholder = document.getElementById('videoPlaceholder');
  const embed       = document.getElementById('videoEmbed');
  if (!placeholder || !embed) return;

  // ▼ CONFIGURE: replace with your embed URL ▼
  const VIDEO_SRC = 'videos/demo.mp4';

  function activateVideo() {
    embed.src = VIDEO_SRC;
    embed.classList.add('active');
    placeholder.style.display = 'none';
  }

  placeholder.addEventListener('click', activateVideo);
  placeholder.addEventListener('keydown', e => {
    if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); activateVideo(); }
  });
})();

/* ─────────────────────────────────────────────────────────
   CONTACT FORM
   Uses Formspree for reliable delivery.
   1. Go to https://formspree.io — sign up free.
   2. Create a form and copy the endpoint URL.
   3. Paste it into FORMSPREE_URL below.
   ───────────────────────────────────────────────────────── */
(function initForm() {
  const form    = document.getElementById('contactForm');
  const success = document.getElementById('formSuccess');
  const btn     = document.getElementById('formSubmit');
  if (!form) return;

  // ▼ CONFIGURE: paste your Formspree form URL ▼
  const FORMSPREE_URL = 'https://formspree.io/f/YOUR_FORM_ID';

  /* ── Validation ── */
  function validateField(input) {
    const errEl = input.closest('.form-group')?.querySelector('.field-error');
    let msg = '';
    const val = input.value.trim();
    if (!val) {
      msg = 'This field is required.';
    } else if (input.type === 'email' && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val)) {
      msg = 'Please enter a valid email address.';
    }
    input.classList.toggle('invalid', !!msg);
    input.setAttribute('aria-invalid', String(!!msg));
    if (errEl) {
      errEl.textContent = msg;
      errEl.classList.toggle('visible', !!msg);
    }
    return !msg;
  }

  form.querySelectorAll('input, textarea').forEach(input => {
    input.addEventListener('blur', () => validateField(input));
    input.addEventListener('input', () => {
      if (input.classList.contains('invalid')) validateField(input);
    });
  });

  /* ── Submit ── */
  form.addEventListener('submit', async e => {
    e.preventDefault();
    const inputs  = [...form.querySelectorAll('input[required], textarea[required]')];
    const allValid = inputs.map(inp => validateField(inp)).every(Boolean);
    if (!allValid) {
      inputs.find(i => i.classList.contains('invalid'))?.focus();
      return;
    }

    const originalText = btn.textContent;
    btn.disabled    = true;
    btn.textContent = 'Sending…';

    try {
      const res = await fetch(FORMSPREE_URL, {
        method:  'POST',
        body:    new FormData(form),
        headers: { Accept: 'application/json' },
      });

      if (res.ok) {
        form.style.display = 'none';
        success.classList.add('visible');
        success.focus();
      } else {
        throw new Error(`HTTP ${res.status}`);
      }
    } catch (err) {
      console.error('Form error:', err);
      btn.disabled    = false;
      btn.textContent = originalText;

      // Graceful fallback — open mailto so the message isn't lost
      const name  = form.querySelector('[name="name"]')?.value  || '';
      const email = form.querySelector('[name="email"]')?.value  || '';
      const msg   = form.querySelector('[name="message"]')?.value || '';
      const sub   = encodeURIComponent(`Portfolio Enquiry from ${name}`);
      const body  = encodeURIComponent(`Name: ${name}\nEmail: ${email}\n\nMessage:\n${msg}`);
      window.location.href = `mailto:kaushikaanya236@gmail.com?subject=${sub}&body=${body}`;
    }
  });
})();

/* ═══════════════════════════════════════════════════════════
   FLIPBOOK ENGINE
   ═══════════════════════════════════════════════════════════ */
(function initFlipbook() {

  const canvas = document.getElementById('flipCanvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');

  /* ── Detect reduced motion preference ── */
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ── Canvas dimensions (responsive) ── */
  const BASE_W = 860, BASE_H = 580;
  let W = BASE_W, H = BASE_H;
  const SPINE = 28, PL = SPINE;

  function setCanvasSize() {
    const availW = Math.min(canvas.parentElement.clientWidth, BASE_W);
    const scale  = availW / BASE_W;
    W = Math.round(BASE_W * scale);
    H = Math.round(BASE_H * scale);
    canvas.width  = W;
    canvas.height = H;
  }

  setCanvasSize();

  let resizeTimer;
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => {
      setCanvasSize();
      if (!animating) requestAnimationFrame(ts => draw(ts, true));
    }, 150);
  });

  /* ── Image loading (lazy — only starts when flipbook enters viewport) ── */
  const loadedImgs = {};
  let imagesStarted = false;

  function loadImages() {
    if (imagesStarted) return;
    imagesStarted = true;

    Object.entries(IMGS).forEach(([key, url]) => {
      if (!url) return;
      const img = new Image();
      img.crossOrigin = 'anonymous';
      img.onload  = () => { loadedImgs[key] = img; if (!animating) requestAnimationFrame(ts => draw(ts, true)); };
      img.onerror = () => { console.warn(`[flipbook] Failed to load: ${url}`); };
      img.src = url;
    });
  }

  // Start loading when section is near the viewport
  const flipbookSection = document.getElementById('flipbook');
  if (flipbookSection) {
    const lazyObs = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting) { loadImages(); lazyObs.disconnect(); }
    }, { rootMargin: '300px' });
    lazyObs.observe(flipbookSection);
  } else {
    loadImages();
  }

  /* ─────────────────────────────────────────────────────────
     IMAGE DRAWING — professional contain / cover support
     ─────────────────────────────────────────────────────────
     fit = 'contain'  — shows the full image, no destructive crop.
                        Letterboxed bars use a warm neutral fill.
                        ✓ floor plans, section drawings, technical work.
     fit = 'cover'    — fills the slot completely, may crop edges.
                        ✓ interior perspective renders, photos.
  ───────────────────────────────────────────────────────── */
  function imgOrBox(key, x, y, w, h, label = '', fit = 'contain') {
    ctx.save();
    ctx.beginPath();
    ctx.rect(x, y, w, h);
    ctx.clip();

    if (loadedImgs[key]) {
      const img = loadedImgs[key];

      if (fit === 'cover') {
        /* scale so the smaller dimension fills the slot — crops excess */
        const sc = Math.max(w / img.width, h / img.height);
        const sw = img.width * sc, sh = img.height * sc;
        ctx.drawImage(img, x + (w - sw) / 2, y + (h - sh) / 2, sw, sh);
      } else {
        /* scale so the LARGER dimension fits inside the slot — no crop */
        const sc = Math.min(w / img.width, h / img.height);
        const sw = img.width * sc, sh = img.height * sc;
        /* Warm neutral letterbox fill — consistent with page bg tones */
        ctx.fillStyle = 'rgba(195, 188, 177, 0.22)';
        ctx.fillRect(x, y, w, h);
        ctx.drawImage(img, x + (w - sw) / 2, y + (h - sh) / 2, sw, sh);
      }
    } else {
      /* Placeholder skeleton */
      ctx.fillStyle  = 'rgba(170,159,149,0.22)'; ctx.fillRect(x, y, w, h);
      ctx.strokeStyle = 'rgba(170,159,149,0.4)';  ctx.lineWidth = 1;
      ctx.strokeRect(x + 0.5, y + 0.5, w - 1, h - 1);
      const fs = Math.max(9, Math.floor(h * 0.1));
      ctx.font      = `${fs}px Segoe UI,sans-serif`;
      ctx.fillStyle  = 'rgba(122,111,104,0.5)';
      ctx.textAlign  = 'center';
      ctx.fillText(label || '[ image ]', x + w / 2, y + h / 2 + fs * 0.35);
    }

    ctx.restore();
  }

  /* ── Text utilities ── */
  function wrapText(text, x, y, maxW, lineH) {
    const words = text.split(' ');
    let line = '', ly = y;
    for (const word of words) {
      const test = line ? `${line} ${word}` : word;
      if (ctx.measureText(test).width > maxW && line) {
        ctx.fillText(line, x, ly);
        line = word;
        ly  += lineH;
      } else {
        line = test;
      }
    }
    ctx.fillText(line, x, ly);
    return ly;
  }

  function smallLabel(text, cx, cy) {
    if (!text) return;
    ctx.save();
    ctx.font      = '9px Segoe UI,sans-serif';
    ctx.fillStyle  = 'rgba(62,31,32,0.45)';
    ctx.textAlign  = 'center';
    ctx.fillText(text, cx, cy);
    ctx.restore();
  }

  /* ─────────────────────────────────────────────────────────
     DRAW ONE PAGE
     ───────────────────────────────────────────────────────── */
  function drawPageContent(p, x, y, w, h) {
    const pw = w, ph = h;
    const fits = p.fits || [];
    const PAD  = 10;

    /* Background */
    ctx.fillStyle = p.bg;
    ctx.fillRect(x, y, pw, ph);

    /* Top rule */
    ctx.save();
    ctx.strokeStyle = 'rgba(170,159,149,0.25)'; ctx.lineWidth = 0.8;
    ctx.beginPath(); ctx.moveTo(x + 12, y + 40); ctx.lineTo(x + pw - 12, y + 40); ctx.stroke();
    ctx.restore();

    /* Tag pill (top-right) */
    ctx.save();
    ctx.font = '9px Segoe UI,sans-serif';
    const tagW = ctx.measureText(p.tag).width + 20;
    ctx.fillStyle = 'rgba(62,31,32,0.08)';
    ctx.beginPath(); ctx.roundRect(x + pw - tagW - 10, y + 14, tagW, 18, 9); ctx.fill();
    ctx.fillStyle = 'rgba(62,31,32,0.45)'; ctx.textAlign = 'right';
    ctx.fillText(p.tag, x + pw - 18, y + 27);
    ctx.restore();

    const imgTop = y + 48;

    /* ── hero ── */
    if (p.layout === 'hero') {
      const imgH = ph * 0.6;
      imgOrBox(p.imgs[0], x + PAD, imgTop, pw - PAD * 2, imgH, 'Top View Floor Plan', fits[0] || 'contain');
      ctx.save();
      ctx.font      = `italic ${Math.floor(ph * 0.068)}px Georgia,serif`;
      ctx.fillStyle  = p.accent; ctx.textAlign = 'left';
      ctx.fillText(p.title, x + PAD, imgTop + imgH + 24);
      ctx.font      = `${Math.floor(ph * 0.042)}px Segoe UI,sans-serif`;
      ctx.fillStyle  = 'rgba(122,111,104,0.9)';
      wrapText(p.desc, x + PAD, imgTop + imgH + 46, pw - PAD * 2, ph * 0.052);
      ctx.restore();
    }

    /* ── grid4 (2×2) ── */
    else if (p.layout === 'grid4') {
      ctx.save();
      ctx.font = `italic ${Math.floor(ph * 0.06)}px Georgia,serif`;
      ctx.fillStyle = p.accent; ctx.textAlign = 'left';
      ctx.fillText(p.title, x + PAD, imgTop - 4);
      ctx.restore();

      const gx = x + PAD, gy = imgTop + 8;
      const gw = (pw - PAD * 3) / 2;
      const gh = (ph - (gy - y) - PAD * 1.5) / 2;
      const labels = p.labels || ['', '', '', ''];
      [[gx, gy], [gx + gw + PAD, gy], [gx, gy + gh + PAD], [gx + gw + PAD, gy + gh + PAD]]
        .forEach(([ix, iy], i) => {
          imgOrBox(p.imgs[i] || '', ix, iy, gw, gh, labels[i], fits[i] || 'contain');
          smallLabel(labels[i], ix + gw / 2, iy + gh + 11);
        });
    }

    /* ── stack2 (two side-by-side) ── */
    else if (p.layout === 'stack2') {
      ctx.save();
      ctx.font = `italic ${Math.floor(ph * 0.06)}px Georgia,serif`;
      ctx.fillStyle = p.accent; ctx.textAlign = 'left';
      ctx.fillText(p.title, x + PAD, imgTop - 4);
      ctx.font = `${Math.floor(ph * 0.038)}px Segoe UI,sans-serif`;
      ctx.fillStyle = 'rgba(122,111,104,0.9)';
      const ty = wrapText(p.desc, x + PAD, imgTop + 18, pw - PAD * 2, ph * 0.048);
      ctx.restore();

      const imgAreaTop = ty + 16;
      const iw = (pw - PAD * 3) / 2;
      const ih = ph - (imgAreaTop - y) - PAD;
      imgOrBox(p.imgs[0], x + PAD,           imgAreaTop, iw, ih, 'Exterior View 1', fits[0] || 'contain');
      imgOrBox(p.imgs[1], x + PAD * 2 + iw,  imgAreaTop, iw, ih, 'Exterior View 2', fits[1] || 'contain');
    }

    /* ── grid3+1 (3 small top, 1 wide bottom) ── */
    else if (p.layout === 'grid3+1') {
      ctx.save();
      ctx.font = `italic ${Math.floor(ph * 0.058)}px Georgia,serif`;
      ctx.fillStyle = p.accent; ctx.textAlign = 'left';
      ctx.fillText(p.title, x + PAD, imgTop - 4);
      ctx.font = `${Math.floor(ph * 0.037)}px Segoe UI,sans-serif`;
      ctx.fillStyle = 'rgba(122,111,104,0.9)';
      wrapText(p.desc, x + PAD, imgTop + 17, pw - PAD * 2, ph * 0.047);
      ctx.restore();

      const rowTop = imgTop + ph * 0.21;
      const rowH   = (ph - (rowTop - y) - PAD * 2) * 0.52;
      const cellW  = (pw - PAD * 4) / 3;
      ['Theatre', 'Office', 'Bedroom'].forEach((lbl, i) => {
        imgOrBox(p.imgs[i] || '', x + PAD + i * (cellW + PAD), rowTop, cellW, rowH, lbl, fits[i] || 'contain');
      });
      const wideTop = rowTop + rowH + PAD;
      const wideH   = ph - (wideTop - y) - PAD;
      imgOrBox(p.imgs[3] || '', x + PAD, wideTop, pw - PAD * 2, wideH, 'Lighting Plan — Top View', fits[3] || 'contain');
    }

    /* ── trio (text left, 3 images right) ── */
    else if (p.layout === 'trio') {
      ctx.save();
      ctx.font = `italic ${Math.floor(ph * 0.06)}px Georgia,serif`;
      ctx.fillStyle = p.accent; ctx.textAlign = 'left';
      ctx.fillText(p.title, x + PAD, imgTop - 4);
      ctx.font = `${Math.floor(ph * 0.037)}px Segoe UI,sans-serif`;
      ctx.fillStyle = 'rgba(122,111,104,0.9)';
      wrapText(p.desc, x + PAD, imgTop + 18, pw * 0.42, ph * 0.048);
      ctx.restore();

      const ri  = x + pw * 0.46;
      const riw = pw * 0.52;
      const rih = (ph - (imgTop - y) - PAD * 3) * 0.48;
      imgOrBox(p.imgs[0] || '', ri, imgTop, riw, rih, 'Table — Front View', fits[0] || 'contain');
      imgOrBox(p.imgs[1] || '', ri, imgTop + rih + PAD, riw / 2 - PAD / 2, rih, 'Side Table', fits[1] || 'contain');
      imgOrBox(p.imgs[2] || '', ri + riw / 2 + PAD / 2, imgTop + rih + PAD, riw / 2 - PAD / 2, rih, 'Dining Table', fits[2] || 'contain');
      // Detail image repeats the hero image full-height on the left column
      const leftW = pw * 0.44 - PAD;
      imgOrBox(p.imgs[0] || '', x + PAD, imgTop + ph * 0.26, leftW, ph - (imgTop + ph * 0.26 - y) - PAD, 'Table Detail', fits[0] || 'contain');
    }

    /* ── split1+2 (large left + 2 stacked right) ── */
    else if (p.layout === 'split1+2') {
      ctx.save();
      ctx.font = `italic ${Math.floor(ph * 0.058)}px Georgia,serif`;
      ctx.fillStyle = p.accent; ctx.textAlign = 'left';
      ctx.fillText(p.title, x + PAD, imgTop - 4);
      ctx.font = `${Math.floor(ph * 0.037)}px Segoe UI,sans-serif`;
      ctx.fillStyle = 'rgba(122,111,104,0.9)';
      wrapText(p.desc, x + PAD, imgTop + 18, pw - PAD * 2, ph * 0.047);
      ctx.restore();

      const labels  = p.labels || ['', '', ''];
      const areaTop = imgTop + ph * 0.195;
      const areaH   = ph - (areaTop - y) - PAD;
      const lw      = (pw - PAD * 3) * 0.58;
      const rw      = pw - PAD * 3 - lw;
      const rh      = (areaH - PAD) / 2;

      imgOrBox(p.imgs[0] || '', x + PAD,           areaTop,           lw, areaH, labels[0], fits[0] || 'contain');
      smallLabel(labels[0], x + PAD + lw / 2, areaTop + areaH + 11);

      imgOrBox(p.imgs[1] || '', x + PAD * 2 + lw,  areaTop,           rw, rh, labels[1], fits[1] || 'contain');
      smallLabel(labels[1], x + PAD * 2 + lw + rw / 2, areaTop + rh + 11);

      imgOrBox(p.imgs[2] || '', x + PAD * 2 + lw,  areaTop + rh + PAD, rw, rh, labels[2], fits[2] || 'contain');
      smallLabel(labels[2], x + PAD * 2 + lw + rw / 2, areaTop + rh + PAD + rh + 11);
    }

    /* ── grid6 (3 cols × 2 rows) ── */
    else if (p.layout === 'grid6') {
      ctx.save();
      ctx.font = `italic ${Math.floor(ph * 0.055)}px Georgia,serif`;
      ctx.fillStyle = p.accent; ctx.textAlign = 'left';
      ctx.fillText(p.title, x + PAD, imgTop - 4);
      ctx.font = `${Math.floor(ph * 0.034)}px Segoe UI,sans-serif`;
      ctx.fillStyle = 'rgba(122,111,104,0.9)';
      wrapText(p.desc, x + PAD, imgTop + 16, pw - PAD * 2, ph * 0.044);
      ctx.restore();

      const labels  = p.labels || ['', '', '', '', '', ''];
      const areaTop = imgTop + ph * 0.185;
      const areaH   = ph - (areaTop - y) - PAD * 1.5;
      const COLS = 3, ROWS = 2;
      const cellW = (pw - PAD * (COLS + 1)) / COLS;
      const cellH = (areaH - PAD * ROWS) / ROWS;

      for (let r = 0; r < ROWS; r++) {
        for (let c = 0; c < COLS; c++) {
          const i  = r * COLS + c;
          const ix = x + PAD + c * (cellW + PAD);
          const iy = areaTop + r * (cellH + PAD);
          imgOrBox(p.imgs[i] || '', ix, iy, cellW, cellH, labels[i], fits[i] || 'contain');
          ctx.save();
          ctx.font = '8.5px Segoe UI,sans-serif'; ctx.fillStyle = 'rgba(62,31,32,0.45)'; ctx.textAlign = 'center';
          ctx.fillText(labels[i] || '', ix + cellW / 2, iy + cellH + 10);
          ctx.restore();
        }
      }
    }

    /* Page number */
    ctx.save();
    ctx.font = '10px Segoe UI,sans-serif'; ctx.fillStyle = 'rgba(170,159,149,0.5)'; ctx.textAlign = 'center';
    ctx.fillText(`${PAGES.indexOf(p) + 1}  —  ${PAGES.length}`, x + pw / 2, y + ph - 8);
    ctx.restore();
  }

  /* ── Spine ── */
  function drawSpine() {
    const g = ctx.createLinearGradient(0, 0, PL, 0);
    g.addColorStop(0,   '#b0a49a');
    g.addColorStop(0.6, '#c9bfb3');
    g.addColorStop(1,   '#d2cdc3');
    ctx.fillStyle = g; ctx.fillRect(0, 0, PL, H);
    ctx.strokeStyle = 'rgba(62,31,32,0.14)'; ctx.lineWidth = 1;
    ctx.beginPath(); ctx.moveTo(PL, 0); ctx.lineTo(PL, H); ctx.stroke();
    ctx.save();
    ctx.translate(PL / 2, H / 2); ctx.rotate(-Math.PI / 2);
    ctx.font = '8px Segoe UI,sans-serif'; ctx.fillStyle = 'rgba(62,31,32,0.3)'; ctx.textAlign = 'center';
    ctx.fillText('AANYA KAUSHIK  ·  INTERIOR DESIGN', 0, 4);
    ctx.restore();
  }

  /* ─────────────────────────────────────────────────────────
     ANIMATION ENGINE
     ───────────────────────────────────────────────────────── */
  let cur = 0, animating = false, animDir = 1, animFrom = 0, animTo = 1, startTime = null;
  const DUR = 820; // ms per flip

  function ease(t) { return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2; }

  function draw(ts, staticOnly) {
    ctx.clearRect(0, 0, W, H);
    /* Book edge shadow layers */
    ctx.fillStyle = '#c9c0b5'; ctx.fillRect(3, 3, W - 3, H - 3);
    ctx.fillStyle = '#ddd6cc'; ctx.fillRect(2, 2, W - 3, H - 3);

    if (!animating || staticOnly) {
      drawPageContent(PAGES[cur], PL, 0, W - PL, H);
      drawSpine();
      updateARIA();
      return;
    }

    if (!startTime) startTime = ts;
    const elapsed = ts - startTime;

    /* If user prefers reduced motion — skip directly to target page */
    if (prefersReducedMotion) {
      cur = animTo; animating = false;
      drawPageContent(PAGES[cur], PL, 0, W - PL, H);
      drawSpine();
      updateUI();
      return;
    }

    const t  = ease(Math.min(elapsed / DUR, 1));
    const pw = W - PL;
    const from = PAGES[animFrom], to = PAGES[animTo];

    if (animDir === 1) {
      /* Forward flip — page curls from right to left */
      drawPageContent(to, PL, 0, pw, H);
      const rx   = PL + pw * (1 - t);
      const curl = Math.sin(t * Math.PI) * 36;

      ctx.save();
      ctx.beginPath();
      ctx.moveTo(PL, 0); ctx.lineTo(rx, 0);
      ctx.quadraticCurveTo(rx + curl, H / 2, rx, H);
      ctx.lineTo(PL, H); ctx.closePath();
      ctx.fillStyle = from.bg; ctx.fill(); ctx.clip();
      drawPageContent(from, PL, 0, pw, H);
      ctx.restore();

      /* Curl shadow on the peeling page */
      if (rx > PL + 5) {
        const alpha = 0.2 * Math.sin(t * Math.PI);
        const sg = ctx.createLinearGradient(rx - 50, 0, rx + curl, 0);
        sg.addColorStop(0, 'rgba(62,31,32,0)');
        sg.addColorStop(1, `rgba(62,31,32,${alpha})`);
        ctx.fillStyle = sg; ctx.fillRect(PL, 0, rx - PL + curl + 2, H);
        /* Cast shadow on the destination page */
        const cg = ctx.createLinearGradient(rx + curl, 0, rx + curl + 45, 0);
        cg.addColorStop(0, `rgba(62,31,32,${alpha * 0.6})`);
        cg.addColorStop(1, 'rgba(62,31,32,0)');
        ctx.fillStyle = cg; ctx.fillRect(rx + curl, 0, 45, H);
      }
    } else {
      /* Backward flip — page curls from left to right */
      drawPageContent(to, PL, 0, pw, H);
      const rx   = PL + pw * t;
      const curl = Math.sin(t * Math.PI) * 36;

      ctx.save();
      ctx.beginPath();
      ctx.moveTo(PL, 0); ctx.lineTo(rx, 0);
      ctx.quadraticCurveTo(rx - curl, H / 2, rx, H);
      ctx.lineTo(PL, H); ctx.closePath();
      ctx.fillStyle = from.bg; ctx.fill(); ctx.clip();
      drawPageContent(from, PL, 0, pw, H);
      ctx.restore();

      if (rx > PL + 5) {
        const alpha = 0.15 * Math.sin(t * Math.PI);
        const sg = ctx.createLinearGradient(rx - curl - 2, 0, rx + 50, 0);
        sg.addColorStop(0, `rgba(62,31,32,${alpha})`);
        sg.addColorStop(1, 'rgba(62,31,32,0)');
        ctx.fillStyle = sg; ctx.fillRect(rx - curl - 2, 0, 60, H);
      }
    }

    drawSpine();

    if (elapsed < DUR) {
      requestAnimationFrame(draw);
    } else {
      cur = animTo; animating = false;
      updateUI();
      requestAnimationFrame(ts2 => draw(ts2, true));
    }
  }

  /* ─────────────────────────────────────────────────────────
     NAVIGATION
     ───────────────────────────────────────────────────────── */
  function startFlip(dir) {
    if (animating) return;
    const next = cur + dir;
    if (next < 0 || next >= PAGES.length) return;
    animDir = dir; animFrom = cur; animTo = next;
    animating = true; startTime = null;
    requestAnimationFrame(draw);
  }

  // Exposed for prev/next button onclick attributes
  window.flipNext = () => startFlip(1);
  window.flipPrev = () => startFlip(-1);

  /* ── Navigation dots ── */
  const dotsEl = document.getElementById('flipDots');
  PAGES.forEach((_, i) => {
    const d = document.createElement('button');
    d.className = 'flip-dot' + (i === 0 ? ' active' : '');
    d.setAttribute('aria-label', `Go to page ${i + 1}: ${PAGES[i].title}`);
    d.setAttribute('aria-current', i === 0 ? 'true' : 'false');

    d.onclick = () => {
      if (animating || i === cur) return;
      // Jump directly without chaining animations
      const dir = i > cur ? 1 : -1;
      const hop = () => {
        if (cur === i || animating) return;
        startFlip(dir);
        setTimeout(hop, DUR + 30);
      };
      hop();
    };
    dotsEl.appendChild(d);
  });

  /* ── Update UI after navigation ── */
  function updateUI() {
    const prevBtn = document.getElementById('prevBtn');
    const nextBtn = document.getElementById('nextBtn');
    if (prevBtn) prevBtn.disabled = cur === 0;
    if (nextBtn) nextBtn.disabled = cur === PAGES.length - 1;

    const counter = document.getElementById('pageCounter');
    if (counter) counter.textContent = `${cur + 1} / ${PAGES.length}`;

    [...dotsEl.children].forEach((d, i) => {
      d.classList.toggle('active', i === cur);
      d.setAttribute('aria-current', i === cur ? 'true' : 'false');
    });

    updateARIA();
  }

  function updateARIA() {
    canvas.setAttribute('aria-label',
      `Portfolio flipbook — Page ${cur + 1} of ${PAGES.length}: ${PAGES[cur].title}. Use arrow keys to navigate.`
    );
  }

  /* ── Canvas interactions ── */
  canvas.setAttribute('tabindex', '0');
  canvas.setAttribute('role', 'img');
  updateARIA();

  /* Click to flip — left zone goes back, right zone goes forward */
  canvas.addEventListener('click', e => {
    const r = canvas.getBoundingClientRect();
    const x = (e.clientX - r.left) * (W / r.width);
    if (x > W * 0.55 && cur < PAGES.length - 1) window.flipNext();
    else if (x < W * 0.45 && cur > 0) window.flipPrev();
  });

  /* Keyboard navigation on canvas */
  canvas.addEventListener('keydown', e => {
    switch (e.key) {
      case 'ArrowRight':
      case 'ArrowDown':
        e.preventDefault(); window.flipNext(); break;
      case 'ArrowLeft':
      case 'ArrowUp':
        e.preventDefault(); window.flipPrev(); break;
    }
  });

  /* Touch swipe support */
  let touchStartX = 0;
  canvas.addEventListener('touchstart', e => {
    touchStartX = e.changedTouches[0].clientX;
  }, { passive: true });
  canvas.addEventListener('touchend', e => {
    const dx = e.changedTouches[0].clientX - touchStartX;
    if (Math.abs(dx) > 40) {
      if (dx < 0) window.flipNext();
      else         window.flipPrev();
    }
  }, { passive: true });

  /* ── Initial render ── */
  requestAnimationFrame(ts => draw(ts, true));
  updateUI();

})(); // end initFlipbook
