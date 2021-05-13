/* eslint-disable import/extensions, no-param-reassign */
import onChange from 'on-change';
import i18next from 'i18next';
import axios from 'axios';
import parseRSS from './parseRSS.js';

const sayError = (text, feedback, input) => {
  feedback.textContent = text;
  feedback.classList.add('text-danger');
  feedback.classList.remove('text-success');
  input.classList.add('is-invalid');
};

const saySuccess = (text, feedback, input) => {
  feedback.textContent = text;
  feedback.classList.remove('text-danger');
  feedback.classList.add('text-success');
  input.classList.remove('is-invalid');
};

const downloadRSS = (link) => axios(`https://hexlet-allorigins.herokuapp.com/raw?url=${encodeURIComponent(link)}&timestamp=${new Date().getTime()}`,
  { responseType: 'text' })
  .then((resp) => resp.data)
  .then((text) => parseRSS(link, text));

const fillFeeds = (feedsHTML, feedList) => {
  feedsHTML.innerHTML = '';
  if (feedList.length > 0) {
    const name = document.createElement('h2');
    name.textContent = i18next.t('feeds');
    feedsHTML.appendChild(name);

    const ul = document.createElement('ul');
    ul.classList.add('list-group');
    ul.classList.add('mb-5');
    feedsHTML.appendChild(ul);
  }
  const ul = feedsHTML.lastElementChild;
  feedList.forEach((feed) => {
    const li = document.createElement('li');
    li.classList.add('list-group-item');

    const title = document.createElement('h3');
    title.textContent = feed.title;
    li.appendChild(title);

    const desc = document.createElement('p');
    desc.textContent = feed.description;
    li.appendChild(desc);

    ul.appendChild(li);
  });
};

const filterAddPosts = (postList, candidates) => {
  const existing = postList.reduce((acc, post) => {
    acc[post.hash()] = true;
    return acc;
  }, {});
  return candidates.filter((post) => existing[post.hash()] !== true)
    .concat(postList)
    .sort((a, b) => b.date - a.date);
};

const setRead = (link, post = undefined, readenList = undefined) => {
  link.classList.remove('font-weight-bold');
  link.classList.add('font-weight-normal');
  if (post !== undefined && readenList !== undefined) readenList[post.hash()] = true;
};

const fillPosts = (postsHTML, postList, readenList, modalTitle, modalBody, modalLink) => {
  postsHTML.innerHTML = '';
  if (postList.length > 0) {
    const name = document.createElement('h2');
    name.textContent = i18next.t('posts');
    postsHTML.appendChild(name);

    const ul = document.createElement('ul');
    ul.classList.add('list-group');
    postsHTML.appendChild(ul);
  }
  const ul = postsHTML.lastElementChild;
  postList.forEach((post) => {
    const li = document.createElement('li');
    li.classList.add('list-group-item');
    li.classList.add('d-flex');
    li.classList.add('justify-content-between');
    li.classList.add('align-items-start');

    const link = document.createElement('a');
    link.href = post.link;
    link.classList.add('font-weight-bold');
    if (readenList[post.hash()] === true) setRead(link);
    link.dataset.id = '2';
    link.target = '_blank';
    link.rel = 'noopener noreferrer';
    link.textContent = post.title;
    link.addEventListener('click', () => {
      setRead(link, post, readenList);
    });
    li.appendChild(link);

    const button = document.createElement('button');
    button.type = 'button';
    button.classList.add('btn');
    button.classList.add('btn-primary');
    button.classList.add('btn-sm');
    button.dataset.id = '2';
    button.dataset.toggle = 'modal';
    button.dataset.target = '#modal';
    button.textContent = i18next.t('view');
    button.addEventListener('click', () => {
      modalTitle.textContent = post.title;
      modalBody.textContent = post.description;
      modalLink.href = post.link;
      setRead(link, post, readenList);
    });
    li.appendChild(button);

    ul.appendChild(li);
  });
};

export default () => {
  // const elements
  const modalTitle = document.getElementsByClassName('modal-title')[0];
  const modalBody = document.getElementsByClassName('modal-body')[0];
  const modalLink = document.getElementsByClassName('full-article')[0];
  const input = document.getElementsByTagName('input')[0];
  const feedback = document.getElementsByClassName('feedback')[0];
  const add = document.getElementsByTagName('button')[2];
  const feeds = document.getElementsByClassName('feeds')[0];
  const posts = document.getElementsByClassName('posts')[0];
  // model
  const state = {
    isValidUrl: true,
    currentRSS: undefined,
    feedList: [],
    postList: [],
    readenList: [],
  };
  // view
  const view = onChange(state, (path, value) => {
    if (path === 'isValidUrl') {
      if (value === false) {
        sayError(i18next.t('urlInvalid'), feedback, input);
      } else {
        input.classList.remove('is-invalid');
        feedback.textContent = '';
      }
    } else if (path === 'currentRSS') {
      if (typeof value === 'string') {
        add.disabled = true;
        downloadRSS(value)
          .catch((e) => {
            console.error(e);
            view.currentRSS = undefined;
            sayError(i18next.t('notRSS'), feedback, input);
          }).then((result) => {
            if (result === undefined) return;
            if (view.feedList.filter((feed) => feed.link === result.link).length > 0) {
              sayError(i18next.t('repeatRSS'), feedback, input);
            } else {
              view.feedList.push(result);
              view.postList = filterAddPosts(view.postList, result.items);
              saySuccess(i18next.t('RSS200'), feedback, input);
            }
            view.currentRSS = undefined;
          });
      } else if (value === undefined) {
        add.disabled = false;
        input.value = '';
      } else throw new Error('view.currentRSS = (undefined | string)');
    } else if (path === 'feedList') {
      fillFeeds(feeds, view.feedList);
    } else if (path === 'postList') {
      fillPosts(posts, view.postList, view.readenList, modalTitle, modalBody, modalLink);
    }
  });
  // refreshing
  const refresh = () => {
    const promises = [];
    view.feedList.forEach((feed) => {
      promises.push(downloadRSS(feed.link)
        .catch(() => undefined)
        .then((result) => {
          if (result === undefined) return;
          view.postList = filterAddPosts(view.postList, result.items);
        }));
    });
    Promise.all(promises).then(() => setTimeout(refresh, 5000));
  };
  setTimeout(refresh, 5000);
  // result
  return view;
};
