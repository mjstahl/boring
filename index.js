'use strict'

const path = require('path')
const { include, render } = require('./render')

async function renderFile (file, values = {}, callback) {
  file = path.isAbsolute(file) ? file : path.join(__dirname, file)
  if (typeof values === 'function') {
    callback = values
    values = {}
  }

  let promise
  if (!callback) {
    promise = new Promise((resolve, reject) => {
      callback = (err, result) => err ? reject(err) : resolve(result)
    })
  }

  include(file, values)
    .then(result => callback(null, result))
    .catch(e => callback(Error(`${e.message} in "${file}"`)))

  return promise
}

module.exports = { render, renderFile }
