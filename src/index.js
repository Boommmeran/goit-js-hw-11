import Notiflix from 'notiflix';
import ImgFetching from './fetchImg';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';

const formRef = document.querySelector('.form');
const submitButtonRef = document.querySelector('.form__button');
const loadMoreBtnRef = document.querySelector('.load-more');
const galleryRef = document.querySelector('.gallery');

const fetchImgServise = new ImgFetching();

formRef.addEventListener('submit', onFormSubmit);
loadMoreBtnRef.addEventListener('click', onLoadMore);

async function onFormSubmit(e) {
  e.preventDefault();
  fetchImgServise.page = 1;
  loadMoreBtnRef.style.display = 'none';
  galleryRef.innerHTML = '';

  fetchImgServise.searchQuery = e.currentTarget.searchQuery.value;
  if (fetchImgServise.searchQuery === "") {
    Notiflix.Notify.info(
      'Sorry, there are no images matching your search query. Please try again.'
    );
    return;
  }
  fetchImgServise.resetPage();
  fetchImgServise.resetHits();
  createContainer();
}

async function onLoadMore() {
  fetchImgServise.plusPage();
  createContainer();
}

async function createContainer() {
  const response = await fetchImgServise.fetchImg();

  fetchImgServise.hits += response.data.hits.length;

  if (fetchImgServise.page === 1 && response.data.totalHits !== 0) {
    Notiflix.Notify.success(
    `Hooray! We found ${response.data.totalHits} images.`
  );
  };

  if (response.data.hits.length === 0) {
    Notiflix.Notify.info(
      'Sorry, there are no images matching your search query. Please try again.'
    );
    loadMoreBtnRef.style.display = 'none';
    return;
  }

  if (response.data.totalHits <= fetchImgServise.hits) {
    Notiflix.Notify.info(
      "We're sorry, but you've reached the end of search results."
    );
    loadMoreBtnRef.style.display = 'none';
    marcup(response.data.hits);
    return;
  }

  loadMoreBtnRef.style.display = 'block';

  marcup(response.data.hits);
};

function marcup(response) {
  const galleryItem = response
    .map(
      ({
        webformatURL,
        largeImageURL,
        tags,
        likes,
        views,
        comments,
        downloads,
      }) => {
        return `<div class="container">
        <a class="gallery__link" href="${largeImageURL}">
        <img src="${webformatURL}" alt="${tags}" loading="lazy" />
        <div class="info">
          <p class="info__item">
            <b>Likes ${likes}</b>
          </p>
          <p class="info__item">
            <b>Views ${views}</b>
          </p>
          <p class="info__item">
            <b>Comments ${comments}</b>
          </p>
          <p class="info__item">
            <b>Downloads ${downloads}</b>
          </p>
        </div>
        </a>
      </div>`;
      }
    )
    .join('');
  galleryRef.insertAdjacentHTML('beforeEnd', galleryItem);

  const lightbox = new SimpleLightbox('.gallery a', {
    scrollZoom: false,
    captionsData: 'alt',
    captionDelay: 250,
  });
};
