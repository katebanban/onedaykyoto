export const loader = () => {
	const loaderBox = document.querySelector('.loader-box');

	window.addEventListener('load', () => {
		loaderBox.classList.add('hidden');
		document.body.classList.remove('no-scroll');

		setTimeout(() => {
			loaderBox.remove();
		}, 1000);
	})
}