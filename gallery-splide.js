
document.addEventListener("DOMContentLoaded", function () {

    setTimeout(() => {
        


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
}, 1000);
  });
  