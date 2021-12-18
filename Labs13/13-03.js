const net = require('net');

let HOST = '0.0.0.0';
let PORT = 2001;
let sum = 0;

let Server = net.createServer();

Server.on('connection', (socket) =>
    {
        console.log(`Server connected: ${socket.remoteAddress} : ${socket.remotePort}`);

        socket.on('data', (data) =>
        {
            console.log(`Server data: ${data.readInt32LE()}`);

            sum += data.readInt32LE();
            console.log(`Sum: ${sum}`);
        });

        let buffer = Buffer.alloc(4);
        let writer = setInterval( () => 
        {
            buffer.writeInt32LE(sum, 0);
            socket.write(buffer);
        }, 5000);

        socket.on('close', data =>
        {
            clearInterval(writer);
            console.log('Server disconected');
        })

        socket.on('error', (e) =>
        {
            console.log('Server error ', e);
        })
    });

Server.on('listening', () =>
{
    console.log(`Server connected: ${HOST} : ${PORT}`);
});
Server.on('error', (error) =>
{
    console.log(`Server Eroor: ${error}`);
});

Server.listen(PORT, HOST);
