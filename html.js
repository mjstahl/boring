'use strict'

const BOOL_ATTRS = [
  'autofocus', 'checked', 'defaultchecked', 'disabled', 'formnovalidate',
  'indeterminate', 'readonly', 'required', 'selected', 'willvalidate'
]
const BOOL_ATTR_REGEX =
  new RegExp(`(${BOOL_ATTRS.join('|')})=["']?$`, 'i')

const ESCAPE_CHARS = {
  '&': '&amp;',
  '<': '&lt;',
  '>': '&gt;',
  '"': '&quot;',
  "'": '&#x27;',
  '`': '&#x60;'
}
const ESCAPE_REGEX =
  new RegExp(`(?:${Object.keys(ESCAPE_CHARS).join('|')})`, 'g')

function html () {
  const [parts, ...values] = arguments
  const rendered = parts
    .map((part, i) => {
      const boolAttr = BOOL_ATTR_REGEX.exec(part)
      return (boolAttr)
        ? boolAttrResult(part, values[i], boolAttr)
        : [part, valueToString(values[i])]
    })
    .reduce((a, b) => a.concat(b))
    .reduce((a, b) => {
      const value = (a.slice(-1) === '=') ? `"${b}"` : b
      return a.concat(value)
    })
  const wrapped = new String(rendered) // eslint-disable-line no-new-wrappers
  wrapped.__encoded = true
  return wrapped
}

function boolAttrResult (part, value, attr) {
  const nonAttr = part.slice(0, attr.index)
  return (value)
    ? [`${nonAttr}${attr[1]}="${attr[1]}"`, '']
    : [`${nonAttr}`, '']
}

function valueToString (value) {
  if (value === null || value === undefined) return ''
  if (value.__encoded) return value
  if (typeof value === 'function') return ''
  if (Array.isArray(value)) return value.join('')
  if (typeof value === 'object') {
    return Object.keys(value).reduce((str, key) => {
      if (str.length > 0) str += ' '
      return (BOOL_ATTRS.includes(key))
        ? (value[key]) ? `${str}${key}="${key}"` : str
        : `${str}${key}="${valueToString(value[key])}"`
    }, '')
  }
  return (value.replace)
    ? value.replace(ESCAPE_REGEX, (m) => ESCAPE_CHARS[m])
    : value
}

module.exports = html
