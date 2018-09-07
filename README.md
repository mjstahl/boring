# boring
Templating using JavaScript's tagged template strings. Designed for server-side
rendering.

## Installation
```sh
$ npm install --save @mjstahl/boring
```

## Express 3.x
After installing the `boring` package, we set the location of the views and
the engine Express will use to render those views.

```js
  const boring = require('@mjstahl/boring')

  app.engine('html', boring);
  app.set('view engine', 'html');
  app.set('views', __dirname + '/views');
```

Next create a file named `index.html` in the `./views` directory with the following
content:

```js
<html>
  <head>
    <title>${title}</title>
  </head>
  <body>
    <p>${raw(message)}</p>
  </body>
</html>
```

Now we can configure a route that will render the `index.html` file.

```js
  app.get('/', (req, res) => {
    res.render('index', {
      title: 'Your first boring template',
      message: '<strong>Looking good!</strong>'
    })
  })
```

## Usage
```js
const { render } = require('@mjstahl/boring')

const template = '<p>High ${howMany}!</p>'
const result = render(template, {
  howMany: 5
})

result //-> '<p>High 5!</p>'
```

```js
const { html } = require('@mjstahl/boring')

const button = html`
  <button>click</button>
`
const result = html`
  <div class="testing">
    ${button}
  </div>
`.toString()

result //-> '<div class="testing"><button>click</button></div>'
```

### Spread Attributes
```js
const { html } = require('@mjstahl/boring')

const props = { class: 'abc', id: 'def' }
const result = html`
  <div ${props}>Hello</div>
`.toString()

result //-> '<div class="abc" id="def">Hello</div>'
```

### Boolean Attributes
```js
const { html } = require('@mjstahl/boring')

const result = html`
  <input disabled=${true} autofocus=${false}>
`.toString()

result //-> '<input disabled="disabled" >'
```

### Escaped HTML
By default all content inside template strings is escaped. This is great for
strings, but not ideal if you want to insert HTML that's been returned from
another function (for example: a markdown renderer). Use `boring/raw` for to
interpolate HTML directly.

```js
const { html, raw } = require('@mjstahl/boring')

const header = '<h1>This a regular string</h1>'
const result = html`
  <body>
    ${raw(header)}
  </body>
`.toString()

result //-> <body><h1>This is a regular string</h1></body>
```

## Attribution

Boring was made possible by the work previously done by the [choojs/nanohtml](https://github.com/choojs/nanohtml) contributors.