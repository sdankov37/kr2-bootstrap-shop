/* =============================================================
   FEATURES.JS
   1. Кастомный курсор-щит + анимация hero
   2. Виджет чата (снизу справа, над кнопкой «наверх»)
   3. Полоса прогресса чтения с бинарным текстом
   4. Поиск по сайту (Ctrl/Cmd+K)
   5. Reveal-анимации при скролле
   ============================================================= */
(function () {
  'use strict';
  if (window.__featuresLoaded) return;
  window.__featuresLoaded = true;

  const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const isTouch = !matchMedia('(hover: hover) and (pointer: fine)').matches;

  // -----------------------------------------------------------
  // CSS
  // -----------------------------------------------------------
  const CSS = `
    /* --- 3. Reading progress (binary, transparent) --- */
.reading-progress {
  position: fixed; top: 0; left: 0; width: 100%; height: 14px;
  background: transparent; z-index: 2000; overflow: hidden;
  font: 700 10px/14px 'Courier New', monospace;
  letter-spacing: 2px; white-space: nowrap;
  pointer-events: none; user-select: none;
}
.reading-progress::before,
.reading-progress__fill::before {
  content: attr(data-binary);
  position: absolute; top: 0; left: 6px;
  white-space: nowrap;
}
.reading-progress::before { color: rgba(240,90,20,.7); }
.reading-progress__fill {
  position: absolute; inset: 0 auto 0 0; width: 0;
  background: linear-gradient(90deg, #bb280e, #f05a14);
  overflow: hidden; transition: width .12s linear;
  box-shadow: 0 0 8px rgba(240,90,20,.45);
}
.reading-progress__fill::before { color: #1a0a05; }

    /* --- 1. Cursor-щит --- */
    body.has-shield-cursor,
    body.has-shield-cursor * { cursor: none !important; }
    .shield-cursor {
      position: fixed; top: 0; left: 0;
      width: 24px; height: 28px;
      transform-origin: 12px 1px;
      pointer-events: none; z-index: 9999;
      visibility: hidden;
      filter: drop-shadow(0 2px 4px rgba(0,0,0,.55));
      will-change: transform;
    }
    .shield-cursor.is-active { visibility: visible; }
    .shield-cursor svg { width: 100%; height: 100%; display: block; }

    /* --- 1b. Hero entrance --- */
    .hero h1, .hero .lead, .hero .btn {
      opacity: 0; transform: translateY(24px);
      animation: heroEnter .9s cubic-bezier(.34,1.2,.64,1) forwards;
    }
    .hero h1 { animation-delay: .1s; }
    .hero .lead { animation-delay: .3s; }
    .hero .btn:nth-of-type(1) { animation-delay: .5s; }
    .hero .btn:nth-of-type(2) { animation-delay: .65s; }
    @keyframes heroEnter { to { opacity: 1; transform: none; } }

    /* --- 5. Reveal --- */
    .reveal {
      opacity: 0; transform: translateY(30px);
      transition: opacity .7s, transform .7s cubic-bezier(.22,1,.36,1);
    }
    .reveal.is-visible { opacity: 1; transform: none; }

    @media (prefers-reduced-motion: reduce) {
      .reveal, .hero h1, .hero .lead, .hero .btn {
        opacity: 1 !important; transform: none !important;
        animation: none !important; transition: none !important;
      }
    }

    /* --- 4. Search trigger --- */
    .search-trigger {
      background: rgba(255,255,255,.08);
      border: 1px solid rgba(255,255,255,.2);
      color: #fff; border-radius: 20px;
      padding: 6px 14px 6px 34px; font-size: 13px;
      display: inline-flex; align-items: center; gap: 8px;
      position: relative; cursor: pointer;
      min-width: 190px; margin-left: 12px;
      transition: background .2s, border-color .2s;
    }
    .search-trigger:hover {
      background: rgba(255,255,255,.14);
      border-color: rgba(255,255,255,.4);
    }
    .search-trigger svg {
      position: absolute; left: 10px; top: 50%;
      transform: translateY(-50%);
      width: 16px; height: 16px; opacity: .7;
    }
    .search-trigger kbd {
      margin-left: auto; background: rgba(0,0,0,.3);
      border: 1px solid rgba(255,255,255,.2);
      border-radius: 4px; padding: 1px 6px;
      font-size: 11px; font-family: monospace;
    }
    @media (max-width: 991.98px) {
      .search-trigger {
        margin: 12px auto 0; min-width: 0;
        width: 100%; justify-content: center;
      }
      .search-trigger kbd { display: none; }
    }

    /* --- 4b. Search modal --- */
    .search-modal {
      position: fixed; inset: 0; z-index: 2001;
      display: flex; align-items: flex-start; justify-content: center;
      padding-top: 12vh;
      background: rgba(10,4,2,.75);
      backdrop-filter: blur(8px); -webkit-backdrop-filter: blur(8px);
      opacity: 0; pointer-events: none;
      transition: opacity .2s;
    }
    .search-modal.is-open { opacity: 1; pointer-events: auto; }
    .search-modal__inner {
      width: 100%; max-width: 640px; margin: 0 16px;
      background: rgba(26,10,5,.98);
      border: 1px solid rgba(240,90,20,.3);
      border-radius: 16px; overflow: hidden;
      box-shadow: 0 24px 80px rgba(0,0,0,.7);
      transform: translateY(-20px); transition: transform .25s;
    }
    .search-modal.is-open .search-modal__inner { transform: none; }
    .search-modal__input-wrap {
      display: flex; align-items: center; gap: 12px;
      padding: 16px 20px;
      border-bottom: 1px solid rgba(255,255,255,.1);
    }
    .search-modal__input-wrap svg {
      width: 22px; height: 22px;
      color: #f05a14; flex-shrink: 0;
    }
    .search-modal__input {
      flex: 1; background: transparent; border: none;
      color: #fff; font-size: 18px; outline: none;
    }
    .search-modal__input::placeholder { color: rgba(255,255,255,.4); }
    .search-modal__close {
      background: rgba(255,255,255,.1); border: none;
      border-radius: 8px; color: #fff; padding: 4px 10px;
      font-size: 11px; cursor: pointer; font-family: monospace;
    }
    .search-modal__results {
      max-height: 60vh; overflow-y: auto; padding: 8px;
    }
    .search-result {
      display: block; padding: 12px 16px;
      border-radius: 10px; text-decoration: none; color: #fff;
      border: 1px solid transparent;
      transition: background .15s;
    }
    .search-result:hover, .search-result.is-active {
      background: rgba(240,90,20,.15);
      border-color: rgba(240,90,20,.3);
    }
    .search-result__title {
      font-weight: 600; font-size: 15px; margin-bottom: 4px;
    }
    .search-result__title mark {
      background: rgba(240,90,20,.4); color: #ffd0b8;
      padding: 0 2px; border-radius: 3px;
    }
    .search-result__path { font-size: 12px; color: rgba(255,255,255,.5); }
    .search-result__desc {
      font-size: 13px; color: rgba(255,255,255,.7); margin-top: 4px;
    }
    .search-empty {
      text-align: center; padding: 40px 20px;
      color: rgba(255,255,255,.5); font-size: 14px;
    }

    /* --- 2. Chat FAB — над кнопкой «наверх» --- */
    .chat-fab {
      position: fixed; bottom: 88px; right: 24px;
      width: 56px; height: 56px; border-radius: 50%; border: none;
      background: #fff; color: #1a0a05;
      display: flex; align-items: center; justify-content: center;
      box-shadow: 0 8px 24px rgba(0,0,0,.4), 0 0 0 1px rgba(240,90,20,.6);
      cursor: pointer; z-index: 1500;
      transition: transform .2s, box-shadow .2s;
    }
    .chat-fab:hover {
      transform: translateY(-3px) scale(1.05);
      box-shadow: 0 12px 30px rgba(240,90,20,.5);
    }
    .chat-fab svg { width: 26px; height: 26px; }
    .chat-fab__badge {
      position: absolute; top: -3px; right: -3px;
      width: 18px; height: 18px; border-radius: 50%;
      background: #f05a14; color: #fff;
      font-size: 10px; font-weight: bold;
      display: flex; align-items: center; justify-content: center;
      border: 2px solid #1a0a05;
    }

    /* --- 2b. Chat panel --- */
    .chat-panel {
      position: fixed; bottom: 156px; right: 24px;
      width: 360px; max-width: calc(100vw - 48px);
      height: 500px; max-height: calc(100vh - 180px);
      background: rgba(26,10,5,.92);
      backdrop-filter: blur(18px); -webkit-backdrop-filter: blur(18px);
      border: 1px solid rgba(255,255,255,.2);
      border-radius: 20px;
      box-shadow: 0 20px 60px rgba(0,0,0,.6);
      display: flex; flex-direction: column;
      overflow: hidden; z-index: 1500;
      opacity: 0; transform: translateY(20px) scale(.95);
      pointer-events: none;
      transition: opacity .3s, transform .3s;
    }
    .chat-panel.is-open {
      opacity: 1; transform: none; pointer-events: auto;
    }
    .chat-panel__header {
      padding: 14px 18px;
      background: rgba(240,90,20,.15);
      border-bottom: 1px solid rgba(255,255,255,.1);
      display: flex; align-items: center; gap: 12px;
    }
    .chat-panel__avatar {
      width: 38px; height: 38px; border-radius: 50%;
      background: #f05a14; display: flex;
      align-items: center; justify-content: center;
      font-size: 18px; flex-shrink: 0;
    }
    .chat-panel__title {
      font-weight: 600; color: #fff; margin: 0; font-size: 15px;
    }
    .chat-panel__status {
      font-size: 12px; color: #ffd0b8; margin: 0;
      display: flex; align-items: center; gap: 6px;
    }
    .chat-panel__status::before {
      content: ''; width: 7px; height: 7px;
      border-radius: 50%; background: #4ade80;
      box-shadow: 0 0 6px #4ade80;
    }
    .chat-panel__close {
      margin-left: auto; background: none; border: none;
      color: #fff; font-size: 24px; line-height: 1;
      cursor: pointer; padding: 0 4px; opacity: .7;
    }
    .chat-panel__close:hover { opacity: 1; }
    .chat-panel__messages {
      flex: 1; overflow-y: auto; padding: 16px;
      display: flex; flex-direction: column; gap: 12px;
    }
    .chat-panel__messages::-webkit-scrollbar { width: 6px; }
    .chat-panel__messages::-webkit-scrollbar-thumb {
      background: rgba(240,90,20,.4); border-radius: 3px;
    }
    .chat-msg {
      max-width: 82%; padding: 10px 14px;
      border-radius: 14px; font-size: 14px; line-height: 1.4;
      animation: msgIn .3s ease-out;
    }
    @keyframes msgIn { from { opacity: 0; transform: translateY(8px); } }
    .chat-msg--bot {
      background: rgba(240,90,20,.2);
      border: 1px solid rgba(240,90,20,.35);
      color: #fff; align-self: flex-start;
      border-bottom-left-radius: 4px;
    }
    .chat-msg--user {
      background: #fff; color: #1a0a05;
      align-self: flex-end; border-bottom-right-radius: 4px;
      font-weight: 500;
    }
    .chat-msg a { color: #ffd0b8 !important; text-decoration: underline; }
    .chat-msg a:hover { color: #fff !important; }
    .chat-msg--typing { display: flex; gap: 4px; padding: 14px; }
    .chat-msg--typing span {
      width: 6px; height: 6px; border-radius: 50%;
      background: #ffd0b8; animation: typing 1.2s infinite;
    }
    .chat-msg--typing span:nth-child(2) { animation-delay: .15s; }
    .chat-msg--typing span:nth-child(3) { animation-delay: .3s; }
    @keyframes typing {
      0%,60%,100% { transform: translateY(0); opacity: .5; }
      30% { transform: translateY(-6px); opacity: 1; }
    }
    .chat-panel__quick {
      display: flex; flex-wrap: wrap; gap: 6px; padding: 8px 16px;
    }
    .chat-quick {
      background: rgba(255,255,255,.08);
      border: 1px solid rgba(255,255,255,.2);
      color: #fff; border-radius: 14px;
      padding: 6px 12px; font-size: 12px; cursor: pointer;
      transition: background .2s, border-color .2s;
    }
    .chat-quick:hover { background: rgba(240,90,20,.3); border-color: #f05a14; }
    .chat-panel__form {
      padding: 12px 16px;
      border-top: 1px solid rgba(255,255,255,.1);
      display: flex; gap: 8px;
    }
    .chat-panel__input {
      flex: 1; background: rgba(0,0,0,.4);
      border: 1px solid rgba(255,255,255,.15);
      border-radius: 20px; padding: 10px 14px;
      color: #fff; font-size: 14px; outline: none;
    }
    .chat-panel__input:focus { border-color: #f05a14; }
    .chat-panel__input::placeholder { color: rgba(255,255,255,.4); }
    .chat-panel__send {
      width: 42px; height: 42px; border-radius: 50%; border: none;
      background: #fff; color: #1a0a05; cursor: pointer;
      display: flex; align-items: center; justify-content: center;
      transition: background .2s, color .2s;
    }
    .chat-panel__send:hover { background: #f05a14; color: #fff; }
    .chat-panel__send svg { width: 18px; height: 18px; }
    @media (max-width: 480px) {
      .chat-panel {
        left: 8px; right: 8px; bottom: 80px;
        width: auto; max-width: none;
        height: calc(100vh - 100px);
      }
      .chat-fab { right: 16px; bottom: 80px; width: 52px; height: 52px; }
    }
  `;
  const style = document.createElement('style');
  style.textContent = CSS;
  document.head.appendChild(style);

  // -----------------------------------------------------------
  // 3. Reading progress (binary)
  // -----------------------------------------------------------
  function initProgress() {
  const bar = document.createElement('div');
  bar.className = 'reading-progress';
  bar.innerHTML = '<div class="reading-progress__fill"></div>';
  const fill = bar.firstElementChild;
  document.body.appendChild(bar);

  function binary() {
    const len = Math.max(200, Math.ceil(window.innerWidth / 6));
    let s = '';
    for (let i = 0; i < len; i++) s += Math.random() < 0.5 ? '0' : '1';
    bar.setAttribute('data-binary', s);
    fill.setAttribute('data-binary', s);
  }
  binary();

  function update() {
    const st = window.scrollY || window.pageYOffset;
    const h = document.documentElement.scrollHeight - window.innerHeight;
    fill.style.width = (h > 0 ? Math.min(100, (st / h) * 100) : 0) + '%';
  }
  update();

  let ticking = false;
  window.addEventListener('scroll', () => {
    if (!ticking) {
      ticking = true;
      requestAnimationFrame(() => { update(); ticking = false; });
    }
  }, { passive: true });
  window.addEventListener('resize', () => { binary(); update(); });
  setInterval(binary, 140);
}
  // -----------------------------------------------------------
  // 1. Cursor-щит
  // -----------------------------------------------------------
  function initCursor() {
    if (isTouch || reduced) return;
    const cursor = document.createElement('div');
    cursor.className = 'shield-cursor';
    cursor.innerHTML =
      '<svg viewBox="0 0 24 28" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">' +
        '<path d="M12 1 L21 5 V14 Q21 22 12 26 Q3 22 3 14 V5 Z" ' +
              'fill="#ffd0b8" stroke="#f05a14" stroke-width="1.6" stroke-linejoin="round"/>' +
        '<path d="M12 6 L17 8 V14 Q17 19 12 22 Q7 19 7 14 V8 Z" ' +
              'fill="#f05a14"/>' +
      '</svg>';
    document.body.appendChild(cursor);
    document.body.classList.add('has-shield-cursor');

    window.addEventListener('mousemove', (e) => {
      cursor.classList.add('is-active');
      cursor.style.transform =
        `translate(${e.clientX - 12}px, ${e.clientY - 1}px) rotate(-20deg)`;
    });
  }

  // -----------------------------------------------------------
  // 5. Reveal on scroll
  // -----------------------------------------------------------
  function initReveal() {
    if (reduced) return;
    document.querySelectorAll('main section, main .row > [class*="col-"]').forEach((el) => {
      if (el.closest('.hero') || el.classList.contains('reveal')) return;
      el.classList.add('reveal');
    });
    if (!('IntersectionObserver' in window)) {
      document.querySelectorAll('.reveal').forEach((el) => el.classList.add('is-visible'));
      return;
    }
    const io = new IntersectionObserver((entries) => {
      entries.forEach((e) => {
        if (e.isIntersecting) {
          e.target.classList.add('is-visible');
          io.unobserve(e.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
    document.querySelectorAll('.reveal').forEach((el) => io.observe(el));
  }

  // -----------------------------------------------------------
  // 4. Search
  // -----------------------------------------------------------
  const SEARCH_INDEX = [
    { url: 'index.html', title: 'Главная', desc: 'Iron Vanguard Studios — независимая студия тактических стратегий.', keywords: 'главная iron vanguard студия rts' },
    { url: 'catalog.html', title: 'Каталог игр', desc: 'Полный каталог игр студии с фильтрами.', keywords: 'каталог игры проекты фильтр жанр платформа год' },
    { url: 'about.html', title: 'О студии', desc: 'История, команда, принципы и достижения.', keywords: 'о студии история команда принципы достижения faq' },
    { url: 'contacts.html', title: 'Контакты', desc: 'Адрес, телефон, почта, карта.', keywords: 'контакты адрес телефон email почта карта офис' },
    { url: 'order.html', title: 'Форма заявки', desc: 'Оставьте заявку — мы свяжемся.', keywords: 'заявка форма збт' },
    { url: 'product-iron-vanguard.html', title: 'Iron Vanguard: Frontline', desc: 'Классическая RTS с упором на макроменеджмент.', keywords: 'iron vanguard frontline rts 2024 стратегия' },
    { url: 'product.html', title: 'Shadow Protocol', desc: 'Пошаговая тактика про отряд спецназа.', keywords: 'shadow protocol тактика спецназ збт 2025' },
    { url: 'product-empire-of-steel.html', title: 'Empire of Steel', desc: 'Глобальная стратегия с экономикой и дипломатией.', keywords: 'empire of steel глобальная стратегия 2026 империя' },
    { url: 'product-arena-of-legends.html', title: 'Arena of Legends', desc: 'Динамичная MOBA с уникальными героями.', keywords: 'arena of legends moba бесплатно киберспорт' },
    { url: 'product-project-apex.html', title: 'Project Apex', desc: 'Экспериментальный проект в жанре тактической RPG.', keywords: 'project apex тактическая rpg анонс 2027' },
    { url: 'product-unannounced.html', title: 'Project ██████', desc: 'Неанонсированный проект. Новая IP.', keywords: 'секретный неанонсированный новая ip 2028' }
  ];

  function initSearch() {
    const collapse = document.querySelector('.navbar .navbar-collapse');
    if (collapse) {
      const trigger = document.createElement('button');
      trigger.type = 'button';
      trigger.className = 'search-trigger';
      trigger.setAttribute('aria-label', 'Поиск по сайту');
      trigger.innerHTML =
        '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"><circle cx="11" cy="11" r="7"/><path d="M21 21l-4.35-4.35"/></svg>' +
        '<span>Поиск…</span><kbd>Ctrl K</kbd>';
      collapse.appendChild(trigger);
    }

    const modal = document.createElement('div');
    modal.className = 'search-modal';
    modal.innerHTML =
      '<div class="search-modal__inner" role="dialog" aria-modal="true">' +
        '<div class="search-modal__input-wrap">' +
          '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"><circle cx="11" cy="11" r="7"/><path d="M21 21l-4.35-4.35"/></svg>' +
          '<input class="search-modal__input" placeholder="Что ищем? Например: shadow, тактика, контакты…" autocomplete="off">' +
          '<button type="button" class="search-modal__close">ESC</button>' +
        '</div>' +
        '<div class="search-modal__results"></div>' +
      '</div>';
    document.body.appendChild(modal);

    const input = modal.querySelector('.search-modal__input');
    const results = modal.querySelector('.search-modal__results');
    let activeIdx = -1;

    const mark = (text, q) => {
      if (!q) return text;
      const i = text.toLowerCase().indexOf(q.toLowerCase());
      return i < 0 ? text
        : text.slice(0, i) + '<mark>' + text.slice(i, i + q.length) + '</mark>' + text.slice(i + q.length);
    };

    function render(q) {
      const query = q.trim().toLowerCase();
      activeIdx = -1;
      if (!query) {
        results.innerHTML = '<div class="search-empty">Начните вводить — например «iron», «тактика» или «контакты»</div>';
        return;
      }
      const hits = SEARCH_INDEX.filter((it) =>
        (it.title + ' ' + it.keywords + ' ' + it.desc).toLowerCase().includes(query)
      );
      if (!hits.length) {
        results.innerHTML = '<div class="search-empty">Ничего не найдено по запросу «' + q + '».</div>';
        return;
      }
      results.innerHTML = hits.map((it) =>
        '<a class="search-result" href="' + it.url + '">' +
          '<div class="search-result__title">' + mark(it.title, q) + '</div>' +
          '<div class="search-result__path">' + it.url + '</div>' +
          '<div class="search-result__desc">' + mark(it.desc, q) + '</div>' +
        '</a>'
      ).join('');
    }

    const open = () => {
      modal.classList.add('is-open');
      document.body.style.overflow = 'hidden';
      setTimeout(() => input.focus(), 50);
      render('');
    };
    const close = () => {
      modal.classList.remove('is-open');
      document.body.style.overflow = '';
      input.value = '';
    };

    modal.addEventListener('click', (e) => { if (e.target === modal) close(); });
    modal.querySelector('.search-modal__close').addEventListener('click', close);
    input.addEventListener('input', () => render(input.value));
    input.addEventListener('keydown', (e) => {
      const items = results.querySelectorAll('.search-result');
      if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
        e.preventDefault();
        if (!items.length) return;
        activeIdx = e.key === 'ArrowDown'
          ? (activeIdx + 1) % items.length
          : (activeIdx - 1 + items.length) % items.length;
        items.forEach((el, i) => el.classList.toggle('is-active', i === activeIdx));
        items[activeIdx].scrollIntoView({ block: 'nearest' });
      } else if (e.key === 'Enter') {
        const target = activeIdx >= 0 ? items[activeIdx] : items[0];
        if (target) location.href = target.href;
      } else if (e.key === 'Escape') close();
    });

    document.addEventListener('click', (e) => {
      if (e.target.closest && e.target.closest('.search-trigger')) {
        e.preventDefault(); open();
      }
    });
    document.addEventListener('keydown', (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        modal.classList.contains('is-open') ? close() : open();
      }
      if (e.key === 'Escape' && modal.classList.contains('is-open')) close();
    });
  }

  // -----------------------------------------------------------
  // 2. Chat
  // -----------------------------------------------------------
  const RULES = [
    { k: ['привет', 'здравствуй', 'хай', 'hi', 'hello'], r: 'Здравствуйте! 👋 Я консультант Iron Vanguard Studios. Могу рассказать про игры, заявку или контакты.' },
    { k: ['shadow', 'протокол', 'пошагов'], r: 'Shadow Protocol — пошаговая тактика про элитный отряд. Скоро ЗБТ. <a href="product.html">Подробнее</a>.' },
    { k: ['iron', 'vanguard', 'frontline', 'rts'], r: 'Iron Vanguard: Frontline — флагманская RTS в Steam и Epic. <a href="product-iron-vanguard.html">Подробнее</a>.' },
    { k: ['empire', 'импери', 'глобальн'], r: 'Empire of Steel — глобальная стратегия, ЗБТ в 2026. <a href="product-empire-of-steel.html">Подробнее</a>.' },
    { k: ['arena', 'моба', 'moba'], r: 'Arena of Legends — бесплатная MOBA с киберспортом. <a href="product-arena-of-legends.html">Подробнее</a>.' },
    { k: ['apex', 'апекс'], r: 'Project Apex — тактическая RPG, анонс в 2027. <a href="product-project-apex.html">Подробнее</a>.' },
    { k: ['заявк', 'збт', 'бета', 'тест'], r: 'Оставить заявку: <a href="order.html">форма заявки</a>.' },
    { k: ['контакт', 'адрес', 'телефон', 'почта', 'email'], r: 'Москва, ул. Игровая, 15. +7 (999) 123-45-67. contact@ironvanguard.com. <a href="contacts.html">Все контакты</a>.' },
    { k: ['о студи', 'команд', 'истори'], r: 'С 2018 года делаем тактические стратегии. <a href="about.html">О студии</a>.' },
    { k: ['каталог', 'игр', 'проект'], r: 'Каталог игр: <a href="catalog.html">catalog.html</a>.' },
    { k: ['спасибо', 'благодар'], r: 'Рад помочь! Если что — пишите.' }
  ];
  const DEFAULT_R = 'Менеджер ответит лично. Оставьте <a href="order.html">заявку</a> или напишите на contact@ironvanguard.com.';

  const reply = (t) => {
    const s = t.toLowerCase();
    for (const r of RULES) if (r.k.some((k) => s.includes(k))) return r.r;
    return DEFAULT_R;
  };
  const esc = (s) => s.replace(/[&<>"']/g, (m) =>
    ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[m])
  );

  function initChat() {
    const fab = document.createElement('button');
    fab.type = 'button';
    fab.className = 'chat-fab';
    fab.setAttribute('aria-label', 'Чат с консультантом');
    fab.innerHTML =
      '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"/></svg>' +
      '<span class="chat-fab__badge">1</span>';
    document.body.appendChild(fab);

    const panel = document.createElement('div');
    panel.className = 'chat-panel';
    panel.innerHTML =
      '<div class="chat-panel__header">' +
        '<div class="chat-panel__avatar">💬</div>' +
        '<div><p class="chat-panel__title">Чат с консультантом</p><p class="chat-panel__status">онлайн</p></div>' +
        '<button class="chat-panel__close" type="button" aria-label="Закрыть">×</button>' +
      '</div>' +
      '<div class="chat-panel__messages"></div>' +
      '<div class="chat-panel__quick"></div>' +
      '<form class="chat-panel__form">' +
        '<input class="chat-panel__input" type="text" placeholder="Напишите сообщение…" autocomplete="off">' +
        '<button class="chat-panel__send" type="submit" aria-label="Отправить">' +
          '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z"/></svg>' +
        '</button>' +
      '</form>';
    document.body.appendChild(panel);

    const msgs = panel.querySelector('.chat-panel__messages');
    const form = panel.querySelector('.chat-panel__form');
    const input = panel.querySelector('.chat-panel__input');
    const closeBtn = panel.querySelector('.chat-panel__close');
    const quick = panel.querySelector('.chat-panel__quick');
    const badge = fab.querySelector('.chat-fab__badge');
    let started = false;

    const addMsg = (html, role) => {
      const el = document.createElement('div');
      el.className = 'chat-msg chat-msg--' + role;
      el.innerHTML = html;
      msgs.appendChild(el);
      msgs.scrollTop = msgs.scrollHeight;
    };
    const addTyping = () => {
      const el = document.createElement('div');
      el.className = 'chat-msg chat-msg--bot chat-msg--typing';
      el.innerHTML = '<span></span><span></span><span></span>';
      msgs.appendChild(el);
      msgs.scrollTop = msgs.scrollHeight;
      return el;
    };
    const setQuick = (list) => {
      quick.innerHTML = list.map((t) =>
        '<button type="button" class="chat-quick">' + t + '</button>'
      ).join('');
    };
    const botRespond = (text) => {
      const t = addTyping();
      setTimeout(() => { t.remove(); addMsg(reply(text), 'bot'); }, 600 + Math.random() * 400);
    };
    const start = () => {
      if (started) return;
      started = true;
      badge.style.display = 'none';
      setTimeout(() => {
        addMsg('Здравствуйте! 👋 Меня зовут Анна, я консультант Iron Vanguard Studios. Помогу с играми, заявкой или контактами.', 'bot');
        setTimeout(() => {
          addMsg('С чего начнём?', 'bot');
          setQuick(['Про игры', 'Заявка на ЗБТ', 'Контакты', 'О студии']);
        }, 400);
      }, 300);
    };

    fab.addEventListener('click', () => {
      panel.classList.toggle('is-open');
      if (panel.classList.contains('is-open')) {
        start();
        setTimeout(() => input.focus(), 300);
      }
    });
    closeBtn.addEventListener('click', () => panel.classList.remove('is-open'));

    quick.addEventListener('click', (e) => {
      const btn = e.target.closest('.chat-quick');
      if (!btn) return;
      const text = btn.textContent;
      addMsg(esc(text), 'user');
      quick.innerHTML = '';
      botRespond(text);
      setTimeout(() => setQuick(['Shadow Protocol', 'Iron Vanguard', 'Empire of Steel', 'Контакты']), 1200);
    });

    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const text = input.value.trim();
      if (!text) return;
      addMsg(esc(text), 'user');
      input.value = '';
      botRespond(text);
    });
  }

  // -----------------------------------------------------------
  // Boot
  // -----------------------------------------------------------
  function boot() {
    initProgress();
    initCursor();
    initReveal();
    initSearch();
    initChat();
  }
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', boot);
  } else {
    boot();
  }
})();