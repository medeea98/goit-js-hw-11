import axios from 'axios';
import Notiflix from 'notiflix';
import SimpleLightbox from 'simplelightbox'; 
import 'simplelightbox/dist/simple-lightbox.min.css';

document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("search-form");
  const loadMoreBtn = document.querySelector(".load-more");
  let page = 1;
  const lightbox = new SimpleLightbox('.gallery a');

  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    const searchQuery = form.searchQuery.value.trim();
    if (searchQuery === "") return;

    try {
      const response = await axios.get("https://pixabay.com/api/", {
        params: {
          key: "39728913-c0ee6c2d48ec23bc7f8279286",
          q: searchQuery,
          image_type: "photo",
          orientation: "horizontal",
          safesearch: true,
          page: page,
          per_page: 40,
        },
      });

      const gallery = document.querySelector(".gallery"); 
      if (!gallery) return; 

      if (response.data.hits.length === 0) {
        Notiflix.Notify.failure(
          "Sorry, there are no images matching your search query. Please try again."
        );
        return;
      }
      gallery.innerHTML = "";
      if (page === 1) {
        Notiflix.Notify.success(
          `Hooray! We found ${response.data.totalHits} images.`
        );
        loadMoreBtn.style.display = "block";
      }
      response.data.hits.forEach((image) => {
        const card = createPhotoCard(image);
        gallery.appendChild(card);
      });
      lightbox.refresh();

      page++;
    } catch (error) {
      console.error("Error fetching images:", error);
    }
  });

  loadMoreBtn.addEventListener("click", () => {
    form.dispatchEvent(new Event("submit"));
    scrollToGallery();
    loadMoreBtn.classList.remove('hidden');
    loadMoreBtn.classList.add('load-more');

  });
  function createPhotoCard(image) {
    console.log("createPhotoCard function called");
    
    const card = document.createElement("div");
    card.classList.add("photo-card");
    
    const link = `
        <a href="${image.largeImageURL}" data-lightbox="gallery" data-title="${image.tags}">
            <img src="${image.webformatURL}" alt="${image.tags}" loading="lazy" />
        </a>
    `;
    const info = `
    <div class="info">
        <p class="info-item"><b>Likes:</b> <span class="like-number">${image.likes}</span></p>
        <p class="info-item"><b>Views:</b> <span class="view-number">${image.views}</span></p>
        <p class="info-item"><b>Comments:</b> <span class="comment-number">${image.comments}</span></p>
        <p class="info-item"><b>Downloads:</b> <span class="download-number">${image.downloads}</span></p>
    </div>
`;
    card.innerHTML = link + info;

    return card;
}
  function scrollToGallery() {
    const gallery = document.querySelector(".gallery");
    if (gallery) {
      const { height: cardHeight } = gallery.firstElementChild.getBoundingClientRect();
      window.scrollBy({
        top: cardHeight * 2,
        behavior: "smooth",
      });
    }
  }
});
