module.exports = (io) => {

	//** SOCKET COMMUNICATION **//
	io.on('connection', function(socket){
	  console.log('a user connected');
	  io.emit('userSocket', 'connected user yo!');
	  socket.on('userSocket', function(msg){
	    io.emit('userSocket', msg);
	  });
	});

}