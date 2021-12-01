const http = require('http');
const xmlbuilder = require('xmlbuilder')
const parseString = require('xml2js').parseString;

http.createServer((request, responce) => {
  let data = '';
  request.on('data', (chunk) => {
    data += chunk;
  });
  request.on('end', () => {
    responce.writeHead(200, {
      'Content-type': 'text/xml'
    });
    parseString(data, (err, result) => {
      let xSum = 0;
      let mSum = '';
      result.request.x.forEach((p) => {
        xSum += parseInt(p.$.value);
      });
      result.request.m.forEach((p) => {
        mSum += p.$.value;
      });
      let xmlDoc = xmlbuilder.create('response').att('id', '1');
      xmlDoc.ele('result').att('value', xSum.toString()).up()
        .ele('concat').att('value', mSum.toString()).up();
      responce.end(xmlDoc.toString({
        pretty: true
      }));
    });
  });
}).listen(3000);


var parameters = xmlbuilder.create('request').att('id', '1');
parameters.ele('x').att('value', '1').up()
  .ele('x').att('value', '2').up()
  .ele('m').att('value', 'x').up()
  .ele('m').att('value', 'y').up()
  .ele('m').att('value', 'z').up();

var options =
{
    host: 'localhost',
    path: '/',
    port: 3000, 
    method: 'POST',
    headers:
    {
        'Content-Type' : 'text/xml',
        'Accept' : 'text/xml'
    }
}

const req = http.request(options, (res) =>
{
    console.log('Status:', res.statusCode);
    let data = '';
    res.on('data', (chunk) =>
    {
        data += chunk;
    });
    res.on('end', () =>
    {
        console.log(data);
        parseString(data, (err, str) =>
        {
            if (err)
            {
                console.log('xml parse error');
            }
            else 
            {
                console.log('str = ', str.response.result);
                console.log('str.result =', str.response.concat);
            }
        })
    })
})

req.on('error', (e) =>
 {
     console.log('error: ' + e.message);
 });

 req.end(parameters.toString({pretty: true}));

