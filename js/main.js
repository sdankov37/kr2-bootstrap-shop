document.addEventListener('DOMContentLoaded', () => {

  // 1. Модалка
  const gameModal = document.getElementById('gameModal');
  if (gameModal) {
    gameModal.addEventListener('show.bs.modal', (event) => {
      const btn = event.relatedTarget;
      if (!btn) return;
      gameModal.querySelector('.modal-title').textContent = btn.getAttribute('data-title') || '';
      gameModal.querySelector('#modalDesc').textContent = btn.getAttribute('data-desc') || '';
      const modalLink = gameModal.querySelector('.modal-footer a');
      if (modalLink) modalLink.href = btn.getAttribute('data-url') || 'catalog.html';
    });
  }

  // 2. Форма ЗБТ / заявки
  const betaForm = document.getElementById('betaForm');
  if (betaForm) {
    betaForm.addEventListener('submit', (event) => {
      event.preventDefault();
      event.stopPropagation();
      const successAlert = document.getElementById('formSuccess');
      const errorAlert = document.getElementById('formError');
      if (!betaForm.checkValidity()) {
        betaForm.classList.add('was-validated');
        if (errorAlert) errorAlert.classList.remove('d-none');
        if (successAlert) successAlert.classList.add('d-none');
        return;
      }
      betaForm.classList.remove('was-validated');
      betaForm.reset();
      if (errorAlert) errorAlert.classList.add('d-none');
      if (successAlert) successAlert.classList.remove('d-none');
      setTimeout(() => { if (successAlert) successAlert.classList.add('d-none'); }, 5000);
    });
  }

  // 3. Форма заявки
  const orderForm = document.getElementById('orderForm');
  if (orderForm) {
    orderForm.addEventListener('submit', (event) => {
      event.preventDefault();
      event.stopPropagation();
      const successAlert = document.getElementById('orderSuccess');
      const errorAlert = document.getElementById('orderError');
      if (!orderForm.checkValidity()) {
        orderForm.classList.add('was-validated');
        if (errorAlert) errorAlert.classList.remove('d-none');
        if (successAlert) successAlert.classList.add('d-none');
        return;
      }
      orderForm.classList.remove('was-validated');
      orderForm.reset();
      if (errorAlert) errorAlert.classList.add('d-none');
      if (successAlert) successAlert.classList.remove('d-none');
      setTimeout(() => { if (successAlert) successAlert.classList.add('d-none'); }, 5000);
    });
  }

  // 4. Фильтр каталога
  const applyFiltersBtn = document.getElementById('applyFilters');
  if (applyFiltersBtn) {
    applyFiltersBtn.addEventListener('click', () => {
      const checkedGenres = Array.from(
        document.querySelectorAll('input[name="genre"]:checked')
      ).map(el => el.value);
      const selectedPlatform = document.querySelector('input[name="platform"]:checked')?.value;
      const selectedYear = document.getElementById('yearFilter').value;
      const cards = document.querySelectorAll('.product-card-item');
      let visibleCount = 0;
      cards.forEach(card => {
        const genreMatch = checkedGenres.length === 0 || checkedGenres.includes(card.dataset.genre);
        const platformMatch = !selectedPlatform || card.dataset.platform === selectedPlatform;
        const yearMatch = !selectedYear || selectedYear === 'Любой' || card.dataset.year === selectedYear;
        if (genreMatch && platformMatch && yearMatch) {
          card.classList.remove('is-hidden');
          visibleCount++;
        } else {
          card.classList.add('is-hidden');
        }
      });
      const noResults = document.getElementById('noResults');
      if (noResults) noResults.classList.toggle('d-none', visibleCount > 0);
    });
  }

  // 5. Кнопка «Наверх» + щит
  const scrollTopBtn = document.getElementById('scrollTopBtn');
  const navbarShield = document.getElementById('navbarShield');

  if (scrollTopBtn) {
    const isNearBottom = () => {
      const scrollTop = window.scrollY || window.pageYOffset;
      const windowHeight = window.innerHeight;
      const docHeight = document.documentElement.scrollHeight;
      return scrollTop + windowHeight >= docHeight - 100;
    };

    if (isNearBottom()) {
      scrollTopBtn.classList.remove('d-none');
      if (navbarShield) navbarShield.classList.remove('d-none');
    }

    window.addEventListener('scroll', () => {
      if (scrollTopBtn.classList.contains('animating')) return;
      if (isNearBottom()) {
        scrollTopBtn.classList.remove('d-none');
        if (navbarShield) navbarShield.classList.remove('d-none');
      } else {
        scrollTopBtn.classList.add('d-none');
        if (navbarShield) navbarShield.classList.add('d-none');
      }
    });

    scrollTopBtn.addEventListener('click', () => {
      if (scrollTopBtn.classList.contains('animating')) return;
      scrollTopBtn.classList.add('animating');
      scrollTopBtn.classList.add('arrow-shoot');
      setTimeout(() => { if (navbarShield) navbarShield.classList.add('shield-hit'); }, 350);
      setTimeout(() => { window.scrollTo({ top: 0, behavior: 'smooth' }); }, 700);
      setTimeout(() => {
        scrollTopBtn.classList.remove('arrow-shoot', 'animating');
        if (navbarShield) navbarShield.classList.remove('shield-hit');
        scrollTopBtn.classList.add('d-none');
        if (navbarShield) navbarShield.classList.add('d-none');
      }, 1100);
    });
  }

  // 6. Анимация счётчиков достижений
  const achievementsSection = document.getElementById('achievements');
  if (achievementsSection) {
    const counters = achievementsSection.querySelectorAll('[data-count]');
    const animateNumber = (el) => {
      const raw = el.dataset.count;
      const target = parseFloat(raw);
      const suffix = el.dataset.suffix || '';
      const decimals = raw.includes('.') ? raw.split('.')[1].length : 0;
      const duration = 1600;
      const start = performance.now();

      const tick = (now) => {
        const progress = Math.min((now - start) / duration, 1);
        const eased = 1 - Math.pow(1 - progress, 3);
        const current = target * eased;
        el.textContent = current.toFixed(decimals) + suffix;
        if (progress < 1) requestAnimationFrame(tick);
      };
      requestAnimationFrame(tick);
    };

    if ('IntersectionObserver' in window) {
      const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            counters.forEach(animateNumber);
            observer.disconnect();
          }
        });
      }, { threshold: 0.3 });
      observer.observe(achievementsSection);
    } else {
      counters.forEach(animateNumber);
    }
  }
});

// ============================================================
// Анимация счётчиков достижений на странице about.html
// ============================================================
const achievementsSection = document.getElementById('achievements');
if (achievementsSection) {
  const counters = achievementsSection.querySelectorAll('[data-count]');

  const animateNumber = (el) => {
    const raw = el.dataset.count;
    const target = parseFloat(raw);
    const suffix = el.dataset.suffix || '';
    const decimals = raw.includes('.') ? raw.split('.')[1].length : 0;
    const duration = 1600;
    const start = performance.now();

    const tick = (now) => {
      const progress = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3); // easeOutCubic
      const current = target * eased;
      el.textContent = current.toFixed(decimals) + suffix;
      if (progress < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  };

  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          counters.forEach(animateNumber);
          observer.disconnect();
        }
      });
    }, { threshold: 0.3 });
    observer.observe(achievementsSection);
  } else {
    counters.forEach(animateNumber);
  }
}