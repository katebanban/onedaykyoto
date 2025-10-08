/** data-autocalc="varName, property"
* varName - имя будущей переменной
* property - название свойства (width / height / both / ничего), при указании both или ничего то будет браться width и height
*/
export const autoCalc = () => {
	const allCalcItems = document.querySelectorAll('[data-autocalc]');
	const root = document.querySelector(':root');

	if (allCalcItems.length) {
		allCalcItems.forEach((item) => {
			if (item.hasAttribute('data-autocalc')) {
				let data = item.getAttribute('data-autocalc').trim().replaceAll(' ', '');
				let varName = data;
				let property = '';

				if (data.includes(',')) {
					data = data.split(',');
					varName = data[0];
					property = data[1];
				}

				if (property === 'width') {
					let itemWidth = item.offsetWidth;
					root.style.setProperty(`--${varName}-${property}`, `${itemWidth}px`);
				}

				if (property === 'height') {
					let itemHeight = item.offsetHeight;
					root.style.setProperty(`--${varName}-${property}`, `${itemHeight}px`);
				}

				if (property === '' || property === 'both') {
					let itemWidth = item.offsetWidth;
					let itemHeight = item.offsetHeight;
					root.style.setProperty(`--${varName}-width`, `${itemWidth}px`);
					root.style.setProperty(`--${varName}-height`, `${itemHeight}px`);
				}
			}
		})
	}

	window.addEventListener('resize', autoCalc);
	window.addEventListener('load', autoCalc);
}