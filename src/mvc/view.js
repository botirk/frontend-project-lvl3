import onChange from 'on-change';

import model from './model.js';
import { fillFeeds, fillPosts } from '../htmlops.js';

export default (elsUnmutated) => {
  const els = elsUnmutated;
  // model
  const m = model();

  // into view
  const vDispatcher = {};

  vDispatcher.isBusy = (value) => {
    els.add.disabled = value;
    els.input.readOnly = value;
  };

  vDispatcher.isSuccess = (value) => {
    els.feedback.classList.remove('text-danger');
    els.feedback.classList.remove('text-success');
    els.input.classList.remove('is-invalid');
    if (value === true) {
      els.feedback.classList.add('text-success');
    } else if (value === false) {
      els.feedback.classList.add('text-danger');
      els.input.classList.add('is-invalid');
    }
  };

  vDispatcher.errorMessage = (value) => {
    els.feedback.textContent = value ?? '';
  };

  vDispatcher.feedList = (value) => {
    fillFeeds(els, value);
  };

  vDispatcher.postList = (value) => {
    fillPosts(els, value, m.readenList);
  };

  return onChange(
    m,
    (path, value) => {
      vDispatcher[path](value);
    },
  );
};
