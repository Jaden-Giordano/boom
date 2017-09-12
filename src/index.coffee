logger = require('winston')
app = require('./app')
port = app.get('port')
server = app.listen(port)
process.on 'unhandledRejection', (reason, p) ->
	logger.error 'Unhandled Rejection at: Promise ', p, reason
server.on 'listening', ->
	logger.info 'Feathers application started on ' + app.get('host') + ':' + port
