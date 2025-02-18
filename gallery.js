document.addEventListener('DOMContentLoaded', async function () {
    try {
        const json =
            'https://jugglingdev.github.io/etch-a-sketch/data/gallery.json';
        const response = await fetch(json);
        const data = await response.json();
        renderGallery(data);
        initializeSplide();
    } catch (error) {
        console.error('Error loading gallery data: ', error);
    }
});

function renderGallery(data) {
    const gallery = document.querySelector('.splide__list');
    const thumbnails = document.querySelector('#thumbnails');

    const galleryFragment = document.createDocumentFragment();
    const thumbnailFragment = document.createDocumentFragment();

    data.gallery.forEach((item) => {
        const slide = document.createElement('li');
        slide.classList.add('splide__slide');

        const imageWrapper = document.createElement('div');
        imageWrapper.classList.add('image-wrapper');

        const image = document.createElement('img');
        image.src = item.imageUrl;
        image.alt = item.description || '';

        const description = document.createElement('div');
        description.classList.add('slide-description');

        let hasContent = false;

        if (item.title) {
            const title = document.createElement('cite');
            title.textContent = item.title;
            description.appendChild(title);
            hasContent = true;
        }

        if (item.description) {
            const quote = document.createElement('q');
            quote.textContent = item.description;
            description.appendChild(quote);
            hasContent = true;
        }

        if (item.artist) {
            const artist = document.createElement('p');
            artist.textContent = `- ${item.artist}`;
            description.appendChild(artist);
            hasContent = true;
        }

        imageWrapper.appendChild(image);
        slide.appendChild(imageWrapper);
        if (hasContent) {
            slide.appendChild(description);
        }

        galleryFragment.appendChild(slide);

        // Create thumbnail
        const thumbnail = document.createElement('li');
        thumbnail.classList.add('thumbnail');

        const thumbnailImage = document.createElement('img');
        thumbnailImage.src = item.imageUrl;
        thumbnailImage.alt = item.description || 'Thumbnail image';

        thumbnail.appendChild(thumbnailImage);
        thumbnailFragment.appendChild(thumbnail);
    });

    gallery.appendChild(galleryFragment);
    thumbnails.appendChild(thumbnailFragment);
}

function initializeSplide() {
    const splide = new Splide('#main-carousel', {
        type: 'slide',
        width: '90%',
        perPage: 1,
        perMove: 1,
        gap: '200px',
        padding: '10%',
        rewind: true,
        pagination: false,
        arrows: true,
    });

    const thumbnails = document.getElementsByClassName('thumbnail');
    let current;

    for (let i = 0; i < thumbnails.length; i++) {
        initThumbnail(thumbnails[i], i);
    }

    function initThumbnail(thumbnail, index) {
        thumbnail.addEventListener('click', function () {
            splide.go(index);
        });
    }

    splide.on('mounted move', function () {
        const thumbnail = thumbnails[splide.index];

        if (thumbnail) {
            if (current) {
                current.classList.remove('is-active');
            }

            thumbnail.classList.add('is-active');
            current = thumbnail;
        }
    });

    splide.mount();
}
