const udp = require('dgram');

const PORT = 2000;

let client = udp.createSocket('udp4');

client.on('message', (data) =>
{
    console.log(`Received message from server: ${data.toString()}`);
})
.on('error', (e) =>
{
    console.log(e);
    client.close();
});

client.send('Hellow Im client', PORT, 'localhost', (err) =>
{
    if(err)
    {
        client.close();
    }
    else
    {
        console.log('Message sent');
    }
})