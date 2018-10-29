[![Build Status](https://travis-ci.com/mjstahl/boring.svg?branch=master)](https://travis-ci.com/mjstahl/boring)

# boring
Templating using JavaScript's tagged template strings. Designed for server-side
rendering.

**There is no magic in this library. This is just JavaScript. This library is boring and that
is just the way we like it.**

## Installation
```sh
$ npm install --save @mjstahl/boring
```

```js
const { render, renderFile } = require('@mjstahl/boring')
```

## External API
`render(template: String[, values: Object][, callback: Function]) -> Promise | undefined`

Render the template string. If JavaScript expressions exist within the template,
those expressions will be evaluated with regards to the provided `values`. If `callback` is specified, `render` will return `undefined` and `callback` will be evaluated with the 0th argument set to any error or the 1st argument set to a result. If `callback` is not specific the function will return a `Promise`.

`renderFile(path: String[, values: Object][, callback: Function]) -> Promise | undefined`

Render the template located at `path`. If JavaScript expressions
exist within the template, those expressions will be evaluated with regards to
the provided `values`. If `callback` is specified, `renderFile` will return `undefined` and `callback` will be evaluated with the 0th argument set to any error or the 1st argument set to a result. If `callback` is not specific the function will return a `Promise`.

## Template API
`include(file: String[, values: Object]) -> Promise`

Evaluate a template file located relative to the current template. If JavaScript
expressions exist within the template, those expressions will be evaluated with
regards to the provided `values`.

`raw(html: String) -> Object`

Use `raw` in a template where the expression is expected to return HTML. You
do not want to escape HTML twice.

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

await render('<p>High ${howMany}!</p>', {
  howMany: 5
})

/**
<p>High 5!</p
 */
```

### Spread Attributes
```js
const { render } = require('@mjstahl/boring')

const props = { class: 'abc', id: 'def' }
await render('<div ${props}>Hello</div>', { props })

/**
<div class="abc" id="def">Hello</div>
 */
```

### Boolean Attributes
```js
const { render } = require('@mjstahl/boring')

await render('<input disabled=${disabled} autofocus=${focus} />', {
  disabled: true,
  focus: false
})

/**
<input disabled="disabled" >
 */
```

### List Rendering
Boring will join list items with `''`. So if you want pretty DOM, you have to
handle the whitespace in your template.

```js
<!-- views/states.html -->
<select>
  ${Object.keys(states).map((s) => {
    return `<option value="${s}">${states[s]}</option>`
  })}
</select>
```

```js
const { renderFile } = require('@mjstahl/boring')

const states = { AL: 'Alabama', GA: 'Georgia' }
await renderFile('views/states.html', { states })

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
const { render } = require('@mjstahl/boring')

await render('<body>${raw(header)}</body>', {
  header: '<h1>This a regular string</h1>'
})

/**
<body>
  <h1>This is a regular string</h1>
</body>
 */
```

### Modularizing Templates
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

await renderFile('views/index.html', {
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

## Used By
* [DigiNews DFW](https://diginewsdfw.com/)


## Attribution

Boring was made possible by the work previously done by the [choojs/nanohtml](https://github.com/choojs/nanohtml) contributors.
