'use strict';
const modalContainer = document.getElementById('modal');
const showModalbtn = document.getElementById('show-modal');
const closeModalbtn = document.getElementById('modal-close');
const bookMarkForm = document.getElementById('bookmark-form');
const websiteNameEl = document.getElementById('website-name');
const websiteUrlEl = document.getElementById('website-url');
const bookMarkContainer = document.getElementById('bookmarks-container');

let bookmarks = [];
//show modal
const showModal = function () {
  modalContainer.classList.add('show-modal');
  websiteNameEl.focus();
};

//close modal
const closeModal = function () {
  modalContainer.classList.remove('show-modal');
};

showModalbtn.addEventListener('click', showModal);
closeModalbtn.addEventListener('click', closeModal);
window.addEventListener('click', e =>
  e.target === modalContainer
    ? modalContainer.classList.remove('show-modal')
    : false
);

const validateLink = function (nameValue, urlValue) {
  const exp =
    /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)/;
  const reg = new RegExp(exp);
  if (!nameValue || !urlValue) {
    alert('Please submit values for both fields');
    return false;
  }

  if (!urlValue.match(reg)) {
    alert('Please provide a valid web address');
    return false;
  }

  return true;
};

const buildDOM = function () {
  bookMarkContainer.textContent = '';
  bookmarks.forEach(bookmark => {
    const { name, url } = bookmark;

    const item = document.createElement('div');
    item.classList.add('item');

    const closeIcon = document.createElement('i');
    closeIcon.classList.add('fas', 'fa-times');
    closeIcon.setAttribute('title', 'Delete Bookmark');
    closeIcon.setAttribute('onclick', `deleteBookmarks('${url}')`);

    const linkInfo = document.createElement('div');
    linkInfo.classList.add('name');

    const favicon = document.createElement('img');
    favicon.setAttribute(
      'src',
      `https://s2.googleusercontent.com/s2/favicons?domain=${url}`
    );
    favicon.setAttribute('alt', 'favicon');

    const link = document.createElement('a');
    link.setAttribute('href', `${url}`);
    link.setAttribute('target', '_blank');
    link.textContent = name;

    linkInfo.append(favicon, link);
    item.append(closeIcon, linkInfo);
    bookMarkContainer.appendChild(item);
  });
};

const fetchLink = function () {
  if (localStorage.getItem('bookmarks')) {
    bookmarks = JSON.parse(localStorage.getItem('bookmarks'));
  } else {
    bookmarks = [
      {
        name: 'Jacinto Design',
        url: 'https://jacinto.design',
      },
    ];

    localStorage.setItem('bookmarks', JSON.stringify(bookmarks));
  }

  buildDOM();
};

const deleteBookmarks = function (url) {
  bookmarks.forEach((bookmark, i) => {
    if (bookmark.url === url) {
      bookmarks.splice(i, 1);
    }
  });

  localStorage.setItem('bookmarks', JSON.stringify(bookmarks));
  fetchLink();
};

const addBookmark = function (e) {
  e.preventDefault();
  const websiteName = websiteNameEl.value;
  let websiteUrl = websiteUrlEl.value;

  if (!websiteUrl.includes('http://', 'https://')) {
    websiteUrl = `https://${websiteUrl}`;
  }

  validateLink(websiteName, websiteUrl);

  const bookmark = {
    name: websiteName,
    url: websiteUrl,
  };

  bookmarks.push(bookmark);
  localStorage.setItem('bookmarks', JSON.stringify(bookmarks));
  fetchLink();
  websiteNameEl.focus;
  bookMarkForm.reset();
};

bookMarkForm.addEventListener('submit', addBookmark);
fetchLink();
