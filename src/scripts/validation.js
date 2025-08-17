// Клиентская валидация форм — лёгкие, понятные функции для показа ошибок и управления кнопкой

// Показывает ошибку для поля внутри формы
const showError = (config, formEl, inputEl, message) => {
  const errorEl = formEl.querySelector(`.${inputEl.id}-error`);
  if (!errorEl) return;
  inputEl.classList.add(config.inputErrorClass);
  errorEl.textContent = message;
  errorEl.classList.add(config.errorClass);
};

// Скрывает ошибку для поля внутри формы
const hideError = (config, formEl, inputEl) => {
  const errorEl = formEl.querySelector(`.${inputEl.id}-error`);
  if (!errorEl) return;
  inputEl.classList.remove(config.inputErrorClass);
  errorEl.textContent = '';
  errorEl.classList.remove(config.errorClass);
};

// Валидирует одно поле и показывает/скрывает ошибку
const validateInput = (config, formEl, inputEl) => {
  if (inputEl.validity.patternMismatch) {
    showError(config, formEl, inputEl, inputEl.dataset.errorPatternMessage || inputEl.validationMessage);
  } else if (!inputEl.validity.valid) {
    showError(config, formEl, inputEl, inputEl.validationMessage);
  } else {
    hideError(config, formEl, inputEl);
  }
};

// Проверяет, есть ли среди полей хотя бы одно невалидное
const hasInvalid = (inputList) => inputList.some((inputEl) => !inputEl.validity.valid);

// Включает/выключает сабмит-кнопку в форме
const setSubmitState = (config, inputList, buttonEl) => {
  if (!buttonEl) return;
  const invalid = hasInvalid(inputList);
  buttonEl.disabled = invalid;
  buttonEl.classList.toggle(config.inactiveButtonClass, invalid);
};

// Навешивает слушатели на поля формы и инициализирует состояние кнопки
const addFormListeners = (config, formEl) => {
  const inputList = Array.from(formEl.querySelectorAll(config.inputSelector));
  const buttonEl = formEl.querySelector(config.buttonSelector);

  // начальная проверка
  inputList.forEach((inputEl) => validateInput(config, formEl, inputEl));
  setSubmitState(config, inputList, buttonEl);

  inputList.forEach((inputEl) => {
    inputEl.addEventListener('input', () => {
      validateInput(config, formEl, inputEl);
      setSubmitState(config, inputList, buttonEl);
    });
  });
};


 // Сбрасывает видимые ошибки и состояние кнопки в форме.
 export const resetValidation = (formElement, config) => {
  const inputList = Array.from(formElement.querySelectorAll(config.inputSelector));
  const buttonEl = formElement.querySelector(config.buttonSelector);

  inputList.forEach((inputEl) => {
    hideError(config, formElement, inputEl);
    inputEl.setCustomValidity('');
  });

  setSubmitState(config, inputList, buttonEl);
};


// Подключает валидацию ко всем формам на странице по переданному конфигу.
export const initValidation = (config) => {
  const formList = Array.from(document.querySelectorAll(config.formSelector));
  formList.forEach((formEl) => addFormListeners(config, formEl));
};
