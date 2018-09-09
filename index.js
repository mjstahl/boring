/* eslint-disable no-new-func */

'use strict'

const fs = require('fs')
const html = require('./html')
const raw = require('./raw')

function renderFile (path, values, callback) {
  fs.readFile(path, function (err, content) {
    if (err) return callback(err)
    try {
      return callback(null, render(content, values))
    } catch (e) {
      return callback(new Error(`${e.message} in "${path}"`))
    }
  })
}

function render (content, options = {}) {
  const [vars, vals] = Object.keys(options).reduce(([a, b], k) => {
    a.push(k)
    b.push(options[k])
    return [a, b]
  }, [[], []])
  const body = `
    'use strict'
    return html\`${content}\`
  `
  const evaluate = new Function(...vars, 'html', 'raw', body)
  return evaluate(...vals, html, raw).toString()
}
module.exports = { html, raw, render, renderFile }
