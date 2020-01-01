process.env.CONSOLA_LEVEL = process.env.DEBUG_LEVEL
  ? process.env.DEBUG_LEVEL
  : 'silent'
module.exports = require('consola')
