var http = require("http");

http.createServer((request, response) => {
  if (request.method === 'GET') {
    response.writeHead(200, {
      'Content-Type': 'text/html; charset=utf-8'
    });
    response.end("test");
  }
}).listen(3000);

let options = {
    host: 'localhost',
    path:'/',
    port: 3000,
    method: "GET"
}

const req = http.request(options, (res) =>
{
    console.log('http.request:method = ', req.method);
    console.log('http.request:response = ', res.statusCode);
    console.log('http.request:statusMessage = ', res.statusMessage);
    console.log('http.request:remoteAddress = ', res.socket.remoteAddress);
    console.log('http.request:remotePort = ', res.socket.remotePort);

    let data = '';

    res.on('data', (chunk) =>
    {
        console.log('http.request: data: body =', data += chunk.toString('utf8'));
    });
    res.on('end', () =>
    {
        console.log('http.request: end: body =', data);
    });

});

req.on('error', (e) =>
{
    console.log('http.request: error:', e.message);
});
req.end();