var socket = io();

socket.on('userSocket', function(msg){
    console.log("message = " + msg);  
    // socket.emit('userSocket', msg);
});
