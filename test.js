/* eslint-disable no-template-curly-in-string */

'use strict'

const path = require('path')
const test = require('ava')
const { render, renderFile } = require('./index')

test('server side render', async t => {
  t.plan(2)
  try {
    const rendered = await render(`
        <div class="testing">
          <h1>hello!</h1>
        </div>
      `)
    t.true(rendered.includes('<h1>hello!</h1>'), 'contains a child element')
    t.true(rendered.includes('<div class="testing">'), 'attribute gets set')
  } catch (e) {
    t.fail(e)
  }
})

test('passing another element to html on server side render', async t => {
  t.plan(1)
  try {
    const button = await render('<button>click</button>')
    const rendered = await render(`
      <div class="testing">
        ${button}
      </div>
    `)
    t.true(rendered.includes('<button>click</button>'), 'button rendered correctly')
  } catch (e) {
    t.fail(e)
  }
})

test('style attribute', async t => {
  t.plan(1)
  const expected = `
    <h1 style="color: red">
      Hey TEST, <span style="color: blue">This</span> is a card!!!
    </h1>
  `
  const name = 'test'
  try {
    const result = await render(`
    <h1 style="color: red">
      Hey ${name.toUpperCase()}, <span style="color: blue">This</span> is a card!!!
    </h1>
  `)
    t.is(expected, result)
  } catch (e) {
    t.fail(e)
  }
})

test('unescape html', async t => {
  t.plan(1)
  try {
    const expected = '<span>Hello <strong>there</strong></span>'
    const result = await render('<span>Hello <strong>there</strong></span>')
    t.is(expected, result)
  } catch (e) {
    t.fail(e)
  }
})

test('event attribute', async t => {
  t.plan(1)
  const template = '<div onmouseover="${onmouseover}">Hello</div>'
  const expected = '<div onmouseover="">Hello</div>'
  try {
    const result = await render(template, {
      onmouseover: function () {}
    })
    t.is(expected, result)
  } catch (e) {
    t.fail(e)
  }
})

test('boolean attribute', async t => {
  t.plan(1)
  const template = '<input disabled=${disabled} autofocus=${autofocus}>'
  const expected = '<input disabled="disabled" >'
  try {
    const result = await render(template, {
      disabled: true,
      autofocus: false
    })
    t.is(expected, result)
  } catch (e) {
    t.fail(e)
  }
})

test('spread attributes', async t => {
  t.plan(1)
  const template = '<div ${props}>Hello</div>'
  const expected = '<div class="abc" id="def">Hello</div>'
  try {
    const result = await render(template, { props: { class: 'abc', id: 'def' } })
    t.is(expected, result)
  } catch (e) {
    t.fail(e)
  }
})

test('render HTML only', async t => {
  t.plan(1)
  const expected = '<p>Hello World</p>'
  try {
    const result = await render(expected)
    t.is(expected, result)
  } catch (e) {
    t.fail(e)
  }
})

test('evaluate JS expressions', async t => {
  t.plan(1)
  const template = '<p>High ${2 + 3}</p>'
  const expected = '<p>High 5</p>'
  try {
    const result = await render(template)
    t.is(expected, result)
  } catch (e) {
    t.fail(e)
  }
})

test('simple value', async t => {
  t.plan(1)
  const template = '<p>High ${howMany}</p>'
  const expected = '<p>High 5</p>'
  try {
    const result = await render(template, { howMany: 5 })
    t.is(expected, result)
  } catch (e) {
    t.fail(e)
  }
})

test('accept promises as values', async t => {
  t.plan(1)
  const template = '<p>High ${howMany}</p>'
  const expected = '<p>High 5</p>'
  try {
    const result = await render(template, { howMany: Promise.resolve(5) })
    t.is(expected, result)
  } catch (e) {
    t.fail(e)
  }
})

test('unescaped/raw HTML value', async t => {
  t.plan(1)
  const template = '<p>${raw(highFive)}</p>'
  const expected = '<p><strong>Up High</strong></p>'
  try {
    const result = await render(template, {
      highFive: '<strong>Up High</strong>'
    })
    t.is(expected, result)
  } catch (e) {
    t.fail(e)
  }
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
  try {
    const result = await render(template, {
      states: {
        AL: 'Alabama',
        GA: 'Georgia'
      }
    })
    t.is(expected, result)
  } catch (e) {
    t.fail(e)
  }
})

test.cb('render with a callback, absent values', t => {
  t.plan(1)
  const expected = '<header>2018 &copy; Nobody Important</header>'
  render(expected, (err, result) => {
    if (err) t.fail(err)
    t.is(expected, result)
    t.end()
  })
})

test.cb('render with callback and values', t => {
  t.plan(1)
  const template = '<header><h1>${title}</h1></header>'
  const expected = '<header><h1>Hello!</h1></header>'
  render(template, { title: 'Hello!' }, (err, result) => {
    if (err) t.fail(err)
    t.is(expected, result)
    t.end()
  })
})

test.cb('render with template include', t => {
  const template = '<h1>${heading}</h1>${include(\'test/b/c/c.html\')}'
  const expected = '<h1>Hello!</h1><h2>2018 &copy; Nobody Important</h2>'
  render(template, { heading: 'Hello!' }, (err, result) => {
    if (err) t.fail(err)
    t.is(expected, result)
    t.end()
  })
})

test.cb('renderFile with a callback, absent values', t => {
  t.plan(1)
  const expected = '<h2>2018 &copy; Nobody Important</h2>'
  renderFile('test/b/c/c.html', (err, result) => {
    if (err) t.fail(err)
    t.is(expected, result)
    t.end()
  })
})

test('renderFile as promise, absent values', async t => {
  t.plan(1)
  try {
    const expected = '<h2>2018 &copy; Nobody Important</h2>'
    const result = await renderFile('test/b/c/c.html')
    t.is(expected, result)
  } catch (e) {
    t.fail(e)
  }
})

test.cb('renderFile with callback and values', t => {
  t.plan(1)
  const expected = '<header><h1>Hello!</h1><h2>2018 &copy; Nobody Important</h2></header>'
  renderFile('test/b/b.html', { heading: 'Hello!' }, (err, result) => {
    if (err) t.fail(err)
    t.is(expected, result)
    t.end()
  })
})

test('renderFile as promise with values', async t => {
  t.plan(1)
  try {
    const expected = '<header><h1>Hello!</h1><h2>2018 &copy; Nobody Important</h2></header>'
    const result = await renderFile('test/b/b.html', { heading: 'Hello!' })
    t.is(expected, result)
  } catch (e) {
    t.fail(e)
  }
})

test('renderFile that includes another template', async t => {
  t.plan(1)
  const expected =
`<html>
<head>
  <title>So boring!</title>
</head>
<body>
  <header><h1>Whaaat!</h1><h2>2018 &copy; Nobody Important</h2></header>
</body>
</html>`
  const location = path.join(__dirname, 'test/a.html')
  try {
    const result = await renderFile(location, {
      title: 'So boring!',
      header: {
        heading: 'Whaaat!'
      }
    })
    t.is(expected, result)
  } catch (e) {
    t.fail(e)
  }
})
