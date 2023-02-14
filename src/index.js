import { Notify } from 'notiflix/build/notiflix-notify-aio';
import axios from 'axios';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';

const form = document.getElementById('search-form');
const gallery = document.querySelector('.gallery');
// const loadButton = document.querySelector('.load-more');
const guard = document.querySelector('.guard');

const perPage = 40;
let page = 1;
let keyWord = '';

const observer = new IntersectionObserver(
  entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        onSerch(keyWord);
      }
    });
  },
  { rootMargin: '200px' }
);

form.addEventListener('submit', handSubmit);

function handSubmit(event) {
  event.preventDefault();
  const inputValue = form.searchQuery.value.trim();
  if (!inputValue || keyWord === inputValue) {
    return;
  }
  keyWord = inputValue;
  page = 1;
  gallery.innerHTML = '';
  // loadButton.classList.add('is-hidden');
  onSerch(keyWord, page);
}

// loadButton.addEventListener('click', () => {
//   loadButton.classList.add('is-hidden');

//   onSerch(keyWord);
//   smoothScroll();
// });

// function onSerch(keyWord) {
//   getResponse(keyWord)
//     .then(response => {
//       const totalPages = Math.ceil(response.totalHits / perPage);

//       if (page == 1) {
//         Notify.success(`Hooray! We found ${response.totalHits} images.`);
//       }

//       renderGallery(response.hits);
//       if (page > 1) {
//         smoothScroll();
//       }
//       page += 1;

//       const lightbox = new SimpleLightbox('.gallery a');
//       lightbox.refresh();

//       if (page > totalPages) {
//         Notify.warning(
//           "We're sorry, but you've reached the end of search results."
//         );
//         loadButton.classList.add('is-hidden');
//       }
//     })
//     .catch(error => {
//       Notify.failure(error.message);
//     });
// }

async function onSerch(keyWord) {
  const data = await getResponse(keyWord);

  const totalPages = Math.ceil(data.totalHits / perPage);
  console.log(totalPages);
  if (page == 1) {
    Notify.success(`Hooray! We found ${data.totalHits} images.`);
  }

  renderGallery(data.hits);

  if (page > 1) {
    smoothScroll();
  }
  page += 1;

  const lightbox = new SimpleLightbox('.gallery a');
  lightbox.refresh();
  observer.observe(guard);

  if (page > totalPages) {
    Notify.warning(
      "We're sorry, but you've reached the end of search results."
    );
    observer.unobserve(guard);
    return;
    // loadButton.classList.add('is-hidden');
  }
}

function renderGallery(fotos) {
  // loadButton.classList.add('is-hidden');
  const markupGallery = fotos
    .map(foto => {
      const {
        webformatURL,
        largeImageURL,
        tags,
        likes,
        views,
        comments,
        downloads,
      } = foto;
      return `<div class="photo-card">
  <a class="gallery-link" href=${largeImageURL}><img   class="gallery-image" src=${webformatURL} alt=${tags} loading="lazy" /></a>
  <div class="info">
    <p class="info-item">
      <b>Likes</b> ${likes}
    </p>
    <p class="info-item">
      <b>Views</b> ${views}
    </p>
      <p class="info-item">
      <b>Comments</b> ${comments}
    </p>
    <p class="info-item">
      <b>Downloads</b> ${downloads}
    </p>
  </div>
</div>`;
    })
    .join('');
  gallery.insertAdjacentHTML('beforeend', markupGallery);
  // loadButton.classList.remove('is-hidden');
}

// function getResponse(name) {
//   const API_KEY = `33587680-716f90511d290523ac71bcbd3`;

//   return axios
//     .get(
//       `https://pixabay.com/api/?key=${API_KEY}&q=${name}&image_type=photo&orientation=horizontal&safesearch=true&page=${page}&per_page=${perPage}`
//     )
//     .then(response => {
//       if (response.data.totalHits === 0) {
//         throw Error(
//           'Sorry, there are no images matching your search query. Please try again.'
//         );
//       }

//       return response.data;
//     });
// }

async function getResponse(name) {
  try {
    const API_KEY = `33587680-716f90511d290523ac71bcbd3`;
    const { data } = await axios.get(
      `https://pixabay.com/api/?key=${API_KEY}&q=${name}&image_type=photo&orientation=horizontal&safesearch=true&page=${page}&per_page=${perPage}`
    );

    if (data.totalHits === 0) {
      throw Error(
        'Sorry, there are no images matching your search query. Please try again.'
      );
    }

    return data;
  } catch (error) {
    Notify.failure(error.message);
  }
}

function smoothScroll() {
  const { height: cardHeight } = document
    .querySelector('.gallery')
    .firstElementChild.getBoundingClientRect();

  window.scrollBy({
    top: cardHeight * 2,
    behavior: 'smooth',
  });
}
