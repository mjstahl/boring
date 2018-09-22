/* eslint-disable no-new-func */

'use strict'

const fs = require('fs')
const path = require('path')
const { html, raw } = require('./html')

const FILE_CACHE = {}

function include (dirs) {
  return async (file, values) => {
    const location = path.isAbsolute(file) ? file : path.join(dirs[0], file)
    dirs.unshift(path.dirname(location))
    let contents = FILE_CACHE[location]
    if (!contents) {
      contents = fs.readFileSync(location, 'utf8')
      FILE_CACHE[location] = contents
    }
    return renderTemplate(contents, values, dirs)
  }
}

async function renderTemplate (content, values = {}, dirs) {
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
  return Promise.all(vals).then((v) => {
    try {
      return evaluate(...v, html, include(dirs), raw).then(r => r.toString())
    } catch (e) {
      return Promise.reject(e)
    }
  })
}

module.exports = { include, renderTemplate }
