// Управление попапами: открытие, закрытие

// Навешивает обработчик ESC для конкретного попапа и возвращает сам обработчик
function attachEscHandler(popup) {
  const handler = function (evt) {
    if (evt.key === 'Escape') {
      hideModal(null, popup);
    }
  };
  document.addEventListener('keydown', handler);
  return handler;
}

export function showModal(popup) {
  if (!popup) return;

  popup.classList.add('popup_is-opened');

  // Ставим флаг aria
  popup.setAttribute('aria-hidden', 'false');

  // Переносим фокус на первый фокусируемый элемент внутри попапа (если есть)
  const firstFocusable = popup.querySelector('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])');
  if (firstFocusable) firstFocusable.focus();

  // Навешиваем ESC-обработчик один раз и сохраняем его, чтобы при закрытии можно было убрать
  if (!popup._escHandler) {
    popup._escHandler = attachEscHandler(popup);
  }
}

export function hideModal(evt, popup) {
  if (!popup) return;

  if (!evt || evt.target.classList.contains('popup__close') || evt.target.classList.contains('popup')) {
    popup.classList.remove('popup_is-opened');
    popup.setAttribute('aria-hidden', 'true');

    if (popup._escHandler) {
      document.removeEventListener('keydown', popup._escHandler);
      delete popup._escHandler;
    }
  }
}