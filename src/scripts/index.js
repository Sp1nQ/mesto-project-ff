// Подключаем CSS страниц (собирается через webpack)
import '../pages/index.css';

// Импорты функций из модулей (карточки, попапы, валидация, API)
import { buildCard, renderLikes } from './card.js';
import { showModal, hideModal } from './modal.js';
import { initValidation, resetValidation } from './validation.js';
import { fetchCurrentUser, setCardLike, requestCards, updateProfile, removeCard, updateAvatar } from './api.js';

/* === Поиск DOM-элементов на странице === */

// Список карточек (контейнер для вставки)
const cardList = document.querySelector('.places__list');

// Все попапы (для общих слушателей закрытия)
const popups = document.querySelectorAll('.popup');

// Элементы профиля: кнопки, формы и поля формы редактирования
const editButton = document.querySelector('.profile__edit-button');
const popupTypeEdit = document.querySelector('.popup_type_edit');
const editForm = document.forms['edit-profile'];
const inputName = editForm.elements.name;
const inputDescription = editForm.elements.description;

// Элементы добавления карточки
const addButton = document.querySelector('.profile__add-button');
const popupTypeAdd = document.querySelector('.popup_type_new-card');
const addForm = document.forms['new-place'];

// Элементы для редактирования аватара
const profileAvatarElement = document.querySelector('.profile__image');
const popupTypeEditAvatar = document.querySelector('.popup_type_edit-avatar');
const editAvatarForm = document.forms['update-avatar'];
const newAvatar = editAvatarForm.elements['link-avatar'];

// Попап предпросмотра изображения
const popupTypeImage = document.querySelector('.popup_type_image');

// Поля профиля на странице (отображение)
const profileName = document.querySelector('.profile__title');
const profileDescription = document.querySelector('.profile__description');

// Элементы внутри попапа с изображением
const popupImage = document.querySelector('.popup__image');
const popupTitle = document.querySelector('.popup__caption');

// Конфиг для очистки валидации (перед повторным открытием форм)
const resetValidationConfig = {
    inputSelector: '.popup__input',
    buttonSelector: '.popup__button',
    inputErrorClass: 'popup__input-error',
    errorClass: 'popup__input-error_active'
};

let userId; // будет заполнен при получении данных пользователя с сервера

/* === Обработчики кликов для открытия попапов === */

// Открытие формы редактирования профиля — подставляем текущие значения
editButton.addEventListener('click', () => {
  inputName.value = profileName.textContent;
  inputDescription.value = profileDescription.textContent;

  showModal(popupTypeEdit);
  resetValidation(editForm, resetValidationConfig);
});

// Открытие формы добавления карточки — сбрасываем поля
addButton.addEventListener('click', () => {
  addForm.reset();
  showModal(popupTypeAdd);
  resetValidation(addForm, resetValidationConfig);
});

// Открытие попапа редактирования аватара
profileAvatarElement.addEventListener('click', () => {
  editAvatarForm.reset();
  showModal(popupTypeEditAvatar);
  resetValidation(editAvatarForm, resetValidationConfig);
})

/* === Универсальный слушатель закрытия по клику внутри попапов === */
popups.forEach((popup) => {
  // hideModal обрабатывает разные варианты (нажатие на фон, крестик и т.д.)
  popup.addEventListener('click', (evt) => hideModal(evt, popup));
})

/* === Работа с предпросмотром изображения карточки === */
// Подставляет картинку и заголовок в соответствующий попап и открывает его
function showImagePreview(card, popupType){ 
  popupImage.src = card.link;
  popupImage.alt = card.name;
  popupTitle.textContent = card.name;

  showModal(popupType, null);
}

/* === Обработчики сабмитов форм === */

// Отправка формы редактирования профиля — делает запрос на API и обновляет DOM
async function onProfileSubmit(evt) {
  evt.preventDefault();
  const submitButton = editForm.querySelector('.popup__button');
  setLoadingState(submitButton, true);

  const profileData = {
    name: editForm.elements['name'].value.trim(),
    about: editForm.elements['description'].value.trim()
  };

  try {
    await updateProfile(profileData);
    profileName.textContent = profileData.name;
    profileDescription.textContent = profileData.about;
    hideModal(null, popupTypeEdit);
  } catch (err) {
    console.log('Ошибка при отправке формы профиля:', err);
  } finally {
    setLoadingState(submitButton, false);
  }
}

// Добавление новой карточки через форму — отправляем на сервер, рендерим карточку
async function onAddCardSubmit(evt) {
  evt.preventDefault();
  const submitButton = addForm.querySelector('.popup__button');
  setLoadingState(submitButton, true);

  const cardData = {
    name: addForm.elements['place-name'].value.trim(),
    link: addForm.elements['link'].value.trim()
  };

  try {
    const card = await requestCards('POST', cardData);
    const newCard = buildCard(
      card,
      {
        onDeleteCard: () => onCardDelete(newCard, card._id),
        onLikeCard: onCardLike,
        onOpenImage: () => { showImagePreview(card, popupTypeImage); showModal(popupTypeImage, null); }
      },
      userId
    );
    cardList.prepend(newCard);
    hideModal(null, popupTypeAdd);
  } catch (err) {
    console.log('Ошибка при создании карточки', err);
  } finally {
    setLoadingState(submitButton, false);
  }
}

// Обновление аватара — отправляем новый URL и обновляем фон аватара на странице
async function onAvatarSubmit(evt) {
  evt.preventDefault();
  const submitButton = editAvatarForm.querySelector('.popup__button');
  setLoadingState(submitButton, true);

  try {
    const userData = await updateAvatar(newAvatar.value.trim());
    profileAvatarElement.style.backgroundImage = `url(${userData.avatar})`;
    hideModal(null, popupTypeEditAvatar);
  } catch (err) {
    console.log('Ошибка в обновлении аватара:', err);
  } finally {
    setLoadingState(submitButton, false);
  }
}

/* === Привязка обработчиков сабмитов к формам === */
editForm.addEventListener('submit', onProfileSubmit);
addForm.addEventListener('submit', onAddCardSubmit);
editAvatarForm.addEventListener('submit', onAvatarSubmit)

/* === Инициализация клиентской валидации форм === */
initValidation({
  formSelector: '.popup__form',
  inputSelector: '.popup__input',
  buttonSelector: '.popup__button',
  inactiveButtonClass: 'button__inactive',
  inputErrorClass: 'popup__input-error',
  errorClass: 'popup__input-error_active'
}); 

/* === Загрузка начальных данных: карточки и информация о пользователе === */
// Promise.all ждёт оба запроса: карточки и данные пользователя
Promise.all([requestCards(), fetchCurrentUser])
  .then(([cardsData, userData]) => {
    // Сохраняем id для дальнейших операций (лайки, удаление)
    userId = userData._id;

    // Заполняем профиль данными с сервера
    profileName.textContent = userData.name;
    profileDescription.textContent = userData.about;
    profileAvatarElement.style.backgroundImage = `url(${userData.avatar})`;
    profileAvatarElement.alt = `Аватар пользователья ${userData.name}`;

    // Рендерим полученные карточки
    cardsData.forEach(function (initialCard) {
      const addedCard = buildCard(
      initialCard, 
      {
        onDeleteCard: onCardDelete, 
        onLikeCard: onCardLike,
        onOpenImage: () => { showImagePreview(initialCard, popupTypeImage); showModal(popupTypeImage, null) }
      },
      userId
      );
    cardList.append(addedCard); 
    });
  })
  .catch((err) => console.log('Ошибка в обработке Promise.all при загрузке карточек с сервера', err))

/* === Обработчики для like и удаления карточки === */

// Лайк/дизлайк — отправляем запрос и затем обновляем интерфейс лайков
const onCardLike = (card, cardId, isLiked) => {  
  setCardLike(cardId, isLiked)
    .then((updateCard) => {
      renderLikes(card, updateCard.likes, userId)
    })
    .catch((err) => console.log('Ошибка при обновлении лайка:', err))
}

// Удаление карточки — отправляем запрос и при успехе удаляем элемент из DOM
const onCardDelete = (cardElement, cardId) => {
  removeCard(cardId)
  .then(() => {
    cardElement.remove();
  })
  .catch((err) => console.log('Ошибка в обработки удаления карточки:', err))
}

/* === Функция для переключения состояния кнопки во время сетевых операций === */
// isLoading = true — блокируем кнопку и показываем текст загрузки
function setLoadingState(button, isLoading, defaultText = 'Сохранить', loadingText = 'Сохранение...') {
  if (isLoading) {
    button.disabled = true;
    button.textContent = loadingText;
    button.classList.add('button_loading');
  } else {
    button.disabled = false;
    button.textContent = defaultText;
    button.classList.remove('button_loading');
  }
}