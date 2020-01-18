const { GraphQLScalarType, GraphQLError, Kind } = require('graphql')
const GraphQLJSON = require('graphql-type-json')
const { isValidNumber, getNumberType } = require('libphonenumber-js')

const {
  GraphQLDate,
  GraphQLTime,
  GraphQLDateTime
} = require('graphql-iso-date')

const { EmailAddressResolver, URLResolver } = require('graphql-scalars')

const phoneValidator = ast => {
  const { kind, value } = ast
  if (kind !== Kind.STRING) {
    throw new GraphQLError(
      `Query error: Can only parse strings got a: ${kind}`,
      [ast]
    )
  }

  let isValid = isValidNumber(value)

  if (!isValid) {
    throw new GraphQLError('Query error: Not a valid phone number', [ast])
  }

  return value
}

const jsonValidator = ast => {
  const { kind, value } = ast
  if (kind !== Kind.STRING) {
    throw new GraphQLError(
      `Query error: Can only parse stringified JSON got a: ${kind}`,
      [ast]
    )
  }

  try {
    return JSON.parse(value)
  } catch (e) {
    throw new GraphQLError('Query error: Not a valid JSON string', [ast])
  }

  return value
}

const AWSJSON = new GraphQLScalarType({
  name: 'AWSJSON',
  description: 'AWSJSON string type',
  serialize(value) {
    return JSON.stringify(value)
  },
  parseValue(value) {
    const ast = {
      kind: Kind.STRING,
      value
    }
    return jsonValidator(ast)
  },
  parseLiteral(ast) {
    return jsonValidator(ast)
  }
})

const AWSPhone = new GraphQLScalarType({
  name: 'AWSPhone',
  description: 'AWSPhone type',
  serialize(value) {
    const ast = {
      kind: Kind.STRING,
      value
    }
    return phoneValidator(ast)
  },
  parseValue(value) {
    const ast = {
      kind: Kind.STRING,
      value
    }
    return phoneValidator(ast)
  },
  parseLiteral(ast) {
    return phoneValidator(ast)
  }
})

const AWSDate = new GraphQLScalarType({
  name: 'AWSDate',
  description: GraphQLDate.description,
  serialize(value) {
    return GraphQLDate.serialize(value)
  },
  parseValue(value) {
    return GraphQLDate.parseValue(value) ? value : undefined
  },
  parseLiteral(value) {
    return GraphQLDate.parseLiteral(value) ? value.value : undefined
  }
})

const AWSTime = new GraphQLScalarType({
  name: 'AWSTime',
  description: GraphQLTime.description,
  serialize(value) {
    return GraphQLTime.serialize(value)
  },
  parseValue(value) {
    return GraphQLTime.parseValue(value) ? value : undefined
  },
  parseLiteral(value) {
    return GraphQLTime.parseLiteral(value) ? value.value : undefined
  }
})

const AWSDateTime = new GraphQLScalarType({
  name: 'AWSDateTime',
  description: GraphQLDateTime.description,
  serialize(value) {
    return GraphQLDateTime.serialize(value)
  },
  parseValue(value) {
    return GraphQLDateTime.parseValue(value) ? value : undefined
  },
  parseLiteral(value) {
    return GraphQLDateTime.parseLiteral(value) ? value.value : undefined
  }
})

const scalars = {
  //AWSJSON: GraphQLJSON, // This is not right. AWS doesn't accept unstringified JSON
  AWSJSON,
  AWSDate,
  AWSTime,
  AWSDateTime,
  AWSPhone,
  AWSEmail: EmailAddressResolver,
  AWSURL: URLResolver
}

const wrapSchema = schemaString => {
  const scalarStrings = Object.keys(scalars)
    .map(scalarKey => `scalar ${scalarKey}\n`)
    .join('')

  return scalarStrings + schemaString
}

module.exports = {
  scalars,
  wrapSchema
}
