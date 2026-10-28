# Bootstrap Shop — Контрольная работа №2

Тема: «CSS-фреймворки: разработка интерфейса на Bootstrap или альтернативном CSS-фреймворке».

## Описание

Проект представляет собой учебную версию сайта интернет-магазина, разработанную
с использованием CSS-фреймворка **Bootstrap 5.3.8**.

## Используемый фреймворк

Bootstrap 5.3.8.

## Способ подключения

Bootstrap подключён через **CDN** (jsDelivr):

```html
<link
  href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.8/dist/css/bootstrap.min.css"
  rel="stylesheet"
/>
<script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.8/dist/js/bootstrap.bundle.min.js"></script>
```

Файл `css/custom.css` подключён после Bootstrap и содержит минимальные
дополнительные стили (высота плейсхолдеров и кадрирование изображений).

## Структура проекта

```
kr2-bootstrap-shop/
├── index.html          — главная страница
├── catalog.html        — каталог товаров
├── product.html        — карточка товара
├── order.html          — форма заявки
├── css/
│   └── custom.css      — дополнительные стили
├── README.md
└── .gitignore
```

## Реализованные Bootstrap-компоненты

- `navbar` — единая навигация с раскрывающимся меню и dropdown на всех страницах;
- `card` — карточки товаров на главной и в каталоге;
- `btn`, `btn-primary`, `btn-outline-primary`, `btn-secondary`, `btn-lg` — кнопки действий;
- `badge` — значки «Новинка», «Хит», «Скидка»;
- `alert` — информационные сообщения и предупреждения;
- `modal` — модальное окно быстрой заявки в каталоге;
- `form-control`, `form-select`, `input-group`, `form-check` — поля формы заявки;
- `accordion` — блок «Частые вопросы» на странице товара;
- `breadcrumb` — хлебные крошки на странице товара;
- `table`, `table-striped`, `table-bordered` — таблица характеристик;
- сетка `container`, `row`, `col-12`, `col-md-6`, `col-lg-4`, `col-lg-6`, `g-3`, `g-4`.

## Практическая работа 10

Тема: «Страница на Bootstrap: компоненты».

Выполнено:

- добавлена единая Bootstrap-навигация на все страницы;
- создана страница каталога `catalog.html`;
- создана страница товара `product.html`;
- создана страница заявки `order.html`;
- использованы компоненты `navbar`, `card`, `btn`, `badge`, `alert`, `modal`,
  `form-control`, `input-group`, `form-select`, `form-check`, `accordion`;
- добавлен файл `css/custom.css` для минимальных доработок;
- проект подготовлен к сдаче контрольной работы №2.

## Ссылка на опубликованную версию

GitHub Pages: https://sdankov37.github.io/kr2-bootstrap-shop/

## Автор

ФИО: Данков Степан Андреевич
Группа: ЭФБО-14-25
