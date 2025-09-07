'use strict'

module.exports = require('neostandard')({
  semi: false,
  ts: false,
  ignores: ['node_modules'],
  globals: {
    SharedArrayBuffer: true,
    Atomics: true,
    AbortController: true,
    MessageChannel: true
  }
})
