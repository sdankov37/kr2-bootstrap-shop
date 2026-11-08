// ===============================================================
// JellyRadio — «желейные» чипы (vanilla JS порт из React Bits)
// ===============================================================

class JellyRadio {
  constructor(root, options = {}) {
    this.root = root;
    this.chips = Array.from(root.querySelectorAll('.jelly-radio__chip'));

    this.opt = {
      swell: 0.2,
      barge: 6,
      shrink: 0.05,
      stagger: 22,
      ...options
    };

    this.apply(this.detectActiveIndex(), true);
    this.bind();

    // Пересчёт при ресайзе
    let t;
    this.resizeObserver = new ResizeObserver(() => {
      clearTimeout(t);
      t = setTimeout(() => this.reflow(), 100);
    });
    this.resizeObserver.observe(root);

    // Пересчёт после загрузки шрифтов
    if (document.fonts && document.fonts.ready) {
      document.fonts.ready.then(() => this.reflow());
    }
  }

  detectActiveIndex() {
    const path = (window.location.pathname.split('/').pop() || 'index.html').toLowerCase();
    const isSecondary = path.startsWith('product') || path === 'order.html';
    const target = isSecondary ? 'catalog.html' : path;

    const idx = this.chips.findIndex(c =>
      (c.dataset.href || '').toLowerCase() === target
    );
    return idx >= 0 ? idx : 0;
  }

  measure() {
    this.chips.forEach(c => {
      c._w = c.offsetWidth || 0;
      c._h = c.offsetHeight || 0;
    });
    const maxW = Math.max(0, ...this.chips.map(c => c._w));
    const chipH = this.chips[0]?._h || 0;
    this.root.style.setProperty(
      '--jr-pad-x',
      Math.ceil((maxW * this.opt.swell * 1.3) / 2 + this.opt.barge) + 2 + 'px'
    );
    this.root.style.setProperty(
      '--jr-pad-y',
      Math.ceil((chipH * this.opt.swell) / 2) + 2 + 'px'
    );
  }

  reflow() {
    const current = this.chips.findIndex(c => c.dataset.on === 'true');
    this.measure();
    this.apply(current >= 0 ? current : 0, true);
  }

  apply(selected, instant) {
    if (!this.chips[selected]) selected = 0;
    if (!this.chips[selected]) return;

    const push = ((this.chips[selected]._w || 0) * this.opt.swell) / 2 + this.opt.barge;

    this.chips.forEach((chip, i) => {
      const on = i === selected;
      const far = Math.abs(i - selected);
      const dir = i > selected ? 1 : -1;
      const tx = on ? 0 : dir * push;
      const scale = on ? 1 + this.opt.swell : 1 - this.opt.shrink;

      chip.dataset.on = on ? 'true' : 'false';
      chip.setAttribute('aria-checked', on ? 'true' : 'false');
      chip.setAttribute('tabindex', on ? '0' : '-1');

      if (instant) {
        const prev = chip.style.transition;
        chip.style.transition = 'none';
        chip.style.transform = `translateX(${tx}px) scale(${scale})`;
        void chip.offsetWidth;
        chip.style.transition = prev;
      } else {
        chip.style.transitionDelay = `${far * this.opt.stagger}ms`;
        chip.style.transform = `translateX(${tx}px) scale(${scale})`;
      }
    });
  }

  bind() {
    this.chips.forEach((chip, i) => {
      chip.addEventListener('click', () => {
        const current = this.chips.findIndex(c => c.dataset.on === 'true');
        if (i === current) {
          if (chip.dataset.href) window.location.href = chip.dataset.href;
          return;
        }
        this.apply(i, false);
        if (chip.dataset.href) {
          setTimeout(() => { window.location.href = chip.dataset.href; }, 400);
        }
      });

      chip.addEventListener('keydown', (e) => {
        let next = -1;
        if (e.key === 'ArrowRight' || e.key === 'ArrowDown')
          next = (i + 1) % this.chips.length;
        else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp')
          next = (i - 1 + this.chips.length) % this.chips.length;
        else if (e.key === 'Home')
          next = 0;
        else if (e.key === 'End')
          next = this.chips.length - 1;
        else if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          chip.click();
          return;
        }
        if (next < 0) return;
        e.preventDefault();
        this.chips[next].focus();
        this.chips[next].click();
      });
    });
  }
}

// Автоинициализация
document.addEventListener('DOMContentLoaded', () => {
  document.querySelectorAll('.jelly-radio').forEach(el => new JellyRadio(el));
});