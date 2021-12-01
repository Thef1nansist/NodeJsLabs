const http = require('http');
const fs = require('fs');

http.createServer((request, response) => {
  response.writeHead(200, 
  {
    'Content-Type': 'text/plain; charset=utf-8'
  });
  let txt = '';
  request.on('data', (chunk) => {
    txt += chunk.toString();
    response.end(txt);
  });
}).listen(3000);

let bound = 'startFile/endFile';
let body = `${bound}\r\n`;
body += fs.readFileSync('MyFile.txt');
body += `\r\n${bound}\r\n`;

let options = {
  host: 'localhost',
  path: '/',
  port: 3000,
  method: 'POST',
  headers: {
    'content-type': 'multipart/form-data;'
  }
};

let request = http.request(options, (responce) => {
  let responseData = '';
  responce.on('data', (chunk) => {
    console.log(responseData += chunk.toString('utf-8'));
  });
});

request.end(body);