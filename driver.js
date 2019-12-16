const neo4j = require('neo4j-driver').v1

if(!process.env.NEO4J_URL)
  throw new Error("NEO4J_URL is required")

if(!process.env.NEO4J_USER)
  throw new Error("NEO4J_USER is required")

if(!process.env.NEO4J_PASS)
  throw new Error("NEO4J_URL is required")

const driver = neo4j.driver(
  process.env.NEO4J_URL,
  neo4j.auth.basic(process.env.NEO4J_USER, process.env.NEO4J_PASS)
)

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
