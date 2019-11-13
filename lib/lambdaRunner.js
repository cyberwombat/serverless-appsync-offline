const {
  log,
  sendErr,
  sendOutput,
  installExceptionHandlers
} = require('./lambda/util')

process.once(
  'message',
  async ({ module, handlerPath, handlerMethod, payload }) => {
    try {
      log.info('Load', module)
      // eslint-disable-next-line
      const handlerModule = require(module)
      if (!handlerModule[handlerMethod]) {
        throw new Error(
          `Module : ${handlerPath} does not have export: ${handlerMethod}`
        )
      }

      log.info('Invoke', handlerMethod)
      const lambda = handlerModule[handlerMethod]
      const context = {}
      const lambdaResult = lambda(payload, context, (err, callbackResult) => {
        if (err) {
          sendErr(err)
        } else {
          sendOutput(callbackResult)
        }
      })
      if (lambdaResult instanceof Promise) {
        sendOutput(await lambdaResult)
      }
    } catch (err) {
      log.error(err)
      sendErr(err)
    }
  }
)

installExceptionHandlers()
