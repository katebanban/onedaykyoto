import Swiper from 'swiper/bundle';

export function initSliders() {
	const roadmapSlider = new Swiper('.roadmap-slider', {
		slidesPerView: 'auto',
		spaceBetween: 32,
		loop: true,
		autoplay: {
			delay: 3000
		}
	});

	const reviewsSlider = new Swiper('.reviews-slider', {
		slidesPerView: 1,
		autoHeight: true,
		grabCursor: true,
		spaceBetween: 96, // 2 раза по 48
		loop: true,
		autoplay: {
			delay: 5000
		},

		breakpoints: {
			// when window width is >= 769px
			769: {
				slidesPerView: 2
			}
		}
	});
}