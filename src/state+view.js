/* eslint-disable import/extensions, no-param-reassign */
import onChange from 'on-change';
import i18next from 'i18next';
import axios from 'axios';
import parseRSS from './parseRSS.js';

const sayResult = (isSuccess, text, feedback, input) => {
  feedback.textContent = text;
  if (isSuccess === true) {
    feedback.classList.remove('text-danger');
    feedback.classList.add('text-success');
    input.classList.remove('is-invalid');
  } else {
    feedback.classList.add('text-danger');
    feedback.classList.remove('text-success');
    input.classList.add('is-invalid');
  }
};

const downloadRSS = (link) => axios(`https://hexlet-allorigins.herokuapp.com/get?url=${encodeURIComponent(link)}&disableCache=true`)
  .then((resp) => {
    const { status, contents } = resp.data;
    if (status !== undefined && status.error !== undefined) throw new Error(status.error.code);
    return parseRSS(link, contents);
  });

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

const generatePostLink = (post, readenList) => {
  const link = document.createElement('a');
  link.href = post.link;
  link.classList.add('font-weight-bold');
  if (readenList[post.hash()] === true) setRead(link);
  link.dataset.id = '2';
  link.target = '_blank';
  link.rel = 'noopener noreferrer';
  link.textContent = post.title;
  link.addEventListener('click', () => setRead(link, post, readenList));

  return link;
};

const generatePostButton = (post, readenList, modalTitle, modalBody, modalLink, link) => {
  const button = document.createElement('button');
  button.type = 'button';
  button.classList.add('btn', 'btn-primary', 'btn-sm');
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

  return button;
};

const generatePost = (post, readenList, modalTitle, modalBody, modalLink) => {
  const li = document.createElement('li');
  li.classList.add('list-group-item', 'd-flex', 'justify-content-between', 'align-items-start');
  const link = li.appendChild(generatePostLink(post, readenList));
  li.appendChild(generatePostButton(post, readenList, modalTitle, modalBody, modalLink, link));
  return li;
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
  postList.forEach((post) => (ul.appendChild(
    generatePost(post, readenList, modalTitle, modalBody, modalLink),
  )));
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
        sayResult(false, i18next.t('urlInvalid'), feedback, input);
      } else {
        input.classList.remove('is-invalid');
        feedback.textContent = '';
      }
    } else if (path === 'currentRSS') {
      if (typeof value === 'string') {
        if (view.feedList.filter((feed) => feed.link === value).length > 0) {
          sayResult(false, i18next.t('repeatRSS'), feedback, input);
          view.currentRSS = undefined;
          return;
        }
        add.disabled = true;
        input.readOnly = true;
        downloadRSS(value)
          .catch((e) => {
            // console.error(e);
            view.currentRSS = undefined;
            if (e.message.search(/network/i) !== -1
              || e.message.search(/internet/i) !== -1) sayResult(false, i18next.t('networkError'), feedback, input);
            else sayResult(false, i18next.t('notRSS'), feedback, input);
          }).then((result) => {
            if (result === undefined) return;
            view.feedList.push(result);
            view.postList = filterAddPosts(view.postList, result.items);
            sayResult(true, i18next.t('RSS200'), feedback, input);
            view.currentRSS = undefined;
          });
      } else if (value === undefined) {
        add.disabled = false;
        input.readOnly = false;
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
