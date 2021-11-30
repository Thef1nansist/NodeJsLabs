const http = require('http');
const url = require('url');
const query = require('querystring');

http.createServer((req, res) =>
{
    let result = '';
    req.on('data', (data) =>
    {
        result += data;
    });
    req.on('end', () => 
    {
    res.writeHead(200,
    {
      'Content-type': 'text/html; charset=utf-8'
    });
    result = JSON.parse(result);
    res.end(`x = ${result.x}, y = ${result.y}, s = ${result.s}`);
    })
}).listen(3000);

let params = JSON.stringify({x : 3, y : 4, s: "svy"});

console.log('params', params);

let options = {
    host: 'localhost',
    path: '/',
    port: 3000,
    method: 'POST'
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
req.write(params);
req.end();

