const govukPrototypeKit = require('govuk-prototype-kit')
const router = govukPrototypeKit.requests.setupRouter('/housing')

// require('./current/_routes')

require('./housing/_routes')
