# boring
Templating using JavaScript's tagged template strings. Designed for server-side
rendering.

**This work is only possible because of those who have contributed to [choojs/nanohtml](https://github.com/choojs/nanohtml) (it is effectively a copy of the server portion)**.

## Installation
```sh
$ npm install --save @mjstahl/boring
```

## Usage
```js
const html = require('boring');

const button = html`
  <button>click</button>
`;
const toRender = html`
  <div class="testing">
    ${button}
  </div>
`;

toRender //-> '<div class="testing"><button>click</button></div>'
```

### Spread Attributes
```js
const html = require('boring');

const props = { class: 'abc', id: 'def' };
const toRender = html`
  <div ${props}>Hello</div>
`;

toRender //-> '<div class="abc" id="def">Hello</div>'
```

### Escaped HTML
By default all content inside template strings is escaped. This is great for
strings, but not ideal if you want to insert HTML that's been returned from
another function (for example: a markdown renderer). Use `boring/raw` for to
interpolate HTML directly.

```js
const html = require('boring');
const raw = require('boring/raw');

const header = '<h1>This a regular string</h1>';
const toRender = html`
  <body>
    ${raw(string)}
  </body>
`;

toRender //-> <body><h1>This is a regular string</h1></body>
```