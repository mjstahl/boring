'use strict'

const path = require('path')
const { include, renderTemplate } = require('./render')

function renderWith (content, values, cb) {
  if (typeof values === 'function') [cb, values] = [values, {}]
  return (renderer) => {
    let promise
    if (!cb) {
      promise = new Promise((resolve, reject) => {
        cb = (err, result) => err ? reject(err) : resolve(result)
      })
    }
    renderer(content, values).then(data => cb(null, data)).catch(cb)
    return promise
  }
}

function render (content, values = {}, cb) {
  return renderWith(content, values, cb)(renderTemplate)
}

function renderFile (file, values = {}, cb) {
  file = path.isAbsolute(file) ? file : path.join(__dirname, file)
  return renderWith(file, values, cb)(include([]))
}

module.exports = { render, renderFile }
