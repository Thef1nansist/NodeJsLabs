const WebSocket = require('ws');

const wss = new WebSocket.Server(
    {
        host: 'localhost',
        port: 4000
    }
);

wss.on('connection', (ws) =>
{
    console.log('clients: ', wss.clients.size);
    let c = 0;
    ws.on('message', (data) =>
    {
        console.log('on message: ', data.toString());
    });
    setInterval(() =>
    {
        console.log('send message');
        ws.send(`server:  ${++c}`);
    }, 15000);
    setInterval(() =>
    {
        console.log('send ping: server ping');
        ws.ping('server ping');
    }, 5000);
    ws.on('pong', (data) =>
    {
        console.log("receive pong: ", data.toString());
    });
});

wss.on("error", (e) => {
  console.log("error ", e);
});
