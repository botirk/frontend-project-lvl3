import 'bootstrap/dist/css/bootstrap.min.css';
import i18next from 'i18next';
import view from './state+view.js';
import ru from './translations/ru.js';
import template from './translations/template.js';

const isValidUrl = (url) => {
  try {
    new URL(url);
  } catch (e) {
    return false;
  }
  return true;
};

const init = async () => {
  // languages
  await i18next.init({ lng: 'ru', debug: true, resources: { ru } });
  template();
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
}
init();
