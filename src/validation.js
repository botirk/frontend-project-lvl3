import i18next from 'i18next';
import { string } from 'yup';

export default (state) => {
  const scheme = string().url(() => i18next.t('urlInvalid')).test('repeated list', () => i18next.t('repeatRSS'), (s) => state.feedList.find((feed) => feed.link === s) === undefined);
  return (testedString) => {
    try {
      scheme.validateSync(testedString);
      return undefined;
    } catch (e) {
      return e.errors[0];
    }
  };
};
