const WebSocket = require('ws');


const wss = new WebSocket.Server(
    {
        port: 4000,
        host: 'localhost'
    }
);

wss.on('connection', (ws) =>
{
    let clientData;
    ws.on('message', (data) =>
    {
        clientData = JSON.parse(data);
        console.log('data from client: ', clientData);
    });

    let countOfMessage = 0;

    setInterval(() =>
    {
        ws.send(JSON.stringify(
            {
                id: countOfMessage++,
                client: clientData.client,
                data: new Date().toISOString(),
            }
        ));
    }, 5000);
});

wss.on('error', (e) =>
{
    console.log('err: ', e);
});