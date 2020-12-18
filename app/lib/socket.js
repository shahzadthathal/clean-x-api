const winston       = require('winston');

let io = null;

function init(server) {
	try{

		io = require("socket.io")(server);

		// Middleware
	    io.use((socket, next) => {
	    	
	    	//Perform validation
	    	/*const authToken = socket.handshake.query.authToken;
	    	if (!authToken) {   
	            winston.warn('Auth token required for socket connection');
	            return false;
	        }*/

	        return next();
	    })


	    // Events
	    io.sockets.on('connection', (socket) => {
	        winston.debug(` socket.js Socket connected on socketIO with SID: ${socket.client.id}`);

	        socket.on('error', (err) => {
	            winston.error(`Socket error:`, err);
	        });

	        socket.on('disconnect', (reason) => {

	        })

	        //Listen event : 'chat message'
	        socket.on('chat message', (msg) => {
			    //Emit event
			    io.emit('chat message', msg);
			});

	    })
	}catch(err){
        winston.debug(` socket.js Socket init error: ${err}`);
    }	 
}

function emitToAll(eventName, payload) {
	if (!io) {
		winston.debug('io is not defined in emitToAll')
	}
    try{
		io.emit(eventName, payload);
		
    }catch(err){
        winston.debug(` socket.js emitToAll error: ${err.message}`);
    }
}

exports.init = init;
exports.emitToAll = emitToAll;