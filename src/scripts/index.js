import { initialCards } from './cards.js';
import { createCard, deleteCard, likeCard } from './components/card.js';
import { openPopup, closePopup } from './components/modal.js';

//Элементы профиля
const popupEditProfile = document.querySelector('.popup_type_edit');
const profileSection = document.querySelector('.profile');
const editProfileButton = profileSection.querySelector('.profile__edit-button');
const profileForm = document.forms['edit-profile'];
const profileNameInput = profileForm.elements.name;
const profileJobInput = profileForm.elements.description;
const closeEditProfileButton = popupEditProfile.querySelector('.popup__close');
const profileName = profileSection.querySelector('.profile__title');
const profileJob = profileSection.querySelector('.profile__description');

//Элементы добавления карточек
const addCardButton = profileSection.querySelector('.profile__add-button');
const popupAddCard = document.querySelector('.popup_type_new-card');
const addCardForm = document.forms['new-place'];
const cardNameInput = addCardForm.elements['place-name'];
const cardLinkInput = addCardForm.elements.link;
const closeAddCardButton = popupAddCard.querySelector('.popup__close');

//Блок с карточками
const placesSection = document.querySelector('.places');
const cardsList = placesSection.querySelector('.places__list');

// Добавление карточек на страницу
initialCards.forEach(card => {
  cardsList.append(createCard(card.link, card.name, deleteCard, likeCard, openImage));
});

// Открытие попапа профиля
editProfileButton.addEventListener('click', () => {
  openPopup(popupEditProfile);
  profileNameInput.value = profileName.textContent;
  profileJobInput.value = profileJob.textContent;
});

// Редактирование профиля
function handleProfileFormSubmit(evt) {
  evt.preventDefault();
  profileName.textContent = profileNameInput.value;
  profileJob.textContent = profileJobInput.value;
  closePopup(popupEditProfile);
}
popupEditProfile.addEventListener('submit', handleProfileFormSubmit);

// Открытие попапа изображения карточки
function openImage(name, link) {
  const containerPopupCard = document.querySelector('.popup_type_image');
  const popupImage = containerPopupCard.querySelector('.popup__image');
  const popupCaption = containerPopupCard.querySelector('.popup__caption');
  popupImage.src = link;
  popupImage.alt = name;
  popupCaption.textContent = name;
  openPopup(containerPopupCard);
}

// Открытие попапа добавления карточки
addCardButton.addEventListener('click', () => openPopup(popupAddCard));

popupAddCard.addEventListener('submit', handleAddCardFormSubmit);

closeEditProfileButton.addEventListener('click', () => closePopup(popupEditProfile));
closeAddCardButton.addEventListener('click', () => closePopup(popupAddCard));

// Если есть попап с изображением
const popupImage = document.querySelector('.popup_type_image');
const closeImageButton = popupImage.querySelector('.popup__close');
closeImageButton.addEventListener('click', () => closePopup(popupImage));

// Обработчик добавления новой карточки
function handleAddCardFormSubmit(evt) {
  evt.preventDefault();
  cardsList.prepend(createCard(cardLinkInput.value, cardNameInput.value, deleteCard, likeCard, openImage));
  cardLinkInput.value = '';
  cardNameInput.value = '';
  closePopup(popupAddCard);
}
