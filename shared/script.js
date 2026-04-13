// ===== GUIDES HUB DATA =====
var GUIDES = [
  {
    num: '01',
    title: 'Белый фон для WB и Ozon',
    desc: '8 промптов — главное фото без студии',
    url: '../lead-magnet-01-white-background/',
    slug: 'lead-magnet-01'
  },
  {
    num: '02',
    title: 'Инфографика для карточки',
    desc: '5 промптов для слайдов 2–7',
    url: '../lead-magnet-02-infographic/',
    slug: 'lead-magnet-02'
  },
  {
    num: '03',
    title: 'Lifestyle фото',
    desc: 'Товар в интерьере и на модели',
    url: null
  },
  {
    num: '04',
    title: 'Сезонные карточки',
    desc: 'НГ, 8 марта, лето — шаблоны',
    url: null
  },
  {
    num: '05',
    title: 'Ghost mannequin',
    desc: 'Одежда без модели и студии',
    url: null
  },
  {
    num: '06',
    title: '7 слайдов за 15 минут',
    desc: 'Полный комплект карточки',
    url: null
  }
];

// ===== TOC =====
document.addEventListener('DOMContentLoaded', function () {
  const headings = document.querySelectorAll('.main-content h2, .main-content h3');
  const desktopList = document.getElementById('tocListDesktop');
  const mobileList = document.getElementById('tocListMobile');

  headings.forEach(function (h) {
    const text = h.textContent.trim();
    const id = text.toLowerCase().replace(/\s+/g, '-').replace(/[^\w\u0400-\u04FF-]/g, '');
    h.id = id;

    const isSub = h.tagName === 'H3';

    [desktopList, mobileList].forEach(function (list) {
      const li = document.createElement('li');
      if (isSub) li.classList.add('toc-sub');
      const a = document.createElement('a');
      a.href = '#' + id;
      a.textContent = text;
      a.addEventListener('click', function () {
        const mob = document.getElementById('tocAccordion');
        if (mob) mob.classList.remove('open');
      });
      li.appendChild(a);
      list.appendChild(li);
    });
  });

  // IntersectionObserver
  const allLinks = document.querySelectorAll('.toc-list a');
  const observer = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        const id = entry.target.id;
        allLinks.forEach(function (a) {
          a.classList.toggle('active', a.getAttribute('href') === '#' + id);
        });
      }
    });
  }, { rootMargin: '-20% 0px -70% 0px' });

  headings.forEach(function (h) { observer.observe(h); });

  // ===== MOVE COPY BUTTONS INTO PROMPT-TEXT BLOCKS =====
  document.querySelectorAll('.prompt-block').forEach(function (block) {
    const btn = block.querySelector('.copy-btn');
    const textEl = block.querySelector('.prompt-text');
    if (btn && textEl) {
      textEl.style.position = 'relative';
      textEl.appendChild(btn);
    }
  });

  // ===== INJECT GUIDES HUB BEFORE FOOTER =====
  var footer = document.querySelector('.site-footer');
  if (footer) {
    var currentPath = window.location.pathname;
    var cardsHtml = GUIDES.map(function (g) {
      var isCurrent = g.slug && currentPath.indexOf(g.slug) !== -1;
      if (!g.url) {
        // Locked
        return '<div class="guide-card guide-card-locked">' +
          '<div class="guide-num-badge">' + g.num + '</div>' +
          '<div class="guide-card-body">' +
            '<div class="guide-card-title">' + g.title + '</div>' +
            '<div class="guide-card-desc">' + g.desc + '</div>' +
            '<div class="guide-card-soon">🔒 Скоро будет готово</div>' +
          '</div>' +
        '</div>';
      }
      if (isCurrent) {
        // Current page — no link, just highlighted
        return '<div class="guide-card guide-card-current">' +
          '<div class="guide-num-badge">' + g.num + '</div>' +
          '<div class="guide-card-body">' +
            '<div class="guide-card-title">' + g.title + '</div>' +
            '<div class="guide-card-desc">' + g.desc + '</div>' +
            '<div class="guide-card-you">← вы здесь</div>' +
          '</div>' +
        '</div>';
      }
      // Available — clickable link
      return '<a href="' + g.url + '" class="guide-card guide-card-available">' +
        '<div class="guide-num-badge">' + g.num + '</div>' +
        '<div class="guide-card-body">' +
          '<div class="guide-card-title">' + g.title + '</div>' +
          '<div class="guide-card-desc">' + g.desc + '</div>' +
          '<div class="guide-card-link">Открыть →</div>' +
        '</div>' +
      '</a>';
    }).join('');

    var hub = document.createElement('section');
    hub.className = 'guides-hub';
    hub.innerHTML =
      '<div class="guides-hub-inner">' +
        '<div class="guides-hub-label">Все гайды GoBanana</div>' +
        '<div class="guides-grid">' + cardsHtml + '</div>' +
      '</div>';
    footer.parentNode.insertBefore(hub, footer);
  }

  // ===== INJECT LIGHTBOX ZOOM CONTROLS =====
  const lb = document.getElementById('lightbox');
  if (lb) {
    const zoom = document.createElement('div');
    zoom.className = 'lightbox-zoom';
    zoom.innerHTML =
      '<button onclick="zoomLightbox(-1, event)" title="Уменьшить">−</button>' +
      '<button onclick="zoomLightbox(1, event)" title="Увеличить">+</button>';
    lb.appendChild(zoom);
  }
});

function toggleToc() {
  document.getElementById('tocAccordion').classList.toggle('open');
}

// ===== COPY PROMPT =====
function markCopied(btn) {
  btn.textContent = 'Скопировано ✓';
  btn.classList.add('copied');
  setTimeout(function () {
    btn.textContent = 'Скопировать';
    btn.classList.remove('copied');
  }, 2000);
}

function copyPrompt(btn) {
  const text = btn.closest('.prompt-block').querySelector('.prompt-text').getAttribute('data-prompt');
  navigator.clipboard.writeText(text).then(function () {
    markCopied(btn);
  }).catch(function () {
    const ta = document.createElement('textarea');
    ta.value = text;
    ta.style.cssText = 'position:fixed;opacity:0';
    document.body.appendChild(ta);
    ta.select();
    document.execCommand('copy');
    document.body.removeChild(ta);
    markCopied(btn);
  });
}

// ===== CHECKLIST =====
function toggleCheck(li) {
  li.classList.toggle('checked');
}

// ===== LIGHTBOX =====
var lbZoom = 1;

function openLightbox(el) {
  lbZoom = 1;
  const img = el.querySelector('img');
  const lb = document.getElementById('lightbox');
  const lbImg = document.getElementById('lightboxImg');
  if (img) {
    lbImg.src = img.src;
    lbImg.style.display = 'block';
    lbImg.style.transform = 'scale(1)';
  } else {
    lbImg.style.display = 'none';
  }
  lb.classList.add('active');
  lb.style.overflow = 'hidden';
  document.body.style.overflow = 'hidden';
}

function zoomLightbox(delta, e) {
  if (e) e.stopPropagation();
  lbZoom = Math.min(Math.max(lbZoom + delta * 0.3, 0.5), 4);
  const lbImg = document.getElementById('lightboxImg');
  lbImg.style.transform = 'scale(' + lbZoom + ')';
  const lb = document.getElementById('lightbox');
  lb.style.overflow = lbZoom > 1 ? 'auto' : 'hidden';
}

function closeLightbox(e) {
  if (!e || e.target === document.getElementById('lightbox') || e.currentTarget.classList.contains('lightbox-close')) {
    lbZoom = 1;
    const lbImg = document.getElementById('lightboxImg');
    if (lbImg) lbImg.style.transform = 'scale(1)';
    document.getElementById('lightbox').classList.remove('active');
    document.body.style.overflow = '';
  }
}

document.addEventListener('keydown', function (e) {
  if (e.key === 'Escape') closeLightbox();
  if (e.key === '+' || e.key === '=') zoomLightbox(1);
  if (e.key === '-') zoomLightbox(-1);
});

// ===== SHARE =====
function sharePage() {
  if (navigator.share) {
    navigator.share({
      title: document.title,
      url: window.location.href
    });
  } else {
    navigator.clipboard.writeText(window.location.href).then(function () {
      alert('Ссылка скопирована!');
    });
  }
}
