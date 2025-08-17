/* Шаблон карточки в DOM — используется для клонирования новой карточки */
export const CARD_TEMPLATE = document.querySelector('#card-template').content;

/* Создаёт DOM-элемент карточки */
export const buildCard = (cardData, { onDeleteCard, onLikeCard, onOpenImage }, userId) => {
  const card = CARD_TEMPLATE.querySelector('.card').cloneNode(true);
  const cardImage = card.querySelector('.card__image');
  const cardTitle = card.querySelector('.card__title');
  const likeCounter = card.querySelector('.card__quantiti-like');
  const likeButton = card.querySelector('.card__like-button');

  const likes = Array.isArray(cardData.likes) ? cardData.likes : [];
  const ownerId = cardData.owner?._id ?? '';

  if (cardImage) {
    cardImage.src = cardData.link;
    cardImage.alt = cardData.name || 'Изображение';
    cardImage.addEventListener('click', () => onOpenImage(cardData));
  }
  if (cardTitle) cardTitle.textContent = cardData.name;
  if (likeCounter) likeCounter.textContent = likes.length;

  const deleteButton = card.querySelector('.card__delete-button');
  if (deleteButton) {
    if (ownerId !== userId) deleteButton.style.display = 'none';
    else deleteButton.addEventListener('click', () => onDeleteCard(card, cardData._id));
  }

  if (likeButton) {
    likeButton.classList.toggle('card__like-button_is-active', likes.some(l => l._id === userId));
    if (!likeButton.dataset.listenerAttached) {
      likeButton.addEventListener('click', () => {
        const currentLikeStatus = likeButton.classList.contains('card__like-button_is-active');
        onLikeCard(card, cardData._id, currentLikeStatus, userId);
      });
      likeButton.dataset.listenerAttached = 'true';
    }
  }

  return card;
};

/* Обновляет лайки в DOM */
export const renderLikes = (cardElement, likesArr, userId) => {
  if (!cardElement) return;
  const likeCounter = cardElement.querySelector('.card__quantiti-like');
  const likeButton = cardElement.querySelector('.card__like-button');

  const likes = Array.isArray(likesArr) ? likesArr : [];
  if (likeCounter) likeCounter.textContent = likes.length;
  if (likeButton) likeButton.classList.toggle('card__like-button_is-active', likes.some(l => l._id === userId));
};