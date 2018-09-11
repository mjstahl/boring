# boring
Templating using JavaScript's tagged template strings. Designed for server-side
rendering.

**There is no magic in this library. This is just JavaScript. You
should be productive and not learn anything new. This library is boring and that
is just the way we like it.**

## Installation
```sh
$ npm install --save @mjstahl/boring
```

```js
const { html, raw, render, renderFile } = require('@mjstahl/boring')
```

## External API
`render(template: String[, values: Object]) -> Promise`

Render the template and return the String result. If JavaScript expressions
exist within the template, those expressions will be evaluated with regards to
the provided `values`.

`renderFile(path: String[, values: Object][, callback: Function]) -> Promise`

Render the template located at `path`. If JavaScript expressions
exist within the template, those expressions will be evaluated with regards to
the provided `values`. If `callback` is specified the function will be called
with the 0th argument set to any error or the 1st argument set to a result. If
`callback` is not specific the function will return a `Promise`.

```html`template: TemplateLiteral` -> Object```

A tag function the evaluates and escapes the provided template literal. Just
like all template literals, it will error out if any expressions reference
variables not within the current scope. The Object returned is a string with
extra properties, `.toString` the result for the least amount of surprises.

## Template API
`include(file: String[, values: Object]) -> Promise` **(NOT SUPPORTED, Expected in v2.2)**

Evaluate a template file located relative to the current template. If JavaScript
expressions exist within the template, those expressions will be evaluated with
regards to the provided `values`.

`raw(html: String) -> Object`

Use `raw` in a template where the expression is expected to return HTML. You
do not want to escape HTML twice. If used within a function (not in a template),
`.toString` the result for the least amount of surprises.

## Express 3.x
After installing the `boring` package, we set the location of the views and
the engine Express will use to render those views.

```js
const boring = require('@mjstahl/boring')

app.engine('html', boring.renderFile);
app.set('view engine', 'html');
app.set('views', __dirname + '/views');
```

Next create a file named `index.html` in the `./views` directory with the
following content:

```html
<html>
<head>
  <title>${title}</title>
</head>
<body>
  <h1>${message}</h1>
</body>
</html>
```

Now we can configure a route that will render the `index.html` file.

```js
app.get('/', (req, res) => {
  res.render('index', {
    title: 'Your first boring template',
    message: 'Looking good!'
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

/**
<p>High 5!</p
 */
```

```js
const { html, raw } = require('@mjstahl/boring')

const button = html`
  <button>click</button>
`
const result = html`
  <div class="testing">
    ${button}
  </div>
`.toString()

/**
<div class="testing">
  <button>click</button>
</div>
 */
```

### Spread Attributes
```js
const { html } = require('@mjstahl/boring')

const props = { class: 'abc', id: 'def' }
const result = html`
  <div ${props}>Hello</div>
`.toString()

/**
<div class="abc" id="def">Hello</div>
 */
```

### Boolean Attributes
```js
const { html } = require('@mjstahl/boring')

const result = html`
  <input disabled=${true} autofocus=${false}>
`.toString()

/**
<input disabled="disabled" >
 */
```

### List Rendering
Boring will join list items with `''`. So if you want pretty DOM, you have to
handle the whitespace in your template.

```js
const { html } = require('@mjstahl/boring')

const states = { AL: 'Alabama', GA: 'Georgia' }
const result = html`
  <select>
    ${Object.keys(states).map((s) => {
      return `<option value="${s}">${states[s]}</option>`
    })}
  </select>
`.toString()

/**
<select>
  <option value="AL">Alabama</option><option value="GA">Georgia</option>
</select>
 */
```

### Escaped HTML
By default all content inside template strings is escaped. This is great for
strings, but not ideal if you want to insert HTML that's been returned from
another function (for example: a markdown renderer). Use `boring/raw` for
interpolating HTML directly.

```js
const { html, raw } = require('@mjstahl/boring')

const header = '<h1>This a regular string</h1>'
const result = html`
  <body>
    ${raw(header)}
  </body>
`.toString()

/**
<body>
  <h1>This is a regular string</h1>
</body>
 */
```

### Modularizing Templates (NOT SUPPORTED, Expected in v2.2)
Let's assume we have a `views` directory that contained three files: `index.html`
`header.html`, and `footer.html`. The contents of each file are as follows:

```html
<!-- views/index.html -->
<html>
<head>
  <title>${title}</title>
</head>
<body>
  ${include('header.html', header)}
  <p>This is the body.</p>
  ${include('footer.html', footer)}
</body>
</html>
```

```html
<!-- views/header.html -->
<header>
  <h1>${title}</h1>
</header>
```

```html
<!-- views/footer.html -->
<footer>
  <p>${year} &copy; ${company}</p>
</footer>
```

Now we can then render the top-level template passing in values for it and all
of its child templates.

```js
const { renderFile } = require('@mjstahl/boring')

const result = renderFile('views/index.html', {
  title: 'Hello Boring!',
  header: { title: 'Woohoo Modularity!' },
  footer: {
    company: 'Nobody Important',
    year: 2018
  }
})

/**
<html>
<head>
  <title>Hello Boring!</title>
</head>
<body>
  <header>
    <h1>Woohoo Modularity!</h1>
  </header>
  <p>This is the body.</p>
  <footer>
    <p>2018 &copy; Nobody Important</p>
  </footer>
</body>
</html>
*/
```


## Attribution

Boring was made possible by the work previously done by the [choojs/nanohtml](https://github.com/choojs/nanohtml) contributors.
