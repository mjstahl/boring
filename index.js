'use strict';

const BOOL_PROPS = [
  'autofocus', 'checked', 'defaultchecked', 'disabled', 'formnovalidate',
  'indeterminate', 'readonly', 'required', 'selected', 'willvalidate'
];

const BOOL_PROP_REGEX =
  new RegExp('(' + BOOL_PROPS.join('|') + ')=["\']?$', 'i');

function boring(src) {
  let boolMatch;
  let pieces = src;
  let output = '';
  for (let i = 0; i < pieces.length; i++) {
    const piece = pieces[i]
    if (i < pieces.length - 1) {
      if ((boolMatch = BOOL_PROP_REGEX.exec(piece))) {
        output += piece.slice(0, boolMatch.index)
        if (arguments[i + 1]) {
          output += boolMatch[1] + '="' + boolMatch[1] + '"'
        }
        continue
      }

      const value = handleValue(arguments[i + 1])
      if (piece[piece.length - 1] === '=') {
        output += piece + '"' + value + '"'
      } else {
        output += piece + value
      }
    } else {
      output += piece
    }
  }

  // Avoid double encoding by marking encoded string. You cannot add properties
  // to string literals
  const wrapper = new String(output)
  wrapper.__encoded = true
  return wrapper
}

function handleValue(value) {
  // Assume that each item is a result of html``
  if (Array.isArray(value)) return value.join('')

  // Ignore event handlers, should probably warn that the results should
  // be strings, or evaluate that function
  if (typeof value === 'function') return ''
  // Don't want to stringify null or undefined
  if (value === null || value === undefined) return ''
  if (value.__encoded) return value

  if (typeof value === 'object') {
    if (typeof value.outerHTML === 'string') return value.outerHTML
    return Object.keys(value).reduce(function (str, key) {
      if (str.length > 0) str += ' '
      if (BOOL_PROPS.indexOf(key) !== -1) {
        if (value[key]) {
          return str + key + '="' + key + '"'
        }
        return str
      }

      const handled = handleValue(value[key])
      return str + key + '="' + handled + '"'
    }, '')
  }

  const str = value.toString()
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;')
}

function raw(tag) {
  var wrapper = new String(tag);
  wrapper.__encoded = true;
  return wrapper;
}

module.exports = { boring, raw };