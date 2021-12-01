const http = require('http');
const fs = require('fs');

http.createServer((request, response) => {
  response.writeHead(200, {
    'Content-Type': 'text/plain; charset=utf-8'
  });
  let stream = fs.createReadStream('MyFile.txt');
  stream.on('end', () => {
    response.end();
  });

  stream.pipe(response);
}).listen(3000);

let stream = fs.createWriteStream('MyFile2.txt');

let options = {
  host: 'localhost',
  path: '/',
  port: 3000,
  method: 'GET'
};

let req = http.request(options, (res) => {
  res.pipe(stream);
});
req.end();