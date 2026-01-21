//* MENU
export function initMenu() {
	const menu = document.querySelector('.menu');

	if (menu) {
		const body = document.querySelector('body');
		const header = document.querySelector('.header');
		const menuBtn = document.querySelector('.menu-btn');

		document.addEventListener('click', (e) => {
			// открыть / закрыть меню
			if (e.target.closest('.menu-btn')) {
				header.classList.toggle('active');
				menu.classList.toggle('active');
				menuBtn.classList.toggle('active');
				body.classList.toggle('no-scroll');
			}
			// Закрыть меню при клике на ссылку
			if (e.target.closest('a')) {
				if (menu.classList.contains('active')) {
					header.classList.remove('active');
					menu.classList.remove('active');
					menuBtn.classList.remove('active');
					body.classList.remove('no-scroll');
				}
			}
		})
	}
}