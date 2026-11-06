document.addEventListener('DOMContentLoaded', () => {

  // 1. Модальное окно с информацией об игре
  const gameModal = document.getElementById('gameModal');
  if (gameModal) {
    gameModal.addEventListener('show.bs.modal', (event) => {
      const btn = event.relatedTarget;
      if (btn) {
        gameModal.querySelector('.modal-title').textContent = btn.getAttribute('data-title') || '';
        gameModal.querySelector('#modalDesc').textContent = btn.getAttribute('data-desc') || '';
      }
    });
  }

  // 2. Валидация формы ЗБТ на product.html
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

  // 4. Кнопка «Наверх»
  const scrollTopBtn = document.getElementById('scrollTopBtn');
  if (scrollTopBtn) {
    window.addEventListener('scroll', () => {
      if (window.scrollY > 300) scrollTopBtn.classList.remove('d-none');
      else scrollTopBtn.classList.add('d-none');
    });
    scrollTopBtn.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }
});