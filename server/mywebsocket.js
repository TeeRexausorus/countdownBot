// Node.js WebSocket server script
const http = require('http');
const WebSocketServer = require('websocket').server;
const clients = {};

function getRandomInt(max) {
    return Math.floor(Math.random() * Math.floor(max));
}

var server = http.createServer(function (request, response) {
    console.log((new Date()) + ' Received request for ' + request.url);
    response.writeHead(404);
    response.end();
});

server.listen(8080);
const wsServer = new WebSocketServer({
    httpServer: server
});
wsServer.on('request', function (request) {
    const connection = request.accept(null, request.origin);
    connection.on('message', function (message) {
        console.log('Received Message:', message.utf8Data);
        msgJson = JSON.parse(message.utf8Data);
        try {
            clients[msgJson['name']] = connection;
        } catch (e) {
            console.error(e);
        }
    });
    connection.on('close', function (reasonCode, description) {
        for (const cli in clients) {
            try {
                clients[cli].sendUTF('ping')
            } catch (e) {
                clients[cli].pop();
            }
        }
    });
});

const notifyWebsocketClient = (client) => {
    const newElem = {};

    newElem['X'] = getRandomInt(1920);
    newElem['Y'] = getRandomInt(1080);
    newElem['rotation'] = getRandomInt(180);
    clients[client].sendUTF(JSON.stringify(newElem));
};

exports.notifyWebsocketClient = notifyWebsocketClient;
