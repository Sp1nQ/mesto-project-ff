// Настройки API (URL и заголовки)
const apiConfig = {
  baseUrl: 'https://mesto.nomoreparties.co/v1/wff-cohort-39',
  headers: {
    authorization: '64431449-8eef-4a0a-9950-f54ef9c68d50',
    'Content-Type': 'application/json'
  }
};

// Универсальная обработка fetch-ответа — возвращает разобранный JSON или отклоняет промис с ошибкой
const parseResponse = (res) => {
  if (res.ok) {
    return res.json();
  }
  return Promise.reject(new Error(`Ошибка: ${res.status}`));
};

// Промис с данными текущего пользователя (выполняется при импорте, как было раньше)
export const fetchCurrentUser = fetch(`${apiConfig.baseUrl}/users/me`, {
  headers: apiConfig.headers
}).then(res => parseResponse(res));

// Переключение лайка (PUT/DELETE)
export const setCardLike = (cardId, isLiked) => {
  return fetch(`${apiConfig.baseUrl}/cards/likes/${cardId}`, {
    method: isLiked ? 'DELETE' : 'PUT',
    headers: apiConfig.headers
  }).then(res => parseResponse(res));
};

// Удаление карточки по id
export const removeCard = (cardId) => {
  return fetch(`${apiConfig.baseUrl}/cards/${cardId}`, {
    method: 'DELETE',
    headers: apiConfig.headers
  }).then(res => parseResponse(res));
};

// Обновление профиля (PATCH)
export const updateProfile = (profileData = null) => {
  const options = {
    method: 'PATCH',
    headers: apiConfig.headers
  };

  if (profileData) {
    options.body = JSON.stringify(profileData);
  }

  return fetch(`${apiConfig.baseUrl}/users/me`, options)
    .then(res => parseResponse(res));
};

// Запросы к коллекции карточек (GET, POST и т.д.)
// Если передан cardId (например 'abc123'), автоматически добавляется слеш.
export const requestCards = (method = 'GET', cardData = null, cardId = '') => {
  const options = {
    method,
    headers: apiConfig.headers
  };

  if (cardData) {
    options.body = JSON.stringify(cardData);
  }
  const idPath = cardId ? `/${cardId}` : '';
  return fetch(`${apiConfig.baseUrl}/cards${idPath}`, options)
    .then(res => parseResponse(res));
};

// Обновление аватара пользователя
export const updateAvatar = (newAvatar) => {
  return fetch(`${apiConfig.baseUrl}/users/me/avatar`, {
    method: 'PATCH',
    headers: apiConfig.headers,
    body: JSON.stringify({ avatar: newAvatar })
  }).then(res => parseResponse(res));
};