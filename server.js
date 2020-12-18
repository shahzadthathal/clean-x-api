const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");

const cluster       = require('cluster');
const winston       = require('winston');

// Configure default logger system
//winston.default.transports.console.colorize = true;
//winston.default.transports.console.level = 'debug';
//winston.default.transports.console.timestamp = true;

if (cluster.isMaster) { // Parent, only creates clusters
    global.processId = 'Master';
    //winston.default.transports.console.label = global.processId;

    winston.info(`Launching 1 worker(s)`);
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


	const app = express();

	// var corsOptions = {
	//   origin: "http://localhost:8081"
	// };

	//app.use(cors(corsOptions));

	// parse requests of content-type - application/json
	app.use(bodyParser.json());

	// parse requests of content-type - application/x-www-form-urlencoded
	app.use(bodyParser.urlencoded({ extended: true }));



	const db = require("./models");
	db.sequelize.sync();



	// simple route
	app.get("/", (req, res) => {
	  res.json({ message: "Welcome..." });
	});

	require("./app/routes/user.routes")(app);
	require("./app/routes/tower.routes")(app);
	require("./app/routes/office.routes")(app);

	// set port, listen for requests
	const PORT = process.env.PORT || 5000;
	app.listen(PORT, () => {
	  console.log(`Server is running on port ${PORT}.`);
	});

}