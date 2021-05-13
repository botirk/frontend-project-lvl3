/* eslint-disable import/extensions */
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/js/dist/modal.js';
import i18next from 'i18next';
import init from './init.js';
import ru from './translations/ru.js';
import template from './translations/template.js';

i18next.init({ lng: 'ru', debug: true, resources: { ru } }).then(() => template());
init();
