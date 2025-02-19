const GALLERY_JSON_URL =
    'https://jugglingdev.github.io/etch-a-sketch/data/gallery.json';

const SPLIDE_CONFIG = {
    type: 'slide',
    width: '90%',
    perPage: 1,
    perMove: 1,
    gap: '200px',
    padding: '10%',
    rewind: true,
    pagination: false,
    arrows: true,
};

async function fetchGalleryData() {
    try {
        const response = await fetch(GALLERY_JSON_URL);
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error loading gallery data: ', error);
    }
}

function renderGallery(data) {
    const gallery = document.querySelector('.splide__list');
    const thumbnails = document.querySelector('#thumbnails');

    if (!data || !data.gallery) return;

    const galleryFragment = document.createDocumentFragment();
    const thumbnailFragment = document.createDocumentFragment();

    data.gallery.forEach((item) => {
        galleryFragment.appendChild(createSlide(item));
        thumbnailFragment.appendChild(createThumbnail(item));
    });

    gallery.appendChild(galleryFragment);
    thumbnails.appendChild(thumbnailFragment);
}

function createSlide(item) {
    const slide = document.createElement('li');
    slide.classList.add('splide__slide');

    const imageWrapper = document.createElement('div');
    imageWrapper.classList.add('image-wrapper');

    const image = createImage(item.imageUrl, item.description);
    imageWrapper.appendChild(image);
    slide.appendChild(imageWrapper);

    const info = createInfo(item);
    if (info) slide.appendChild(info);

    return slide;
}

function createThumbnail(item) {
    const thumbnail = document.createElement('li');
    thumbnail.classList.add('thumbnail');

    const thumbnailImage = createImage(
        item.imageUrl,
        item.description || 'Thumbnail image'
    );
    thumbnail.appendChild(thumbnailImage);

    return thumbnail;
}

function createImage(imageUrl, description) {
    const image = document.createElement('img');
    image.src = imageUrl;
    image.alt = description || '';
    return image;
}

function createInfo(item) {
    const info = document.createElement('div');
    info.classList.add('slide-info');

    if (item.title) info.appendChild(createTextElement('cite', item.title));
    if (item.description)
        info.appendChild(createTextElement('q', item.description));
    if (item.artist)
        info.appendChild(createTextElement('p', `- ${item.artist}`));

    return info.children.length > 0 ? info : null;
}

function createTextElement(tag, text) {
    const element = document.createElement(tag);
    element.textContent = text;
    return element;
}

function initializeSplide() {
    const splide = new Splide('#main-carousel', SPLIDE_CONFIG);
    const thumbnails = document.getElementsByClassName('thumbnail');
    let activeThumbnail = null;

    Array.from(thumbnails).forEach((thumbnail, index) => {
        thumbnail.addEventListener('click', function () {
            splide.go(index);
        });
    });

    splide.on('mounted move', () =>
        updateActiveThumbnail(thumbnails, splide.index, activeThumbnail)
    );

    splide.mount();
}

function updateActiveThumbnail(thumbnails, index, activeThumbnail) {
    const newThumbnail = thumbnails[index];

    if (newThumbnail) {
        if (activeThumbnail) activeThumbnail.classList.remove('is-active');
        newThumbnail.classList.add('is-active');
        activeThumbnail = newThumbnail;
    }

    return newThumbnail;
}

async function init() {
    const data = await fetchGalleryData();
    if (data) {
        renderGallery(data);
        initializeSplide();
    }
}

document.addEventListener('DOMContentLoaded', init);
