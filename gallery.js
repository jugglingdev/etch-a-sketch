
document.addEventListener("DOMContentLoaded", async function () {

  try {
  const json = "/gallery.json";
  const response = await fetch(json);
  const data = await response.json();
  renderGallery(data);
  initializeSplide();
} catch (error) {
  console.error("Error loading gallery data: ", error);
}
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
};

function initializeSplide() {

  const splide = new Splide( '#main-carousel', {
    type: "slide",
    width: "90%",
    perPage: 1,
    perMove: 1,
    gap: "100px",
    padding: "10%",
    rewind: true,
    pagination: false,
    arrows: true,
  } );
  
  const thumbnails = document.getElementsByClassName( 'thumbnail' );
  let current;
  
  for ( let i = 0; i < thumbnails.length; i++ ) {
    initThumbnail( thumbnails[ i ], i );
  }
  
  function initThumbnail( thumbnail, index ) {
    thumbnail.addEventListener( 'click', function () {
      splide.go( index );
    } );
  }
  
  splide.on( 'mounted move', function () {
    const thumbnail = thumbnails[ splide.index ];
  
    if ( thumbnail ) {
      if ( current ) {
        current.classList.remove( 'is-active' );
      }
  
      thumbnail.classList.add( 'is-active' );
      current = thumbnail;
    }
  } );
  
  splide.mount();
};
