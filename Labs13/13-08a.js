const net = require('net');

const HOST = '127.0.0.1';
const PORT = 50000;

let client = new net.Socket();
let buffer = new Buffer.alloc(4);

client.connect(PORT, HOST, () => {
    console.log(`Client connected: ${client.remoteAddress}:${client.remotePort}`);

    let X = 0;
    let input = process.stdin;
    input.on('data', data => {
        X = data;
        setInterval(() => {
            client.write((buffer.writeInt32LE(X, 0), buffer));
        }, 1000);
    });
});


client.on('data', data => {
    console.log(`Client data: ${data.toString()}`);
});

client.on('close', () => {
    console.log('Client closed');
});

client.on('error', (e) => {
    console.log('Client error: ', e);
});