const WebSocket = require('ws');

const ws = new WebSocket('ws://localhost:4000');

var param = process.argv[2];
let clientName = typeof param == 'undefined' ? 'Vladik' : param;
ws.on('open', () =>
{
    ws.on('message', (data) =>
    {
        data = JSON.parse(data);
        console.log('data on message: ', data);
    });

    setInterval(() =>
    {
        ws.send(
            JSON.stringify({
                client: clientName,
                data: new Date().toISOString()
            })
        );
    }, 3000);
});

ws.on("error", (e) => {
  console.log("error", e);
});