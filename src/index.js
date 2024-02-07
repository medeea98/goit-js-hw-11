import axios from 'axios';
import Notiflix from 'notiflix';
import SimpleLightbox from 'simplelightbox'; 

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

      if (page === 1) {
        gallery.innerHTML = ""; 
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
  });

  function createPhotoCard(image) {
    console.log("createPhotoCard function called");
    const card = document.createElement("div");
    card.classList.add("photo-card");
    const link = document.createElement("a");
    link.href = image.largeImageURL;
    link.setAttribute("data-lightbox", "gallery");
    link.setAttribute("data-title", image.tags);

    const img = document.createElement("img");
    img.src = image.webformatURL;
    img.alt = image.tags;
    img.loading = "lazy";

    const info = document.createElement("div");
    info.classList.add("info");

    const likes = document.createElement("p");
    likes.classList.add("info-item");
    likes.innerHTML = `<b>Likes:</b> ${image.likes}`;

    const views = document.createElement("p");
    views.classList.add("info-item");
    views.innerHTML = `<b>Views:</b> ${image.views}`;

    const comments = document.createElement("p");
    comments.classList.add("info-item");
    comments.innerHTML = `<b>Comments:</b> ${image.comments}`;

    const downloads = document.createElement("p");
    downloads.classList.add("info-item");
    downloads.innerHTML = `<b>Downloads:</b> ${image.downloads}`;

    info.appendChild(likes);
    info.appendChild(views);
    info.appendChild(comments);
    info.appendChild(downloads);

    link.appendChild(img); 
    card.appendChild(link); 
    card.appendChild(info);

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
