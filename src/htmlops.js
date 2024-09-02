import i18next from 'i18next';

export const fillFeeds = (els, feedList) => {
  els.feeds.innerHTML = '';
  if (feedList.length > 0) {
    const name = document.createElement('h2');
    name.textContent = i18next.t('feeds');
    els.feeds.appendChild(name);

    const ul = document.createElement('ul');
    ul.classList.add('list-group', 'mb-5');
    els.feeds.appendChild(ul);
  }
  const ul = els.feeds.lastElementChild;
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

const setPostRead = (link, post = undefined, readenList = undefined) => {
  link.classList.remove('fw-bold');
  link.classList.add('fw-normal');
  if (post !== undefined && readenList !== undefined) readenList[post.hash()] = true;
};

const createPostButton = (els, post, readenList, link) => {
  const button = document.createElement('button');
  button.type = 'button';
  button.classList.add('btn', 'btn-primary', 'btn-sm');
  button.dataset.id = '2';
  button.dataset.bsToggle = 'modal';
  button.dataset.bsTarget = '#modal';
  button.textContent = i18next.t('view');
  button.addEventListener('click', () => {
    els.modalTitle.textContent = post.title;
    els.modalBody.textContent = post.description;
    els.modalLink.href = post.link;
    setPostRead(link, post, readenList);
  });

  return button;
};

const createPostLink = (post, readenList) => {
  const link = document.createElement('a');
  link.href = post.link;
  link.classList.add('font-weight-bold', 'fw-bold');
  if (readenList[post.hash()] === true) setPostRead(link);
  link.dataset.id = '2';
  link.target = '_blank';
  link.rel = 'noopener noreferrer';
  link.textContent = post.title;
  link.addEventListener('click', () => setPostRead(link, post, readenList));

  return link;
};

const createPost = (els, post, readenList) => {
  const li = document.createElement('li');
  li.classList.add('list-group-item', 'd-flex', 'justify-content-between', 'align-items-start');
  const link = li.appendChild(createPostLink(post, readenList));
  li.appendChild(createPostButton(els, post, readenList, link));
  return li;
};

export const fillPosts = (els, postList, readenList) => {
  els.posts.innerHTML = '';
  if (postList.length > 0) {
    const name = document.createElement('h2');
    name.textContent = i18next.t('posts');
    els.posts.appendChild(name);

    const ul = document.createElement('ul');
    ul.classList.add('list-group');
    els.posts.appendChild(ul);
  }

  const ul = els.posts.lastElementChild;
  postList.forEach((post) => (ul.appendChild(
    createPost(els, post, readenList),
  )));
};
