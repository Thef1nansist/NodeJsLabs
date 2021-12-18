const udp = require('dgram');

const PORT = 2000;

let server = udp.createSocket('udp4');

server.on('message', (msg, rinfo) =>
{
    console.log(`Received message: ${msg.toString()}`);
    server.send('Echo => ' + msg, rinfo.port, rinfo.address, (e) =>
    {
        if (e)
        {
            server.close();
        }
    });
}).on('listening', () =>
{
    console.log(`Server PORT: ${server.address().port}`);
    console.log(`Server Address: ${server.address().address}`);
})
.on('close', () => console.log('Server closed'))
    .on('error', (err) => {
        console.log('Error: ' + err);
        server.close();
    });

server.bind(PORT);