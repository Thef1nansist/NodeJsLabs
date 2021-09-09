var http = require('http');
var fs = require('fs');

let h = (r) => {
    let rc = '';
    for(key in r.headers) 
    rc += '<h3>' + key + ':' + r.headers[key] + '</h3>';
    return rc;

}

http.createServer(function (request, response){
let html = fs.readFileSync('./index.html');
response.writeHead(200,{'Content-Type':'text/html;charset=utf-8'});
response.end(html);
 
}).listen(3000);    


console.log('Server running')