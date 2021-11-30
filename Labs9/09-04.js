const http = require('http');
const query = require('querystring');

http.createServer((req, resp) =>
{
    let result = '';
    req.on('data', (chunk) =>
    {
        result += chunk;
    });
    req.on('end', () =>
    {
       resp.writeHead(200, {
      'Content-type': 'application/json; charset=utf-8'
    });
    
    result = JSON.parse(result);
    let jsonRes = {};
    jsonRes.__comment = 'Resp: ' + result.__comment;
    jsonRes.x_plus_y = result.x + result.y;
    jsonRes.Concatenation_s_o = result.s + ' ' + result.o.surname + ' ' + result.o.name;
    jsonRes.Length_m = result.m.length;

    resp.end(JSON.stringify(jsonRes));
    })
}).listen(3000);

let params = JSON.stringify({
  __comment: "test",
  x: 2,
  y: 3,
  s: "Student:",
  m: [1, 2, 3],
  o: {
    surname: "Savchenko",
    name: "Vladuk"
  }
});

let options = {
    host: 'localhost',
    path: '/',
    port: 3000,
    method: 'POST',
    headers: {
        'Content-Type' : 'application/json',
        'Accept' : 'application/json'
    }
};

const request = http.request(options, (response) =>
{
   console.log('Status:', response.statusCode);
    let data = '';
    response.on('data', (chunk) =>
    {
        console.log(data += chunk.toString('utf-8'));
    });
    response.on('end', () => {
    console.log(data);
    console.log(JSON.parse(data));
  });
});

request.on('error', (e) =>
{
    console.log('http.request: error:', e.message);
});
request.end(params);

