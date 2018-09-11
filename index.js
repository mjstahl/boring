'use strict'

const path = require('path')
const { include, renderTemplate } = require('./render')

function __render (content, values, cb, fn) {
  if (typeof values === 'function') {
    cb = values
    values = {}
  }
  let promise
  if (!cb) {
    promise = new Promise((resolve, reject) => {
      cb = (err, result) => err ? reject(err) : resolve(result)
    })
  }
  fn(content, values).then(data => cb(null, data)).catch(cb)
  return promise
}

function render (content, values = {}, callback) {
  return __render(content, values, callback, renderTemplate)
}

function renderFile (file, values = {}, callback) {
  file = path.isAbsolute(file) ? file : path.join(__dirname, file)
  return __render(file, values, callback, include)
}

module.exports = { render, renderFile }
