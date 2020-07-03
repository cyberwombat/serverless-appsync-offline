process.env.CONSOLA_LEVEL = process.env.DEBUG ? 'debug' : 'silent'

module.exports = require('consola')
