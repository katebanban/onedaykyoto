//* ПЛАВНЫЙ СКРОЛЛ НА ВСЕ ССЫЛКИ ВНУТРИ СТРАНИЦЫ (+ перемещение К САМОМУ НАЧАЛУ секции для ссылок, ведущих к секциям на странице)

export function smoothScroll() {
	const allLinks = document.querySelectorAll('a');

	if (allLinks.length) {
		allLinks.forEach((link) => {
			//! если ссылка с классом .no-smooth-scroll, то не будет плавно скролить
			if (!link.classList.contains('no-smooth-scroll')) {
				link.addEventListener('click', (e) => {
					const href = link.getAttribute('href');

					if (href === '#') {
						e.preventDefault();

						window.scrollTo({
							top: 0,
							behavior: 'smooth',
						})
					}

					if (href !== '#' && href.startsWith('#')) {
						e.preventDefault();

						// находим секцию, на которую ведёт нажатая ранее ссылка, по href (адресу)
						const sectionEl = document.querySelector(href);
						// находим координаты самого верха (начала) секции
						const sectionElPosition = sectionEl.getBoundingClientRect().top;

						window.scrollBy({
							top: sectionElPosition,
							behavior: 'smooth',
						})
					}
				})
			}
		})
	}
}