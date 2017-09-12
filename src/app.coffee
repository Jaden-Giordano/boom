path = require('path')
favicon = require('serve-favicon')
compress = require('compression')
cors = require('cors')
helmet = require('helmet')
bodyParser = require('body-parser')
feathers = require('feathers')
configuration = require('feathers-configuration')
hooks = require('feathers-hooks')
rest = require('feathers-rest')
socketio = require('feathers-socketio')
handler = require('feathers-errors/handler')
notFound = require('feathers-errors/not-found')
middleware = require('./middleware')
services = require('./services')
appHooks = require('./app.hooks.coffee')
authentication = require('./authentication')
rethinkdb = require('./rethinkdb')
app = feathers()
# Load app configuration
app.configure configuration()
# Enable CORS, security, compression, favicon and body parsing
app.use cors()
app.use helmet()
app.use compress()
app.use bodyParser.json()
app.use bodyParser.urlencoded(extended: true)
app.use favicon(path.join(app.get('public'), 'favicon.ico'))
# Host the public folder
app.use '/', feathers.static(app.get('public'))
# Set up Plugins and providers
app.configure hooks()
app.configure rethinkdb
app.configure rest()
app.configure socketio()
# Configure other middleware (see `middleware/index.js`)
app.configure middleware
app.configure authentication
# Set up our services (see `services/index.js`)
app.configure services
# Configure a middleware for 404s and the error handler
app.use notFound()
app.use handler()
app.hooks appHooks
module.exports = app
