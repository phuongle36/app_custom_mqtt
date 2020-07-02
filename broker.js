var mosca = require('mosca');
var settings = {
	port:1883
}

var server = new mosca.Server(settings);

server.on('ready', function(){
	console.log("ready");
});

server.on('published', function(packet, client) {
	console.log('Published', packet.payload);
});
