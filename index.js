'use strict'

const BOOL_ATTRS = [
  'autofocus', 'checked', 'defaultchecked', 'disabled', 'formnovalidate',
  'indeterminate', 'readonly', 'required', 'selected', 'willvalidate'
];
const BOOL_ATTR_REGEX = new RegExp(`(${BOOL_ATTRS.join('|')})=["\']?$`, 'i');

function boring() {
  const [parts, ...values] = arguments;
  const rendered = parts
    .map((part, i) => {
      const boolAttr = BOOL_ATTR_REGEX.exec(part);
      return (boolAttr)
        ? boolAttrResult(part, values[i], boolAttr)
        : [part, valueToString(values[i])];
    })
    .reduce((a, b) => a.concat(b))
    .reduce((a, b) => {
      const value = (a.slice(-1) === '=') ? `"${b}"` : b;
      return a.concat(value);
    });
  const wrapper = new String(rendered);
  wrapper.__encoded = true;
  return wrapper;
}

function boolAttrResult(part, value, attr) {
  const nonAttr = part.slice(0, attr.index);
  return (value)
    ? [`${nonAttr}${attr[1]}="${attr[1]}"`, '']
    : [`${nonAttr}`, ''];
}

function valueToString(value) {
  if (value === null || value === undefined) return '';
  if (value.__encoded) return value;
  if (typeof value === 'function') return '';
  if (Array.isArray(value)) return value.join('');
  if (typeof value === 'object') {
    return Object.keys(value).reduce((str, key) => {
      if (str.length > 0) str += ' ';
      return (BOOL_ATTRS.includes(key))
        ? (value[key]) ? `${str}${key}="${key}"` : str
        : `${str}${key}="${valueToString(value[key])}"`;
    }, '');
  }
  return value.toString()
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

module.exports = boring;