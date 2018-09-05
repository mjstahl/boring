const test = require('ava');
const html = require('./index');
const raw = require('./raw');

test('server side render', function (t) {
  t.plan(2);
  const rendered = html`
    <div class="testing">
      <h1>hello!</h1>
    </div>
  `;
  t.true(rendered.includes('<h1>hello!</h1>'), 'contains a child element');
  t.true(rendered.includes('<div class="testing">'), 'attribute gets set');
});

test('passing another element to html on server side render', function (t) {
  t.plan(1);
  const button = html`<button>click</button>`;
  const rendered = html`
    <div class="testing">
      ${button}
    </div>
  `;
  t.true(rendered.includes('<button>click</button>'), 'button rendered correctly');
});

test('style attribute', function (t) {
  t.plan(1);
  const name = 'test';
  const result = html`
    <h1 style="color: red">
      Hey ${name.toUpperCase()}, <span style="color: blue">This</span> is a card!!!
    </h1>
  `.toString();
  const expected = `
    <h1 style="color: red">
      Hey TEST, <span style="color: blue">This</span> is a card!!!
    </h1>
  `;
  t.is(result, expected);
})

test('unescape html', function (t) {
  t.plan(1);
  const result = raw('<span>Hello <strong>there</strong></span>').toString();
  const expected = '<span>Hello <strong>there</strong></span>';
  t.is(result, expected);
})

test('unescape html inside html', function (t) {
  t.plan(1);
  const expected = '<span>Hello <strong>there</strong></span>';
  const result = html`${raw('<span>Hello <strong>there</strong></span>')}`.toString();
  t.is(result, expected);
})

test('event attribute', function (t) {
  t.plan(1);
  function onmouseover () {}
  function onmouseout () {}
  const expected = `
    <div onmouseover="" onmouseout="">
      Hello
    </div>
  `;
  const result = html`
    <div onmouseover="${onmouseover}" onmouseout=${onmouseout}>
      Hello
    </div>
  `.toString();
  t.is(result, expected);
})

test('boolean attribute', function (t) {
  t.plan(1);
  const expected = '<input disabled="disabled" >';
  const result = html`<input disabled=${true} autofocus=${false}>`.toString();
  t.is(result, expected);
})

test('spread attributes', function (t) {
  t.plan(1);
  const props = { class: 'abc', id: 'def' };
  const expected = '<div class="abc" id="def">Hello</div>';
  const result = html`<div ${props}>Hello</div>`.toString();
  t.is(result, expected);
})