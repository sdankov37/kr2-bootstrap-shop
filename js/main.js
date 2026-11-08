document.addEventListener('DOMContentLoaded', () => {

  // 1. Модалка с информацией об игре
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

  // 2. Валидация формы ЗБТ / заявки на страницах игр
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

  // 3. Валидация формы заявки на order.html
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

  // 4. Фильтр в каталоге
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
        const cardGenre = card.dataset.genre;
        const cardPlatform = card.dataset.platform;
        const cardYear = card.dataset.year;

        const genreMatch = checkedGenres.length === 0 || checkedGenres.includes(cardGenre);
        const platformMatch = !selectedPlatform || cardPlatform === selectedPlatform;
        const yearMatch = !selectedYear || selectedYear === 'Любой' || cardYear === selectedYear;

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

  // 5. Кнопка «Наверх» — стрела и щит
  const scrollTopBtn = document.getElementById('scrollTopBtn');
  const navbarShield = document.getElementById('navbarShield');

  if (scrollTopBtn) {

    // Проверка: пользователь у самого низа страницы?
    // Запас в 100px — чтобы не нужно было скроллить до пикселя
    const isNearBottom = () => {
      const scrollTop = window.scrollY || window.pageYOffset;
      const windowHeight = window.innerHeight;
      const docHeight = document.documentElement.scrollHeight;
      return scrollTop + windowHeight >= docHeight - 100;
    };

    // Показ при загрузке (если пользователь уже внизу — например, по якорю)
    if (isNearBottom()) {
      scrollTopBtn.classList.remove('d-none');
      if (navbarShield) navbarShield.classList.remove('d-none');
    }

    // Показ/скрытие при скролле
    window.addEventListener('scroll', () => {
      // Пока идёт анимация «выстрела» — не трогаем видимость
      if (scrollTopBtn.classList.contains('animating')) return;

      if (isNearBottom()) {
        scrollTopBtn.classList.remove('d-none');
        if (navbarShield) navbarShield.classList.remove('d-none');
      } else {
        scrollTopBtn.classList.add('d-none');
        if (navbarShield) navbarShield.classList.add('d-none');
      }
    });

    // Клик по стреле
    scrollTopBtn.addEventListener('click', () => {
      // Защита от повторных кликов во время анимации
      if (scrollTopBtn.classList.contains('animating')) return;
      scrollTopBtn.classList.add('animating');

      // 1. Стрела «летит» (CSS-анимация arrow-shoot)
      scrollTopBtn.classList.add('arrow-shoot');

      // 2. Через 350мс — стрела «долетела», щит вспыхивает
      setTimeout(() => {
        if (navbarShield) navbarShield.classList.add('shield-hit');
      }, 350);

      // 3. Через 700мс — запускаем плавный скролл наверх
      //    (после того как пользователь увидел попадание)
      setTimeout(() => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }, 700);

      // 4. Через 1100мс — анимации закончились, скрываем оба элемента
      setTimeout(() => {
        scrollTopBtn.classList.remove('arrow-shoot', 'animating');
        if (navbarShield) navbarShield.classList.remove('shield-hit');
        scrollTopBtn.classList.add('d-none');
        if (navbarShield) navbarShield.classList.add('d-none');
      }, 1100);
    });
  }
});