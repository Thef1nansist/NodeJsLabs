const http = require('http');
const fs = require('fs');

http.createServer(function(request, response) {
  response.writeHead(200, {
    'Content-Type': 'text/plain; charset=utf-8'
  });
  let png = '';
  request.on('data', (chunk) => {
    png += chunk.toString();
    request.on('end', () => {
      console.log(png.length)
    });
  });
}).listen(3000);

let options = {
  host: 'localhost',
  path: '/',
  port: 3000,
  method: 'POST',
  headers: {
    'content-type': 'multipart/form-data;'
  }
};

let bound = '';
let body = '';

let req = http.request(options, (res) => {
  let responseData = '';
  res.on('data', (chunk) => {
    responseData += chunk;
  });
  res.on('end', () => {
    console.log(Buffer.byteLength(responseData));
  })
});
req.write(body);

let stream = new fs.ReadStream('mePhoto.png');
stream.on('data', (chunk) => {
  req.write(chunk);
  console.log(Buffer.byteLength(chunk));
}).on('end', () => {
  req.end(`\r\n${bound}\r\n`);
});