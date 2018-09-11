/* eslint-disable no-new-func */

'use strict'

const fs = require('fs')
const path = require('path')
const { html, raw } = require('./html')

const FILE_CACHE = {}
let TEMPLATE_DIR = ''

function include (file, values) {
  let location
  if (path.isAbsolute(file)) {
    TEMPLATE_DIR = path.dirname(file)
    location = file
  } else {
    location = path.join(TEMPLATE_DIR, file)
    // throw Error('"include" from within a template is not currently supported')
  }
  let contents = FILE_CACHE[location]
  if (!contents) {
    contents = fs.readFileSync(location, 'utf8')
    FILE_CACHE[location] = contents
  }
  return renderTemplate(contents, values)
}

async function renderTemplate (content, values = {}) {
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

module.exports = { include, renderTemplate }
