const http = require('http');
const url = require('url');
const query = require('querystring');

http.createServer((req, res) =>
{
    res.writeHead(200,
    {
        'Content-Type' : 'text/html; charset = utf8'
    });
    res.end(`x = ${url.parse(req.url, true).query.x}, y = ${url.parse(req.url, true).query.y}`);
}).listen(3000);

let params = query.stringify({x : 3, y : 4});
let path = `/?${params}`;

console.log('params', params);
console.log('path', path);

let options = {
    host: 'localhost',
    path: path,
    port: 3000,
    method: 'GET'
}

const req = http.request(options, (res) => 
{
    console.log('Status:', res.statusCode);
    let data = '';
    res.on('data', (chunk) =>
    {
        console.log(data += chunk.toString('utf-8'));
    });
});

req.on('error', (e) =>
{
    console.log('http.request: error:', e.message);
});
req.end();

