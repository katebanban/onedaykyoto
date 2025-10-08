import Swiper from 'swiper/bundle';

export function initSliders() {
	const catalogSlider = new Swiper('.catalog-slider', {
		slidesPerView: 'auto',
		//grabCursor: true,

		scrollbar: {
			el: ".catalog__slider-scroll",
			draggable: true
		}
	});

	const benefitsSwiper = new Swiper('.benefits-swiper', {
		grabCursor: true,
		spaceBetween: 48,
		loop: true,
		autoplay: {
			delay: 4000
		},

		pagination: {
			el: ".benefits__pagination",
			clickable: true
		}
	});

	const reviewsSwiper = new Swiper('.reviews-swiper', {
		autoHeight: true,
		grabCursor: true,
		spaceBetween: 48,
		loop: true,

		navigation: {
			nextEl: '.reviews-swiper__btn-next',
			prevEl: '.reviews-swiper__btn-prev',
		}
	});
}