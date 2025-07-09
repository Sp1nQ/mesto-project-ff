//Открытие и закрытие попапа
export function handlePopup (container, buttonClose) {
  container.classList.add('popup_is-animated');
  container.classList.add('popup_is-opened');

  function closePopup() {
    container.classList.remove('popup_is-opened');
    document.removeEventListener('keydown', closePopupByEsc);
    container.removeEventListener('mousedown', closePopupByOverlay);
    buttonClose.removeEventListener('click', closePopup);
  }

  function closePopupByEsc (evt) {
    if (evt.key === 'Escape') {
      closePopup();
    }
  }

  function closePopupByOverlay(evt) {
    if (evt.target === container) {
      closePopup();
    }
  }

  buttonClose.addEventListener('click', closePopup);
  document.addEventListener('keydown', closePopupByEsc);
  container.addEventListener('mousedown', closePopupByOverlay);
}