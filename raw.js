'use strict'

function raw(tag) {
  var wrapper = new String(tag);
  wrapper.__encoded = true;
  return wrapper;
}

module.exports = raw;