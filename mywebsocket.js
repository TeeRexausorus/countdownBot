// Node.js WebSocket server script
const http = require('http');
const WebSocketServer = require('websocket').server;
const clients = {};
var server = http.createServer(function(request, response) {
    console.log((new Date()) + ' Received request for ' + request.url);
    response.writeHead(404);
    response.end();
});

server.listen(8080);
const wsServer = new WebSocketServer({
    httpServer: server
});
wsServer.on('request', function(request) {
    const connection = request.accept(null, request.origin);
    connection.on('message', function(message) {
        console.log('Received Message:', message.utf8Data);
        msgJson = JSON.parse(message.utf8Data);
        clients[msgJson['name']] = connection;
    });
    connection.on('close', function(reasonCode, description) {
        console.log('Client has disconnected.');
    });
});

const notifyWebsocketClient = (client) => {
    const newElem = {};
    newElem['positionX'] = 420;
    newElem['positionY'] = 69;
    clients[client].sendUTF(JSON.stringify(newElem));
};

exports.notifyWebsocketClient = notifyWebsocketClient;
