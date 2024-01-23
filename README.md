# Eleventy Starter

[![EditorConfig](../../actions/workflows/editorconfig.yml/badge.svg)](../../actions/workflows/editorconfig.yml) [![HTML](../../actions/workflows/html.yml/badge.svg)](../../actions/workflows/html.yml) [![CSS](../../actions/workflows/css.yml/badge.svg)](../../actions/workflows/css.yml) [![JavaScript](../../actions/workflows/javascript.yml/badge.svg)](../../actions/workflows/javascript.yml)

**Шаблон проекта для быстрого старта.  
Работает на Node 18+**

## Старт проекта

#### 1. Установить зависимости:

```
npm install
```

#### 2. Запустить dev-сервер для разработки:

```
npm start
```

#### 3. Открыть следующий URL - [`http://localhost:8080/`](http://localhost:8080/).

## Команды

#### Запустить проект для разработки:

```
npm start
```

#### Проверить линтерами CSS и JS код:

```
npm run test
```

#### Собрать проект для продакшена:

```
npm run build
```

#### Создание архива `build-production.zip` для продакшена:

```
npm run zip
```

## Структура проекта

Не обязательно разделять интерфейс на отдельные части и компоненты, но это эффективный подход по многим причинам.

Создавайте компоненты по крайней мере для тех частей интерфейса, которые появляются в нескольких местах вашего проекта. Это могут быть кнопки, инпуты, общие разделы страницы, виджеты, слайдеры и так далее.

Этот стартер позволяет хранить разметку, стили и код JavaScript для компонента в одной папке, а затем использовать их в нескольких местах. Пожалуйста, посмотрите примеры в папке `src/includes/`.

Необходимо отличать простые компоненты от макро-компонентов, которые могут принимать параметры (props).

Так называемые инклуды или простые компоненты рекомендуется хранить в папке `src/includes/`. Так блок `intro` из папки `includes` можно добавить в шаблон страницы:

```njk
{% include "intro/intro.njk" %}
```

Компоненты, которые могут принимать параметры, рекомендуется хранить в папке `src/components/`.

Пример макро-компонента `icon`:

```njk
<svg
	{% if props.className %}class="{{ props.className }}"{% endif %}
	{% if props.attr %} {{ props.attr | safe }}{% endif %}>
	<use xlink:href="/assets/svg/sprite.svg#icon-{{ props.iconName }}" />
</svg>
```

Импорт компонентов в шаблоны реализован через импорт глобального макро-компонента (`src/components/system`) в шаблоне `base.njk`. Благодаря этому, все остальные компоненты можно импортировать и использовать в нескольких местах следующим образом:

```njk
{{ component('icon', {
	iconName: 'arrow-right',
	attr: 'width="50" height="50"'
}) }}
```

## HTML-шаблонизатор Nunjucks

[Nunjucks](https://mozilla.github.io/nunjucks/) - мощный шаблонизатор с синтаксисом а-ля jinja2, который позволяет создавать качественный, легкоподдерживаемый HTML-код.

Nunjucks-шаблоны находятся в `src/templates/`.  
Шаблоны страниц, которые должны быть скомпилированы в html, кладём в папку `src/pages/`

Для эффективного применения шаблонизатора см. примеры в стартовом проекте, а также [документацию](https://mozilla.github.io/nunjucks/templating.html).

## Генератор статических сайтов [Eleventy](https://github.com/11ty/eleventy)

Данные, которые могут быть использованы в разных шаблонах, следует складывать в файл `src/data/site.yml`. Данные для конкретной страницы кладём рядом с шаблоном страницы:

```
index.njk
index.yml

contacts.njk
contacts.yml
```

После этого к ним можно обращаться в шаблонах:

```njk
<h1>{{ title }}</h1>
<p>Tel: {{ tel }}</p>
<p>Site name: {{ site.title }}</p>
```

Для эффективного применения Eleventy см. примеры в стартовом проекте, а также [документацию](https://www.11ty.dev/docs/).

## Структура SCSS-файлов

В Стартере существует следующая структура SCSS-файлов:

```
/styles/
	/lib/				// Библиотеки и миксины
	/pages/				// Стили для страниц проекта
		_main.scss		// Стили для главной страницы
	_constants.scss			// Переменные и константы
	_fonts.scss			// Подключаемые шрифты
	_global.scss			// Стили глобальных блоков
	_layout.scss			// Стили лэйаута
	_reset.scss			// CSS-reset и сброс стилей по умолчанию
	index.scss			// Основной файл, который компилируется в index.css
```

Для каждой страницы, при необходимости, создается отдельный файл в папке `pages`. Все подключаемые файлы должны начинаться с одного подчеркивания (`_`).

Для каждого компонента создается отдельный файл:  
`src/components/<component_name>/<component_name>.scss`  
или  
`src/includes/<include_name>/<include_name>.scss`

## Responsive-картинки

Компонент **picture** (`src/components/picture`), использует плагин [eleventy-img](https://github.com/11ty/eleventy-img), чтобы генерировать оптимальные изображения в webp-формате для разных экранов.
Используемые ширины: 640, 960, 1280, 1920, 2560.

Компонент **picture** создаст HTML-элемент `<picture>`, добавит `<source>` для изображений в иходном формате, и в формате webp.
Пример использования:

```njk
{{ component('picture', {
	src: intro.img,
	className: 'intro__picture',
	classNameImg: 'intro__img'
}) }}
```

На выходе получаем:

```html
<picture class="intro__picture">
	<source
		type="image/webp"
		srcset="
			/assets/images/intro/jOTIqPxLI5-640.webp   640w,
			/assets/images/intro/jOTIqPxLI5-960.webp   960w,
			/assets/images/intro/jOTIqPxLI5-1280.webp 1280w,
			/assets/images/intro/jOTIqPxLI5-1920.webp 1920w
		"
		sizes="100vw"
	/>
	<source
		type="image/jpeg"
		srcset="
			/assets/images/intro/jOTIqPxLI5-640.jpeg   640w,
			/assets/images/intro/jOTIqPxLI5-960.jpeg   960w,
			/assets/images/intro/jOTIqPxLI5-1280.jpeg 1280w,
			/assets/images/intro/jOTIqPxLI5-1920.jpeg 1920w
		"
		sizes="100vw"
	/>
	<img
		class="intro__img"
		src="/assets/images/intro/jOTIqPxLI5-640.jpeg"
		width="1920"
		height="1281"
		alt=""
		loading="lazy"
		decoding="async"
	/>
</picture>
```

Также существует компонент **img** (`src/components/img`), который по аналогии с `picture` компонентом, генерирует изображения в webp-формате для разных экранов. Отличие в том, что этот компонент создает только `<img>` элемент изображение в одном формате. Формат изображения можно изменить указав его в props при вызове компонента, например: `format: 'jpeg'`

Пример использования:

```njk
{{ component('img', {
	src: intro.img,
	className: 'intro__img'
}) }}
```

На выходе получаем:

```html
<img
	class="intro__img"
	src="/assets/images/intro/jHlXKeTweS-640.webp"
	srcset="
		/assets/images/intro/jHlXKeTweS-640.webp   640w,
		/assets/images/intro/jHlXKeTweS-960.webp   960w,
		/assets/images/intro/jHlXKeTweS-1280.webp 1280w,
		/assets/images/intro/jHlXKeTweS-1920.webp 1920w
	"
	sizes="100vw"
	width="1920"
	height="1281"
	alt=""
	loading="lazy"
	decoding="async"
/>
```

**Обратите внимание, что плагин не генерирует изображение с размерами больше исходного**

## SVG-спрайты

В стартовом проекте настроена возможность создания SVG-спрайтов с помощью [eleventy-plugin-icons](https://github.com/uncenter/eleventy-plugin-icons), поэтому SVG-иконки на сайт лучше добавлять, используя компонент `icon`:

```njk
{{ component('icon', {
	iconName: 'arrow-right',
	className: 'icon',
	attr: 'width="50" height="50"'
}) }}
```

Свойства `className` и `attr` указывать необязательно. SVG-файл `some-vector-image.svg` должен находиться в папке `src/assets/svg/`. Такому элементу необходимо задать width и height в стилях. Ему также можно менять fill, stroke при условии, что в исходном файле `some-vector-image.svg` у элемента не заданы такие же атрибуты (fill и stroke).

**Обратите внимание на то, что при подключении svg-спрайта в компоненте `icon` используется `#icon-` префикс в пути до спрайта: `#icon-some-vector-image` (фактически будет использован `some-vector-image.svg`).**

## Инлайн картинок или SVG

Инлайн картинок или SVG можно использовать для мелких иконок на странице, но не для всей графики. Стоит помнить, что при инлайне размер файла графики увеличивается, т.к. он конвертируется в base64.

<b>Внимание!</b> Изображения, которые будут инлайниться, должны находится в директории `src/assets/images/inline`.

### В SCSS

Плагин postcss-assets позволяет инлайнить изображения прямо в код в Base64 кодировке (или в виде кода в случае с SVG):

```scss
background: inline("sp.png");
```

Так же позволяет подставить размеры картинки:

```scss
width: width("sp.png");
```

```scss
height: height("sp.png");
```

```scss
background-size: size("sp.png");
```

## Послезные ссылки

- [Синтаксис Nunjucks](https://mozilla.github.io/nunjucks/templating.html)
- [Документация Eleventy](https://www.11ty.dev/docs/)
