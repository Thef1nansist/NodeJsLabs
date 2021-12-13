const fs = require("fs");
const WebSocket = require("ws");

const wss = new WebSocket.Server(
    {  
        port: 5000,
        host: 'localhost'
    });

wss.on('connection', (ws) =>
{
    const duplex = WebSocket.createWebSocketStream(ws, 
        {
            encoding: 'utf-8'
        });
    let rfile = fs.createReadStream(`./download/MyFile.txt`);
    rfile.pipe(duplex);
});