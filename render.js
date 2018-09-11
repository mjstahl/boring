/* eslint-disable no-new-func */

'use strict'

const fs = require('fs')
const path = require('path')
const { html, raw } = require('./html')

const FILE_CACHE = {}
let TEMPLATE_DIR = ''

async function include (file, values) {
  let location
  if (path.isAbsolute(file)) {
    TEMPLATE_DIR = path.dirname(file)
    location = file
  } else {
    location = path.join(TEMPLATE_DIR, file)
    throw Error('"include" from within a template is not currently supported')
  }
  return new Promise((resolve, reject) => {
    try {
      let contents = FILE_CACHE[location]
      if (!contents) {
        contents = fs.readFileSync(location, 'utf8')
        FILE_CACHE[location] = contents
      }
      resolve(render(contents, values))
    } catch (e) { reject(e) }
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
  const evaluate = new Function(...vars, 'html', 'include', 'raw', body)
  return evaluate(...await Promise.all(vals), html, include, raw).toString()
}

module.exports = { html, include, raw, render }
