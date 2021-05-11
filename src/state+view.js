import onChange from 'on-change';
import parseRSS from './parseRSS.js';

const sayError = (text, feedback, input) => {
  feedback.textContent = text;
  feedback.classList.add('text-danger');
  feedback.classList.remove('text-success');
  input.classList.add('is-invalid');
}

const saySuccess = (text, feedback, input) => {
  feedback.textContent = text;
  feedback.classList.remove('text-danger');
  feedback.classList.add('text-success');
  input.classList.remove('is-invalid');
}

export default () => {
  // const elements
  const input = document.getElementsByTagName('input')[0];
  const feedback = document.getElementsByClassName('feedback')[0];
  const add = document.getElementsByTagName('button')[0];
  const feeds = document.getElementsByClassName('feeds')[0];
  const posts = document.getElementsByClassName('posts')[0];
  // model
  const state = {
    isValidUrl: true,
    currentRSS: undefined,
    feedList: [],
    postList: []
  }
  // view
  const view = onChange(state, (path, value) => {
    console.log(path, value);
    if (path === 'isValidUrl')
      if (value === false) {
        sayError('Ссылка должна быть валидным URL', feedback, input);
      } else {
        input.classList.remove('is-invalid');
        feedback.textContent = '';
      }
    else if (path === 'currentRSS') {
      if (typeof value === 'string') {
        add.disabled = true;
        fetch(`https://hexlet-allorigins.herokuapp.com/raw?url=${encodeURIComponent(value)}`)
          .then((resp) => resp.text())
          .then((text) => parseRSS(value, text))
          .catch((e) => {
            console.error(e);
            view.currentRSS = undefined;
            sayError('Ресурс не содержит валидный RSS', feedback, input);
          }).then((result) => {
            if (result === undefined) return;
            else if (view.feedList.filter((feed) => feed.link === result.link).length > 0) {
              sayError('RSS уже существует', feedback, input);
            } else {
              view.feedList.push(result);
              view.postList = view.postList.concat(result.items); //todo: need sorting and merging
              saySuccess('RSS успешно загружен', feedback, input);
            }
            view.currentRSS = undefined;
          });
      } else if (value === undefined) {
        add.disabled = false;
        input.value = '';
      } else throw new Error('view.currentRSS = (undefined | string)');
    } else if (path === 'feedList') {
      feeds.innerHTML = '';
      if (state.feedList.length > 0) {
        const name = document.createElement('h2');
        name.textContent = 'Фиды';
        feeds.appendChild(name);

        const ul = document.createElement('ul');
        ul.classList.add('list-group');
        ul.classList.add('mb-5');
        feeds.appendChild(ul);
      }
      const ul = feeds.lastElementChild;
      state.feedList.forEach((feed) => {
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
    } else if (path === 'postList') {
      posts.innerHTML = '';
      if (state.postList.length > 0) {
        const name = document.createElement('h2');
        name.textContent = 'Посты';
        posts.appendChild(name);

        const ul = document.createElement('ul');
        ul.classList.add('list-group');
        posts.appendChild(ul);
      }
      const ul = posts.lastElementChild;
      state.postList.forEach((post) => {
        const li = document.createElement('li');
        li.classList.add('list-group-item');
        li.classList.add('d-flex');
        li.classList.add('justify-content-between');
        li.classList.add('align-items-start');

        const link = document.createElement('a');
        link.href = post.link;
        link.classList.add('font-weight-bold');
        link.dataset.id = '2';
        link.target = '_blank';
        link.rel = 'noopener noreferrer';
        link.textContent = post.title;
        li.appendChild(link);

        const button = document.createElement('button');
        button.type = 'button';
        button.classList.add('btn');
        button.classList.add('btn-primary');
        button.classList.add('btn-sm');
        button.dataset.id = '2';
        button.dataset.target = '#modal';
        button.textContent = 'Просмотр';
        li.appendChild(button);

        ul.appendChild(li);
      });
    }
  });

  return view;
}

/* <div class="col-md-10 col-lg-8 mx-auto posts">
  <h2>Посты</h2>
  <ul class="list-group">
    <li class="list-group-item d-flex justify-content-between align-items-start">
      <a href="https://ru.hexlet.io/courses/python-setup-environment/lessons/poetry-and-packaging/theory_unit" class="font-weight-bold" data-id="2" target="_blank" rel="noopener noreferrer">Сборка дистрибутива пакета с помощью Poetry / Python: Настройка окружения
      </a>
      <button type="button" class="btn btn-primary btn-sm" data-id="2" data-toggle="modal" data-target="#modal">Просмотр
      </button>
      </li> */