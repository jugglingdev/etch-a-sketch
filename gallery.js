
document.addEventListener("DOMContentLoaded", function () {
  const json = "/gallery.json";

  fetch(json)
  .then(response => response.json())
  .then(data => renderGallery(data))
  .catch(error => console.error("Error loading gallery data: ", error));
});

function renderGallery(data) {
  const gallery = document.querySelector('.splide__list');
  const thumbnails = document.querySelector('#thumbnails');

  data.gallery.forEach(item => {
    const slide = document.createElement('li');
    const thumbnail = document.createElement('li');

    slide.classList.add('splide__slide');
    thumbnail.classList.add('thumbnail');

 slide.innerHTML = `
      <img src="${item.imageUrl}" alt="${item.description}" />
      <div class="slide-description">
      <cite>${item.title}</cite>
      <q>${item.description}</q>
        <p>- ${item.artist}</p>
      </div>
    `;

    thumbnail.innerHTML = `
      <img src="${item.imageUrl}" alt="${item.description}" />
    `;

    gallery.appendChild(slide);
    thumbnails.appendChild(thumbnail);
  });
}