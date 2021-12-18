const http = require('http');
const fs = require('fs');
const rpcWSS = require('rpc-websockets').Server;

const pathToFile = "./file/StudentList.json";

const getHandler = require("./getHandler");
const postHandler = require("./postHandler");
const putHandler = require("./putHandler");
const deleteHandler = require("./deleteHandler");

http.createServer((req, resp) =>
{
    switch(req.method)
    {
        case 'GET':
            getHandler(req, resp);
        break;
        case 'POST':
            postHandler(req, resp);
        break;
        case 'PUT':
            putHandler(req, resp);
        break;
        case 'DELETE':
            deleteHandler(req, resp);
        break;
    }
})
.listen(3000);

let server = new rpcWSS(
    {
        port: 4000,
        host: 'localhost',
        path: '/'
    }
);
server.event('change');

fs.watch(pathToFile, (eventType, filename) =>
{
    server.emit('change');
});