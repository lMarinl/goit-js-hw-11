import axios from 'axios';
import Notiflix from 'notiflix';

const refs = {
  form: document.querySelector('#search-form'),
  buttonLoadMore: document.querySelector('.load-more'),
  list: document.querySelector('.gallery'),
  inputForm: document.querySelector('input[name="searchQuery"]'),
}

refs.form.addEventListener('submit', onSearchInfo);
refs.buttonLoadMore.addEventListener('click', onBtnLoadMore);

class InstanceRequest {
  
  constructor() {
    this.q = '';
    this.page = 1;
    this.totalPage = 1;
  }

  async searchInfo() {
    const instance  = axios.create({
      baseURL: 'https://pixabay.com/api/',
      params: {
        key: '40561490-987845abf3df265fd0eb86848',
        image_type: 'photo',
        safesearch: true,
        orientation: 'horizontal',
        q: this.q,
        page: this.page,
        per_page: 40,
      },
    });

    const response = await instance.get();

    return response.data;
  };
};

const instanceRequest = new InstanceRequest();

 async function onSearchInfo (e) {
    e.preventDefault();

    if( refs.inputForm.value.trim() === '') {
      refs.list.innerHTML = '';
      instanceRequest.page = 1;
      instanceRequest.q = refs.inputForm.value;
      Notiflix.Notify.info("string cannot be empty");
      refs.buttonLoadMore.classList.remove('visible');
     refs.buttonLoadMore.classList.add('load-more');
      return
    };
   if (refs.inputForm.value !== instanceRequest.q) {
     refs.list.innerHTML = '';
     instanceRequest.page = 1;
     refs.buttonLoadMore.classList.remove('visible');
     refs.buttonLoadMore.classList.add('load-more');


}
   instanceRequest.q = refs.inputForm.value;
   try {
        const data = await  instanceRequest.searchInfo()
        if (data.hits.length === 0) {
          throw new Error(data.status)
          };
        refs.list.innerHTML = '';
        goTop();
        const markup = renderTemplates(data.hits);
        refs.list.insertAdjacentHTML('beforeend', markup.join(''))
        refs.buttonLoadMore.classList.remove('load-more');
        refs.buttonLoadMore.classList.add('visible');
        instanceRequest.totalPage = Math.ceil(data.totalHits / 40);
        updateBtnStatus();
      }
   catch {

     Notiflix.Notify.failure("Sorry, there are no images matching your search query. Please try again.");
     refs.list.innerHTML = '';
     refs.buttonLoadMore.classList.remove('visible');
     refs.buttonLoadMore.classList.add('load-more');
};
   
    };
async  function onBtnLoadMore() {
try{
   const data = await instanceRequest.searchInfo()
  console.log(data)
    instanceRequest.searchInfo()
        const renderMarkup = renderTemplates(data.hits); 
        refs.list.insertAdjacentHTML('beforeend', renderMarkup.join(''));
        updateBtnStatus();
    } catch (error) {
    console.error('Error', error.status );
    // refs.buttonLoadMore.classList.remove('visible');
    //  refs.buttonLoadMore.classList.add('load-more');
  }
};

  function renderTemplate ({ webformatURL,largeImageURL, tags, likes, views, comments, downloads }) {
     return  `<div class="photo-card">
     <img src="${webformatURL}" alt="${tags}" loading="lazy" data-source ="${largeImageURL}" width="450" height="200" />
     <div class="info">
       <p class="info-item">Likes:
       <span class ="descr">${likes}</span>
       </p>
       <p class="info-item">Views:
         <span class ="descr">${views}</span>
       </p>
       <p class="info-item">Comments:
       <span class ="descr">${comments}</span>
       </p>
       <p class="info-item">Downloads:
       <span class ="descr">${downloads}</span>
       </p>
     </div>
   </div>`
};
  
  function renderTemplates(hits) {
  const markup = hits.map(renderTemplate);
  return markup;
};

  function updateBtnStatus() { 

  if (instanceRequest.page >= instanceRequest.totalPage) {
    refs.buttonLoadMore.classList.remove('visible');
    refs.buttonLoadMore.classList.add('load-more');
    Notiflix.Notify.info("We're sorry, but you've reached the end of search results.");
  }

};

  function goTop() {
  if (window.scrollY > 0) {
    window.scrollBy(0, -20);
    setTimeout(goTop, 0); 
  }
};