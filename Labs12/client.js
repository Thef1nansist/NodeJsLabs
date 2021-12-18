const rpcWSS = require('rpc-websockets').Client;
const client = new rpcWSS("ws://localhost:4000");

client.on('open', () =>
{
    client.subscribe('change')
    .then( () =>
    {
        console.log("Произошла подписка");
    });
    client.on('change', () =>
    {
        console.log('File was updated');
    })
})