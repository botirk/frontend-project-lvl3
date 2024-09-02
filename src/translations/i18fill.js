import i18next from 'i18next';

export default (els) => {
  document.title = i18next.t('title');

  els.lead.textContent = i18next.t('promo');

  els.title.textContent = i18next.t('title');

  els.link.placeholder = i18next.t('link');

  els.read.textContent = i18next.t('read');

  els.close.textContent = i18next.t('close');

  els.add.textContent = i18next.t('add');

  els.example.textContent = i18next.t('example');

  document.body.style.visibility = 'visible';
};
