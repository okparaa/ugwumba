export const lazyLoad = () => {
    var lazyImages = document.getElementsByClassName('blazy');
    for(var i = 0; i < lazyImages.length; i++){
        console.log(lazyImages);
        if(elementInViewPort(lazyImages[i])){
            lazyImages[i].setAttribute('src', lazyImages[i].getAttribute('b-src'));
        }
    }
}
export const elementInViewPort = (el) => {
    var rect = el.getBoundingClientRect();
    return (
        rect.top >= 0 &&
        rect.left >= 0 &&
        rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
        rect.right <= (window.innerWidth || document.documentElement.clientWidth)
    );
}