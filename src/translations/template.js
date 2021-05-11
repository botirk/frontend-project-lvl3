import i18next from 'i18next';

export default () => {
  document.title = i18next.t('title');
  const lead = document.getElementsByClassName('lead')[0];
  lead.textContent = i18next.t('promo');
  const display3 = document.getElementsByClassName('display-3')[0];
  display3.textContent = i18next.t('title');
  const input = document.getElementsByTagName('input')[0];
  input.placeholder = i18next.t('link');
  const button = document.getElementsByTagName('button')[0];
  button.textContent = i18next.t('add');
  const example = document.getElementsByClassName('text-muted')[0];
  example.textContent = i18next.t('example');
}