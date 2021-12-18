const net = require('net');

let HOST = '0.0.0.0';
let PORT = 2000;

net.createServer(socket => 
    {
        console.log(`Server connected: ${socket.remoteAddress} : ${socket.remotePort}`);

        socket.on('data', data => 
        {
            console.log(`Received message: ${data.toString()} `);
            socket.write(`Echo => ${data}`);
        });

        socket.on('error', e =>
        {
            console.log(`Server error: ${e}`);
        });

        socket.on('close', data =>
        {
            console.log('Server closed');
        })

    }).listen(PORT, HOST);