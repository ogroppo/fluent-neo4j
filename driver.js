const neo4j = require('neo4j-driver').v1
const driver = neo4j.driver(process.env.NEO4J_URL, neo4j.auth.basic(process.env.NEO4J_USER, process.env.NEO4J_PASS))

process.on('exit', function () {
	driver.close()
})

// catch ctrl+c event and exit normally
process.on('SIGINT', function () {
	driver.close()
})

process.on('uncaughtException', function (err) {
  driver.close()
})

module.exports = driver
