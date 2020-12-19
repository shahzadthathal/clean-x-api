const express = require("express");
const http = require('http');
const bodyParser = require("body-parser");
const numCPUs = require('os').cpus().length;
const cluster       = require('cluster');
const winston       = require('winston');
const expressValidator = require('express-validator')
const app = express();
let server = null;
process.env.NODE_ENV = "development"

const startApp = async () => {

	// parse requests of content-type - application/json
	app.use(bodyParser.json());

	// parse requests of content-type - application/x-www-form-urlencoded
	app.use(bodyParser.urlencoded({ extended: true }));

	//reqest data validation  +  sainitization
	app.use(expressValidator())

	//Init db
	const db = require("./models");
	db.sequelize.sync();

	// simple route
	app.get("/", (req, res) => {
	    res.sendFile(__dirname + '/index.html');
	});

	require("./app/routes/user.routes")(app);
	require("./app/routes/tower.routes")(app);
	require("./app/routes/office.routes")(app);

	//create server
	server = http.createServer(app);

	//init socket
	require('./app/lib/socket').init(server);

	// set port, listen for requests
	const PORT = process.env.PORT || 5000;
	server.listen(PORT, () => {
	  console.log(`Server is running on port ${PORT}.`);
	});
}

//cluster module for highly scalable app
if (cluster.isMaster && process.env.NODE_ENV !='test') { 
	// Parent, only creates clusters
    global.processId = 'Master';

    winston.info(`Launching 1 worker(s)`);
    //production use `i < numCPUs` instead of `i < 1`
    for (let i = 0; i < 1; ++i) {
        cluster.fork();
    }
    cluster.on('fork', worker => winston.info(`Worker ${worker.id} created`));
    cluster.on('listening', (worker, address) => {
        winston.info(`Worker ${worker.id} (pid ${worker.process.pid}) is now connected to ${address.address}:${address.port}`);
    });
    cluster.on('exit', worker => {
        winston.warn(`Worker ${worker.id} (pid ${worker.process.pid}) died, forking a new one...`);
        cluster.fork();
    });
} else {
	startApp();
}

module.exports = server;