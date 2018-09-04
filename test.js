const test = require('ava');
const html = require('./index').boring;
const raw = require('./index').raw

test('server side render', function (t) {
  t.plan(2)
  var element = html`<div class="testing">
    <h1>hello!</h1>
  </div>`
  var result = element.toString()
  t.true(result.indexOf('<h1>hello!</h1>') !== -1, 'contains a child element')
  t.true(result.indexOf('<div class="testing">') !== -1, 'attribute gets set')
})

test('passing another element to html on server side render', function (t) {
  t.plan(1)
  var button = html`<button>click</button>`
  var element = html`<div class="testing">
    ${button}
  </div>`
  var result = element.toString()
  t.true(result.indexOf('<button>click</button>') !== -1, 'button rendered correctly')
})

test('style attribute', function (t) {
  t.plan(1)
  var name = 'test'
  var result = html`<h1 style="color: red">Hey ${name.toUpperCase()}, <span style="color: blue">This</span> is a card!!!</h1>`
  var expected = '<h1 style="color: red">Hey TEST, <span style="color: blue">This</span> is a card!!!</h1>'
  t.is(result.toString(), expected)
})

test('unescape html', function (t) {
  t.plan(1)

  var expected = '<span>Hello <strong>there</strong></span>'
  var result = raw('<span>Hello <strong>there</strong></span>').toString()

  t.is(result, expected)
})

test('unescape html inside html', function (t) {
  t.plan(1)

  var expected = '<span>Hello <strong>there</strong></span>'
  var result = html`${raw('<span>Hello <strong>there</strong></span>')}`.toString()

  t.is(result, expected)
})

test('event attribute', function (t) {
  t.plan(1)

  var expected = '<div onmouseover="" onmouseout="">Hello</div>'
  var result = html`<div onmouseover=${onmouseover} onmouseout="${onmouseout}">Hello</div>`.toString()

  t.is(result, expected)

  function onmouseover () {}
  function onmouseout () {}
})

test('boolean attribute', function (t) {
  t.plan(1)

  var expected = '<input disabled="disabled" >'
  var result = html`<input disabled=${true} autofocus=${false}>`.toString()

  t.is(result, expected)
})

test('spread attributes', function (t) {
  t.plan(1)

  var expected = '<div class="abc" id="def">Hello</div>'
  var props = { class: 'abc', id: 'def' }
  var result = html`<div ${props}>Hello</div>`.toString()

  t.is(result, expected)
})