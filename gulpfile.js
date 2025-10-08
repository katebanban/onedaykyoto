const srcFolder = 'src';
const distFolder = 'docs'; // dist

//! Подключение плагинов
//* GULP
import gulp from 'gulp'; // подключаем gulp локально
const { src, dest, watch, parallel, series } = gulp; // подключение конкретно необходимых нам функций Gulp (ES6)

//* Utilities
import browserSync from 'browser-sync'; // это live server
import rename from "gulp-rename"; // переименовывает файлы (мы исп. для добавления суффиксов min для css)
import { deleteAsync as del } from "del"; // удаление файлов/папок и т.д.
import plumber from "gulp-plumber"; // обработка ошибок
import notify from "gulp-notify"; // подсказки-сообщения
import newer from "gulp-newer"; // проверка обновления файлов
import sourceMaps from "gulp-sourcemaps"; // показывает точный путь расположения стилей, скриптов и т.д. в инструменте разработчика
import fs from "fs"; // создаёт файл автогенерации шрифтов в css

//* HTML
import fileInclude from "gulp-file-include"; // обеспечивает модульность HTML
import htmlMin from "gulp-htmlmin"; // минифицирует HTML
import htmlWebpAvif from "./gulp/plugins/picture-html.cjs"; // заменяет тег img на тег pictures
//import typograf from "gulp-typograf"; // обеспечивает правильный перенос текстов
import prettier from "@bdchauvette/gulp-prettier"; // красиво формирует отступы в разметке

//* CSS
import * as dartSass from "sass"; // нужен для scss
import gulpSass from "gulp-sass"; // нужен для scss
const sass = gulpSass(dartSass); // нужен для scss
import autoprefixer from "gulp-autoprefixer"; // создаёт вендерные префиксы для поддержки в разных браузерах (-webkit / -moz / -ms)
import groupCssMedia from "gulp-group-css-media-queries"; // группирует медиазапросы в css
//import cssShorthand from "gulp-shorthand"; // сокращённое написание свойств (например объединяет font-family, font-size и font-weight в одно свойство font)
import cssClean from "gulp-clean-css"; // лучше минимизирует css
import avifCss from "gulp-avif-css"; // добавляет форматы avif и webp в стили для BG

//* JS
import webpack from "webpack-stream"; // позволяет использовать импорты и минимизировать JS (npm i -D webpack webpack-stream)
import babel from "gulp-babel"; // обеспечивает поддержку скриптов в старых браузерах (ещё дополнительно надо докачать через консоль npm i -D @babel/core @babel/preset-env)


//* FONTS
import fonter from "gulp-fonter-2"; // конвертирует шрифты во все необходимые форматы, кроме woff2
import ttf2woff2 from "gulp-ttf2woff2"; // конвертирует шрифты в формат woff2

//* IMAGES
import webp from "gulp-webp"; // конвертирует картинки в формат webp
import imageMin from "gulp-imagemin"; // минимизирует картинки
import avif from "gulp-avif"; // конвертирует картинки в формат avif

//* SVG
import cheerio from "gulp-cheerio"; // для svg-спрайтов
import replace from "gulp-replace"; // для svg-спрайтов
import svgSprite from "gulp-svg-sprite"; // для svg-спрайтов

//* Функция отслеживания и вывода ошибок (+ НЕ ОСТАНАВЛИВАЕТ сервер и наблюдателя)
function plumberNotify(title) {
	return plumber(
		notify.onError({
			title: title,
			message: "Error <%= error.message %>"
		})
	)
}

//! Создание задач
function clearDist() {
	return del(distFolder);
}

// эта функция делает по сути то же самое, что и следующая (copyFilesToDist), только немного другим путём
function copyToDist() {
	return src([
		`${srcFolder}/**/*.*`,
		`!${srcFolder}/**/*.html`,
		`!${srcFolder}/{fonts,images,js,scss,css}/*.*`
	])
		.pipe(dest(distFolder))
		.pipe(browserSync.stream());
}

// эта функция делает по сути то же самое, что и предыдущая (copyToDist), только немного другим путём
function copyFilesToDist() {
	return src(`${srcFolder}/files/**/*.*`)
		.pipe(dest(`${distFolder}/files`))
		.pipe(browserSync.stream());
}

function html() {
	return src([`${srcFolder}/html/*.html`])
		.pipe(plumberNotify('HTML'))
		.pipe(fileInclude())
		.pipe(
			replace(/<img(?:.|\n|\r)*?>/g, function (match) {
				return match.replace(/\r?\n|\r/g, '').replace(/\s{2,}/g, ' ');
			})
		) //удаляет лишние пробелы и переводы строк внутри тега <img>
		.pipe(
			replace(
				/(?<=src=|href=|srcset=)(['"])(\.(\.)?\/)*(img|images|fonts|css|scss|sass|js|files|audio|video)(\/[^\/'"]+(\/))?([^'"]*)\1/gi,
				'$1./$4$5$7$1'
			)
		) // удаляет лишние пути ../../
		//.pipe(typograf({
		//	locale: ['ru', 'en-US'],
		//	htmlEntity: { type: 'digit' },
		//	disableRule: ['common/punctuation/quote'],
		//	safeTags: [
		//		['<\\?php', '\\?>'],
		//		['<no-typography>', '</no-typography>'],
		//	]
		//}))
		.pipe(
			prettier({
				tabWidth: 4,
				useTabs: true,
				printWidth: 182,
				trailingComma: 'es5',
				bracketSpacing: false,
			})
		)
		.pipe(dest(distFolder))
		.pipe(browserSync.stream());
}

function htmlBuild() {
	return src([`${srcFolder}/html/*.html`])
		.pipe(plumberNotify('HTML BUILD'))
		.pipe(fileInclude())
		.pipe(
			replace(/<img(?:.|\n|\r)*?>/g, function (match) {
				return match.replace(/\r?\n|\r/g, '').replace(/\s{2,}/g, ' ');
			})
		) //удаляет лишние пробелы и переводы строк внутри тега <img>
		.pipe(
			replace(
				/(?<=src=|href=|srcset=)(['"])(\.(\.)?\/)*(img|images|fonts|css|scss|sass|js|files|audio|video)(\/[^\/'"]+(\/))?([^'"]*)\1/gi,
				'$1./$4$5$7$1'
			)
		) // удаляет лишние пути ../../
		//.pipe(typograf({
		//	locale: ['ru', 'en-US'],
		//	htmlEntity: { type: 'digit' },
		//	disableRule: ['common/punctuation/quote'],
		//	safeTags: [
		//		['<\\?php', '\\?>'],
		//		['<no-typography>', '</no-typography>'],
		//	]
		//}))
		.pipe(htmlWebpAvif({
			extensions: ['.png', '.jpg', '.jpeg'], // image file extensions for which we create 'picture'
			source: ['.avif', '.webp'], // create 'source' with these formats
			noPicture: ['no-picture'], // if we find this class for the 'img' tag, then we don't create a 'picture' (multiple classes can be set)
			noPictureDel: false // if 'true' remove classes for 'img' tag given in 'noSource:[]'
		}))
		.pipe(htmlMin({
			collapseWhitespace: true,
		}))
		.pipe(dest(distFolder));
}

function css() {
	return src(`${srcFolder}/scss/**/*.{css,scss,sass}`)
		.pipe(sourceMaps.init())
		.pipe(plumberNotify('SCSS'))
		.pipe(sass())
		.pipe(
			replace(
				/(['"]?)(\.\.\/)+(img|images|fonts|css|scss|sass|js|files|audio|video)(\/[^\/'"]+(\/))?([^'"]*)\1/gi,
				'$1$2$3$4$6$1'
			)
		) // удаляет лишние пути ../../
		.pipe(groupCssMedia())
		.pipe(autoprefixer({
			grid: true,
			overrideBrowserlist: ["last 5 versions"],
			cascade: true,
		}))
		.pipe(rename({ extname: '.min.css' }))
		.pipe(sourceMaps.write())
		.pipe(dest(`${distFolder}/css`))
		.pipe(browserSync.stream());
}

function cssBuild() {
	return src(`${srcFolder}/scss/**/*.{css,scss,sass}`)
		.pipe(plumberNotify('SCSS BUILD'))
		.pipe(sass())
		.pipe(
			replace(
				/(['"]?)(\.\.\/)+(img|images|fonts|css|scss|sass|js|files|audio|video)(\/[^\/'"]+(\/))?([^'"]*)\1/gi,
				'$1$2$3$4$6$1'
			)
		) // удаляет лишние пути ../../
		.pipe(groupCssMedia())
		.pipe(avifCss())
		.pipe(autoprefixer({
			grid: true,
			overrideBrowserlist: ["last 5 versions"],
			cascade: true,
		}))
		.pipe(
			prettier({
				tabWidth: 4,
				useTabs: true,
				printWidth: 182,
				trailingComma: 'es5',
				bracketSpacing: false,
			})
		)
		.pipe(dest(`${distFolder}/css`))
		//! для минифицированной версии css
		.pipe(src(`${srcFolder}/scss/**/*.{css,scss,sass}`))
		.pipe(plumberNotify('min SCSS BUILD'))
		.pipe(sass({ outputStyle: 'compressed' }))
		.pipe(groupCssMedia())
		//.pipe(cssShorthand())
		.pipe(avifCss())
		.pipe(autoprefixer({
			grid: true,
			overrideBrowserlist: ["last 5 versions"],
			cascade: true,
		}))

		.pipe(cssClean({
			compatibility: {
				properties: {
					zeroUnits: false // controls removal of units `0` value https://github.com/clean-css/clean-css#how-to-use-clean-css-api
				}
			},
			level: 1,
		}))
		.pipe(rename({ extname: '.min.css' }))
		.pipe(dest(`${distFolder}/css`))
}

function js() {
	return src(`${srcFolder}/js/**/*.js`)
		.pipe(sourceMaps.init())
		.pipe(plumberNotify('JS'))
		.pipe(babel()) // настройки в package.json
		.pipe(webpack({
			mode: 'development', // 'production' минифицирует JS, а 'development' - нет
			output: {
				filename: 'main.min.js',
			},
			module: {
				rules: [
					{
						test: /\.css$/,
						use: ['style-loader', 'css-loader'],
					}
				]
			}
		}))
		.pipe(sourceMaps.write())
		.pipe(dest(`${distFolder}/js`))
		.pipe(browserSync.stream());
}

function jsBuild() {
	return src(`${srcFolder}/js/**/*.js`)
		.pipe(plumberNotify('JS BUILD'))
		.pipe(babel())// настройки в package.json
		.pipe(webpack({
			mode: 'production', // 'production' минифицирует JS, а 'development' - нет
			output: {
				filename: 'main.min.js',
			},
			module: {
				rules: [
					{
						test: /\.css$/,
						use: ['style-loader', 'css-loader'],
					}
				]
			}
		}))
		.pipe(dest(`${distFolder}/js`))
}

function copyFonts() {
	return src(`${srcFolder}/fonts/**/*.{eot,ttf,otf,otc,ttc,woff,woff2,svg}`)
		.pipe(newer(`${distFolder}/fonts`)) // тут он не особо нужен, но пусть стоит на всякий пожарный
		.pipe(dest(`${distFolder}/fonts`));
}

function fontsBuild() {
	return src(`${srcFolder}/fonts/**/*.{eot,ttf,otf,otc,ttc,woff,woff2,svg}`)
		.pipe(plumberNotify('FONTS'))
		.pipe(newer(`${distFolder}/fonts`)) // тут он нужен
		.pipe(fonter({
			formats: ['ttf', 'woff', 'eot']
		}))
		.pipe(dest(`${distFolder}/fonts`))
		.pipe(ttf2woff2())
		.pipe(dest(`${distFolder}/fonts`));
}

// Функция, чтобы два раза не повторяться при создании шрифтов в папке и без папки
const createFontFile = (fontsFile, fontFileName, fontPath, cb) => {

	let fontName = fontFileName.split('-')[0]
		? fontFileName.split('-')[0]
		: fontFileName;
	// заметил, что если у шрифта в названии есть italiс, bold и т.д. то стили генерирются неккоретно, теперь будет сравниваться только название второй части название шрифты через тире (Blackcraft-BlackItalic.ttf)
	let fontNameOtherPart = fontFileName.split('-')[1]
		? fontFileName.split('-')[1]
		: 'regular normal';

	let fontWeight = 400; // по-умолчанию
	let fontStyle = 'normal'; // по-умолчанию

	// если шрифт вариативный
	let isFontVariable = fontFileName.toLowerCase().includes('variablefont') || fontFileName.toLowerCase().includes('vf');

	// проверка на начертания
	if (fontNameOtherPart.toLowerCase().includes('thin')) {
		fontWeight = 100;
	} else if (fontNameOtherPart.toLowerCase().includes('extralight')) {
		fontWeight = 200;
	} else if (fontNameOtherPart.toLowerCase().includes('light')) {
		fontWeight = 300;
	} else if (fontNameOtherPart.toLowerCase().includes('medium')) {
		fontWeight = 500;
	} else if (fontNameOtherPart.toLowerCase().includes('semibold')) {
		fontWeight = 600;
	} else if (fontNameOtherPart.toLowerCase().includes('bold') && !fontNameOtherPart.toLowerCase().includes('extrabold')) {
		fontWeight = 700;
	} else if (
		fontNameOtherPart.toLowerCase().includes('extrabold') ||
		fontNameOtherPart.toLowerCase().includes('heavy')
	) {
		fontWeight = 800;
	} else if (fontNameOtherPart.toLowerCase().includes('black')) {
		fontWeight = 900;
	}

	// проверка на стиль
	if (fontNameOtherPart.toLowerCase().includes('italic')) {
		fontStyle = 'italic'
	} else if (fontNameOtherPart.toLowerCase().includes('oblique')) {
		fontStyle = 'oblique';
	}


	let cssProperty = `@font-face {\n\tfont-family: ${fontName};\n\tfont-display: swap;\n\tsrc: url("../fonts/${fontPath}.eot");\n\tsrc: url("../fonts/${fontPath}.eot?#iefix") format("embedded-opentype"), url("../fonts/${fontPath}.woff2") format("woff2"), url("../fonts/${fontPath}.woff") format("woff"), url("../fonts/${fontPath}.ttf") format("truetype");\n\tfont-weight: ${fontWeight};\n\tfont-style: ${fontStyle};\n}\r\n`;

	if (isFontVariable) {
		// если шрифт вариативный то добавляет к названию суффикс "-VF" + к формату добавляется суффикс "-variations" + убирается font-weight и font-style
		cssProperty = `@font-face {\n\tfont-family: ${fontName}-VF;\n\tfont-display: swap;\n\tsrc: url("../fonts/${fontPath}.eot");\n\tsrc: url("../fonts/${fontPath}.eot?#iefix") format("embedded-opentype-variations"), url("../fonts/${fontPath}.woff2") format("woff2-variations"), url("../fonts/${fontPath}.woff") format("woff-variations"), url("../fonts/${fontPath}.ttf") format("truetype-variations");\n}\r\n`;

	}

	fs.appendFile(
		fontsFile,
		cssProperty,
		cb
	);
}

const fontsStyle = () => {
	// Файл стилей подключения шрифтов
	let fontsFile = `${srcFolder}/scss/base/_fontsAutoGen.scss`;
	// Проверяем существуют ли файлы шрифтов
	fs.readdir(`${srcFolder}/fonts/`, function (err, fontsFiles) {
		if (fontsFiles) {
			// Проверяем существует ли файл стилей для подключения шрифтов
			// Если файла нет, создаем его
			fs.writeFile(fontsFile, '', cb);
			let newFileOnly;

			for (let i = 0; i < fontsFiles.length; i++) {
				// Записываем подключения шрифтов в файл стилей
				let fontFileName = fontsFiles[i].split('.')[0];

				// папка или файл есть и не начинается с точки (был баг с .DS_Store)
				if (fontFileName) {
					// Проверка на то, это файл или папка
					let folder = !fontsFiles[i].includes('.') ? fontsFiles[i] : false;
					// Для названия пути
					let fontPath = fontFileName;

					// Если нет вложенных папок
					if (!folder) {
						if (newFileOnly !== fontFileName) {
							createFontFile(fontsFile, fontFileName, fontPath, cb);
							newFileOnly = fontFileName;
						}
					}
					// Если вложенные папки есть то, заходим в папку и находим все файлы в ней
					if (folder) {
						fs.readdir(`${srcFolder}/fonts/${fontPath}`, function (err, fontsFiles) {
							if (fontsFiles) {
								let newFileOnly;

								for (let i = 0; i < fontsFiles.length; i++) {
									// Записываем подключения шрифтов в файл стилей
									let fontFileName = fontsFiles[i].split('.')[0];

									// папка или файл есть и не начинается с точки (был баг с .DS_Store)
									if (fontFileName) {
										fontPath = folder + '/' + fontFileName;

										if (newFileOnly !== fontFileName) {
											createFontFile(fontsFile, fontFileName, fontPath, cb);
											newFileOnly = fontFileName;
										}
									}
								}
							}
						})
					}
				}

			}

		}
	});

	return src(srcFolder);
	function cb() { }
};

function avifImg() {
	return src(`${srcFolder}/images/**/*.{jpg,jpeg,png,gif}`)
		.pipe(plumberNotify('AVIF'))
		.pipe(avif({
			quality: 80,
		}))
		.pipe(dest(`${distFolder}/images`));
}

function webpImg() {
	return src(`${srcFolder}/images/**/*.{jpg,jpeg,png,gif,ico}`)
		.pipe(plumberNotify('WEBP'))
		.pipe(webp())
		.pipe(dest(`${distFolder}/images`));
}

function imgMin() {
	return src(`${srcFolder}/images/**/*.{jpg,jpeg,png,gif,webp,ico,svg}`)
		.pipe(plumberNotify('IMG MIN'))
		.pipe(imageMin({
			progressive: true,
			svgoPlugins: [{ removeViewBox: false }],
			interlaced: true,
			optimizationLevel: 5, // 0 до 7
			verbose: true,
		}))
		.pipe(dest(`${distFolder}/images`));
}

function copyImg() {
	return src(`${srcFolder}/images/**/*.{jpg,jpeg,png,gif,webp,ico,avif,svg}`)
		.pipe(newer(`${distFolder}/images`))
		.pipe(dest(`${distFolder}/images`))
		.pipe(browserSync.stream());
}

function svgToSprite() {
	return src(`${srcFolder}/images/**/*.svg`)
		.pipe(plumberNotify('SPRITE'))
		.pipe(newer(`${distFolder}/images/**/*.svg`))
		.pipe(imageMin({
			progressive: true,
			svgoPlugins: [{ removeViewBox: false }],
			interlaced: true,
			optimizationLevel: 5, // 0 до 7
			verbose: true,
		}))
		.pipe(cheerio({
			run: function ($) {
				$('[fill]').removeAttr('fill');
				$('[stroke]').removeAttr('stroke');
				$('[style]').removeAttr('style');
			},
			parserOptions: {
				xmlMode: true
			},
		}))
		.pipe(replace('&gt;', '>'))
		.pipe(svgSprite({
			mode: {
				stack: {
					sprite: "../sprite.svg"
				}
			},
		}))
		.pipe(dest(`${distFolder}/images/icons`))
		.pipe(browserSync.stream());
}

function liveServer() {
	return browserSync.init({
		server: {
			baseDir: distFolder
		}
	})
}

//* Слежение за задачами
function watcher() {
	watch(`${srcFolder}/files/**/*.*`, copyFilesToDist);
	watch(`${srcFolder}/**/*.{html,json}`, html);
	watch(`${srcFolder}/scss/**/*.{css,scss,sass}`, css);
	watch(`${srcFolder}/js/**/*.js`, js);
	watch(`${srcFolder}/fonts/**/*.{eot,ttf,otf,otc,ttc,woff,woff2,svg}`, copyFonts);
	watch(`${srcFolder}/fonts/**/*.{eot,ttf,otf,otc,ttc,woff,woff2,svg}`, fontsStyle);
	watch(`${srcFolder}/images/**/*.{jpg,jpeg,png,gif,webp,ico,avif,svg}`, copyImg);
	watch(`${srcFolder}/images/**/*.svg`, svgToSprite);
}

function watcherBuild() {
	watch(`${srcFolder}/files/**/*.*`, copyFilesToDist);
	watch(`${srcFolder}/**/*.{html,json}`, htmlBuild).on("change", browserSync.reload);
	watch(`${srcFolder}/scss/**/*.{css,scss,sass}`, cssBuild);
	watch(`${srcFolder}/js/**/*.js`, jsBuild);
	watch(`${srcFolder}/fonts/**/*.{eot,ttf,otf,otc,ttc,woff,woff2,svg}`, fontsBuild);
	watch(`${srcFolder}/fonts/**/*.{eot,ttf,otf,otc,ttc,woff,woff2,svg}`, fontsStyle);
	watch(`${srcFolder}/images/**/*.{jpg,jpeg,png,gif,webp,ico,avif,svg}`, img);
	watch(`${srcFolder}/images/**/*.svg`, svgToSprite);
}

//! Запуск задач
export { clearDist, copyToDist, copyFilesToDist, html, htmlBuild, css, cssBuild, js, jsBuild, copyFonts, fontsStyle, fontsBuild, avifImg, webpImg, imgMin, copyImg, svgToSprite, watcher, watcherBuild, liveServer };

//* Запуск сборника задач
export const img = series(
	avifImg,
	webpImg,
	imgMin
)

export const start = series(
	clearDist,
	copyFilesToDist,
	html,
	css,
	js,
	copyFonts,
	fontsStyle,
	copyImg,
	svgToSprite,
	parallel(
		watcher,
		liveServer
	)
)

export const build = series(
	clearDist,
	copyFilesToDist,
	htmlBuild,
	cssBuild,
	jsBuild,
	fontsBuild,
	fontsStyle,
	img,
	svgToSprite
)

export const buildFix = series(
	build,
	parallel(
		watcherBuild,
		liveServer
	)
)

export default start;