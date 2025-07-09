import { initialCards } from './cards.js';
import { createCard, deleteCard, likeCard } from './components/card.js';
import { handlePopup } from './components/modal.js';

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

//Добавление карточек на страницу
initialCards.forEach(card =>{cardsList.append(createCard(card.link, card.name, deleteCard, likeCard, openImage))});

//Открытие и закрытие профиля
editProfileButton.addEventListener('click', (evt) => {
  handlePopup(popupEditProfile, closeEditProfileButton);
  profileNameInput.value = profileName.textContent;
  profileJobInput.value = profileJob.textContent;
});

//Редактирование профиля
function handleProfileFormSubmit(evt) {
  evt.preventDefault();
  profileName.textContent = profileNameInput.value;
  profileJob.textContent = profileJobInput.value;
};

popupEditProfile.addEventListener('submit', handleProfileFormSubmit);

//Открытие и закрытие изображения карточки
function openImage (evt) {
 const containerPopupCard = document.querySelector('.popup_type_image');
 const closePopupCard = containerPopupCard.querySelector('.popup__close');

  handlePopup(containerPopupCard, closePopupCard);
  containerPopupCard.querySelector('.popup__image').setAttribute('src', evt.target.src);
  containerPopupCard.querySelector('.popup__image').setAttribute('alt', evt.target.alt);
};


//Открытие и закрытие попапа создания новой карточки
addCardButton.addEventListener('click', () => handlePopup(popupAddCard, closeAddCardButton));

//Обработчик добавления новой карточки
function handleAddCardFormSubmit (evt) {
  evt.preventDefault();
  cardsList.prepend(createCard(cardLinkInput.value, cardNameInput.value, deleteCard)); 
  cardLinkInput.value = '';
  cardNameInput.value = '';
  handlePopup(popupAddCard, closeAddCardButton);
}

//Добавление новой карточки
popupAddCard.addEventListener('submit', handleAddCardFormSubmit);