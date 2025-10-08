import "gulp-avif-css/plugin.js"; //! НЕ УДАЛЯТЬ (помогает узнать, поддерживает ли браузер avif и webp)

//import { initMenu } from "./js_modules/menu.js";
//import { autoCalc } from "./js_modules/autoCalc.js";
import { smoothScroll } from "./js_modules/smoothScroll.js";
//import { initSliders } from "./js_modules/sliders.js";
//import { loader } from "./js_modules/loader.js";

//import { Fancybox } from "@fancyapps/ui";

//Fancybox.bind("[data-fancybox]", {
//	Images: {
//		content: (_ref, slide) => {
//			if (slide.triggerEl.hasAttribute('data-sources')) {
//				let rez = "<picture>";

//				const alt = slide.alt || '';

//				slide.sources.split(";").map((source, index) => {
//					rez += `<source srcset="${source}"/>`;
//				});

//				rez += `<img src="${slide.src}" alt="${alt}"/>`;

//				rez += "</picture>";

//				return rez;
//			}
//		},
//	},
//});

//initMenu();
//autoCalc();
smoothScroll();
//initSliders();
//loader();

//* ДАТА (год создания/запуска проекта - актуальный год)
//const year = Number(document.querySelector('[data-year]').innerText);
//const currentYear = new Date().getFullYear();

//if (year < currentYear) document.querySelector('[data-year]').innerText = `${year} - ${currentYear}`;
//if (year > currentYear) document.querySelector('[data-year]').innerText = currentYear;