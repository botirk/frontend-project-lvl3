/* eslint-disable import/extensions */
import i18next from 'i18next';
import view from './state+view.js';
import template from './translations/template.js';
import ru from './translations/ru.js';

const isValidUrl = (url) => {
  try {
    const test = new URL(url);
    return test !== undefined;
  } catch (e) {
    return false;
  }
};

const init = () => {
  // language
  i18next.init({ lng: 'ru', debug: true, resources: { ru } })
    .then(() => template());
  // const elements
  const form = document.getElementsByTagName('form')[0];
  // view + model
  const state = view();
  // controller
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const fData = new FormData(form);
    const url = fData.get('url');
    state.isValidUrl = (isValidUrl(url) === true);
    if (state.isValidUrl) state.currentRSS = url;
  });
};

export default init;
