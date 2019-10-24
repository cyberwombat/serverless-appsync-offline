const { URLSearchParams } = require('url')
const fetch = require('node-fetch')
const log = require('./log')

const httpSource = async (endpoint, { resourcePath, method, params }) => {
  const { query } = params || {}
  const queryPath =
    query === undefined ||
    (typeof query === 'object' && Object.keys(query).length === 0)
      ? ''
      : `?${new URLSearchParams(query)}`

  log.info('HTTP Request', endpoint + resourcePath + queryPath)
  const response = await fetch(endpoint + resourcePath + queryPath, {
    ...params,
    method
  })

  return {
    body: await response.text(),
    statusCode: response.status
  }
}

module.exports = httpSource
