# Seelect

Yet another select component

## Getting Started

1. Download zip or clone this repo.
2. Make sure you got latest nodejs (v6.9+) and npm (v4+) installed.
3. Go to the project folder and execute initially:

```
npm install
```
to download all depedencies 

```
npm start
```
to run local webpack dev server for the project. It is con figured at localhost port 80.

4. If you need to bundle it, run

```
npm run bundle
```

## About (RUS)

Данная библиотека реализует select/multiselect-компонент. 
Реализован автокомплит без учета раскаладки и с поддержкой транслитерации. 
Возможно использование серверного поиска. 

Для инициализации используются стандартные html-элементы select и data-атрибуты.
Возможно инциализтвать компонент без data-атрибутов через json-config.

В примере осуществляется поиск по предопределенным данным, в случае не нахождения результатов, фильтрация списка либо не учитывается, либо отправляется запрос на сервер.

## API

### Config

You can use both JSON in your javascript and data-attributes in HTML markup to init component.
JSON config is prior.

JSON                | data attribute            |                           | isRequried  | Default value
------------------- | ------------------------- | ------------------------- | ----------- | --------------
el                  |                           | element                   | true        |
unique              |                           | unique token              | false       | Date.now()
debug               | data-debug                | display debug             | false       | false
isMultiselect       | multiselect               | enable multiselect        | false       | false
disableAutocomplete | data-disable-autocomplete | disable autocomplete      | false       | false
useIcons            | data-use-icons            | use icons                 | false       | false
onNotFound          |                           | fn(select, timestamp)     | false       |
