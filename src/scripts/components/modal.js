//Открытие и закрытие попапа
export function openPopup(popup) {
  popup.classList.add('popup_is-animated', 'popup_is-opened');
  document.addEventListener('keydown', closePopupByEsc);
  popup.addEventListener('mousedown', closePopupByOverlay);
}

export function closePopup(popup) {
  popup.classList.remove('popup_is-opened');
  document.removeEventListener('keydown', closePopupByEsc);
  popup.removeEventListener('mousedown', closePopupByOverlay);
}

function closePopupByEsc(evt) {
  if (evt.key === 'Escape') {
    const openedPopup = document.querySelector('.popup_is-opened');
    if (openedPopup) closePopup(openedPopup);
  }
}

function closePopupByOverlay(evt) {
  if (evt.target === evt.currentTarget) {
    closePopup(evt.currentTarget);
  }
}