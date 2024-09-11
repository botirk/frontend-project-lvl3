import i18next from 'i18next';
import * as yup from 'yup';

const scheme = yup.object().shape({
  newUrl: yup.string().required().url(() => i18next.t('urlInvalid')),
  existingUrls: yup.array(),
}).test('repeated list', () => i18next.t('repeatRSS'), (urlObject) => !urlObject.existingUrls.includes(urlObject.newUrl));

export default (urlObject) => {
  try {
    scheme.validateSync(urlObject);
    return undefined;
  } catch (e) {
    return e.errors[0];
  }
};
