/* eslint-disable import/extensions */
import i18next from 'i18next';

import view from './mvc/view.js';
import i18fill from './translations/i18fill.js';
import ru from './translations/ru.js';
import elements from './elements.js';
import { onSubmit, startRefresh } from './mvc/control.js';

const init = () => {
  // elements
  const els = elements();
  // language
  if (!i18next.isInitialized) {
    i18next.init({
      lng: 'ru',
      debug: process.env.NODE_ENV !== 'production',
      resources: { ru },
    }).then(() => i18fill(els));
  }
  // view + model
  const state = view(els);
  // controller
  onSubmit(els, state);
  // refresh
  // console.log(state);
  startRefresh(state);
};

export default init;
