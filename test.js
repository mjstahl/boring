/* eslint-disable no-template-curly-in-string */

'use strict'

const path = require('path')
const test = require('ava')
const { renderFile } = require('./index')
const { html, raw, render } = require('./render')

test('server side render', t => {
  t.plan(2)
  const rendered = html`
    <div class="testing">
      <h1>hello!</h1>
    </div>
  `
  t.true(rendered.includes('<h1>hello!</h1>'), 'contains a child element')
  t.true(rendered.includes('<div class="testing">'), 'attribute gets set')
})

test('passing another element to html on server side render', t => {
  t.plan(1)
  const button = html`<button>click</button>`
  const rendered = html`
    <div class="testing">
      ${button}
    </div>
  `
  t.true(rendered.includes('<button>click</button>'), 'button rendered correctly')
})

test('style attribute', t => {
  t.plan(1)
  const expected = `
    <h1 style="color: red">
      Hey TEST, <span style="color: blue">This</span> is a card!!!
    </h1>
  `
  const name = 'test'
  const result = html`
    <h1 style="color: red">
      Hey ${name.toUpperCase()}, <span style="color: blue">This</span> is a card!!!
    </h1>
  `.toString()
  t.is(expected, result)
})

test('unescape html', t => {
  t.plan(1)
  const expected = '<span>Hello <strong>there</strong></span>'
  const result = raw('<span>Hello <strong>there</strong></span>').toString()
  t.is(expected, result)
})

test('unescape html inside html', t => {
  t.plan(1)
  const expected = '<span>Hello <strong>there</strong></span>'
  const result = html`${raw('<span>Hello <strong>there</strong></span>')}`.toString()
  t.is(expected, result)
})

test('event attribute', t => {
  t.plan(1)
  function onmouseover () {}
  function onmouseout () {}
  const expected = `
    <div onmouseover="" onmouseout="">
      Hello
    </div>
  `
  const result = html`
    <div onmouseover="${onmouseover}" onmouseout=${onmouseout}>
      Hello
    </div>
  `.toString()
  t.is(expected, result)
})

test('boolean attribute', t => {
  t.plan(1)
  const expected = '<input disabled="disabled" >'
  const result = html`<input disabled=${true} autofocus=${false}>`.toString()
  t.is(expected, result)
})

test('spread attributes', t => {
  t.plan(1)
  const props = { class: 'abc', id: 'def' }
  const expected = '<div class="abc" id="def">Hello</div>'
  const result = html`<div ${props}>Hello</div>`.toString()
  t.is(expected, result)
})

test('render HTML only', async t => {
  t.plan(1)
  const expected = '<p>Hello World</p>'
  const result = await render(expected)
  t.is(expected, result)
})

test('evaluate JS expressions', async t => {
  t.plan(1)
  const template = '<p>High ${2 + 3}</p>'
  const expected = '<p>High 5</p>'
  const result = await render(template)
  t.is(expected, result)
})

test('simple value', async t => {
  t.plan(1)
  const template = '<p>High ${howMany}</p>'
  const expected = '<p>High 5</p>'
  const result = await render(template, { howMany: 5 })
  t.is(expected, result)
})

test('accept promises as values', async t => {
  t.plan(1)
  const template = '<p>High ${howMany}</p>'
  const expected = '<p>High 5</p>'
  const result = await render(template, { howMany: Promise.resolve(5) })
  t.is(expected, result)
})

test('unescaped/raw HTML value', async t => {
  t.plan(1)
  const template = '<p>${raw(highFive)}</p>'
  const expected = '<p><strong>Up High</strong></p>'
  const result = await render(template, {
    highFive: '<strong>Up High</strong>'
  })
  t.is(expected, result)
})

test('loop over object creating select options', async t => {
  const template =
    '<select>' +
      '${Object.keys(states).map((s) => {' +
        'return `<option value="${s}">${states[s]}</option>`' +
      '})}' +
    '</select>'
  const expected =
    '<select><option value="AL">Alabama</option><option value="GA">Georgia</option></select>'
  const result = await render(template, {
    states: {
      AL: 'Alabama',
      GA: 'Georgia'
    }
  })
  t.is(expected, result)
})

test.cb('renderFile with a callback, absent values', t => {
  t.plan(1)
  const expected = '<header>2018 &copy; Nobody Important</header>'
  renderFile('test/parts/footer.html', (__, result) => {
    t.is(expected, result)
    t.end()
  })
})

test.cb('renderFile with callback and values', t => {
  t.plan(1)
  const expected = '<header><h1>Hello!</h1></header>'
  renderFile('test/parts/header.html', { title: 'Hello!' }, (__, result) => {
    t.is(expected, result)
    t.end()
  })
})

test('renderFile as promise, absent values', async t => {
  t.plan(1)
  const expected = '<header>2018 &copy; Nobody Important</header>'
  const result = await renderFile('test/parts/footer.html')
  t.is(expected, result)
})

test('renderFile as promise with values', async t => {
  t.plan(1)
  const expected = '<header><h1>Hello!</h1></header>'
  const result = await renderFile('test/parts/header.html', { title: 'Hello!' })
  t.is(expected, result)
})

test.skip('renderFile that includes another template', async t => {
  t.plan(1)
  const expected =
`<html>
<head>
  <title>Hello Boring!</title>
</head>
<body>
  <header><h1>Whaaat!</h1></header>
  <p>This is the body.</p>
</body>
</html>`
  const location = path.join(__dirname, 'test/index.html')
  const result = await renderFile(location, {
    title: 'Hello Boring!',
    header: {
      title: 'Whaaat!'
    }
  })
  t.is(expected, result)
})
