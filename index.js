/* eslint-disable no-new-func */

'use strict'

const fs = require('fs')
const { html, raw } = require('./html')

function renderFile (path, values, callback) {
  fs.readFile(path, function (err, content) {
    if (err) return callback(err)
    render(content, values)
      .then((result) => callback(null, result))
      .catch((e) => callback(new Error(`${e.message} in "${path}"`)))
  })
}

async function render (content, values = {}) {
  const [vars, vals] = Object.keys(values).reduce(([a, b], k) => {
    a.push(k)
    b.push(values[k])
    return [a, b]
  }, [[], []])
  const body = `
    'use strict'
    return html\`${content}\`
  `
  const evaluate = new Function(...vars, 'html', 'raw', body)
  return evaluate(...await Promise.all(vals), html, raw).toString()
}
module.exports = { html, raw, render, renderFile }
