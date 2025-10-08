//* MENU
export function initMenu() {
	const menu = document.querySelector('.menu');

	if (menu) {
		const body = document.querySelector('body');
		const header = document.querySelector('.header');
		const orderBtn = document.querySelector('.header__btn');
		const menuLinks = document.querySelectorAll('.menu a');
		const menuBtn = document.querySelector('.menu-btn');

		menuBtn.addEventListener('click', () => {
			header.classList.toggle('active');
			menu.classList.toggle('active');
			menuBtn.classList.toggle('active');
			body.classList.toggle('no-scroll');
		})

		menuLinks.forEach((menuLink) => {
			menuLink.addEventListener('click', () => {
				header.classList.remove('active');
				menu.classList.remove('active');
				menuBtn.classList.remove('active');
				body.classList.remove('no-scroll');
			})
		})

		orderBtn.addEventListener('click', () => {
			header.classList.remove('active');
			menu.classList.remove('active');
			menuBtn.classList.remove('active');
			body.classList.remove('no-scroll');
		})
	}
}