const net = require('net');

let HOST = '127.0.0.1';
let PORT = 2000;

let client = new net.Socket();

client.connect(PORT, HOST, () => 
{
    console.log(`Client connected: ${client.remoteAddress} : ${client.remotePort}`);
});

client.write('Hellow Im client!');

client.on('data', data =>
{
    console.log(`Received message from server: ${data.toString()}`);
    client.destroy();
});

client.on('close', () =>
{
    console.log('Client closed');
});

client.on('error', (e) =>
{
    console.log('Client error: ', e);
});