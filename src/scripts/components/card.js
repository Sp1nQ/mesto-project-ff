//Создание карточки по шаблону
export function createCard(link, name, deleteCard, likeCard, openImage) {
  const cardTemplate = document.querySelector('#card-template').content;
  const cardElement = cardTemplate.querySelector('.card').cloneNode(true);
  const buttonDelete = cardElement.querySelector('.card__delete-button');
  const buttonLike = cardElement.querySelector('.card__like-button');
  const cardImage = cardElement.querySelector('.card__image');

  cardElement.querySelector('.card__image').setAttribute('src', link);
  cardElement.querySelector('.card__image').setAttribute('alt', name);
  cardElement.querySelector('.card__title').textContent = name;
  
  buttonDelete.addEventListener('click',function (evt) { 
    const deletedCard = evt.target.closest('.card');
    deleteCard(deletedCard);
  });

  buttonLike.addEventListener('click', function(evt) {
    const likedCard = evt.target.closest('.card');
    likeCard(likedCard);
  });

  cardImage.addEventListener('click', function(evt) {
    openImage(evt);
  })


  return cardElement;
};

//Удаление карточки
export function deleteCard (card) {
 card.remove();
};

//Лайк карточки
export function likeCard (card) {
  const buttonLike = card.querySelector('.card__like-button');
  buttonLike.classList.toggle('card__like-button_is-active');
};