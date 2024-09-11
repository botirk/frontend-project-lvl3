import i18next from 'i18next';
import downloadRSS from '../RSS.js';
import validation from '../validation.js';

const filterAddPosts = (postList, candidates) => {
  const existing = postList.reduce((acc, post) => {
    acc[post.hash()] = true;
    return acc;
  }, {});
  return candidates.filter((post) => existing[post.hash()] !== true)
    .concat(postList)
    .sort((a, b) => b.date - a.date);
};

export const onSubmit = (elsUnmutated, stateUnmutated) => {
  const els = elsUnmutated;
  const state = stateUnmutated;
  // handle
  els.form.addEventListener('submit', (e) => {
    e.preventDefault();
    const fData = new FormData(els.form);
    const url = fData.get('url');
    const error = validation({
      newUrl: url,
      existingUrls: state.feedList.map((feed) => feed.link),
    });
    if (error) {
      state.isSuccess = false;
      state.errorMessage = error;
    } else {
      state.isBusy = true;
      downloadRSS(url).then((result) => {
        state.isSuccess = true;
        state.errorMessage = i18next.t('RSS200');
        els.input.value = '';
        state.feedList.push(result);
        state.postList = filterAddPosts(state.postList, result.items);
      }).catch((exception) => {
        state.isSuccess = false;
        if (exception.message.search(/network/i) !== -1 || exception.message.search(/internet/i) !== -1) {
          state.errorMessage = i18next.t('networkError');
        } else {
          state.errorMessage = i18next.t('notRSS');
        }
      }).finally(() => {
        state.isBusy = false;
      });
    }
  });
};

export const startRefresh = (stateUnmutated) => {
  const state = stateUnmutated;
  setTimeout(() => {
    const promises = state.feedList.map((feed) => downloadRSS(feed.link)
      .then((result) => {
        if (result) state.postList = filterAddPosts(state.postList, result.items);
      }).catch());
    Promise.all(promises).then(() => startRefresh(state));
  }, 5000);
};
