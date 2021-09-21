var url = require('url');
var http = require('http');
var fs = require('fs');

function factorial(k) {
    let fact = 1;
for( i = 1; i<k; k--){
fact *= k;
}
return fact;
}

function factorial_async(k, cb) {
     let fact = 1;
    
     setImmediate(() => {
         let fact = factorial(k);
         cb(fact);
     }, 0)

}

http.createServer(function(req,res){
  let parseUrl = url.parse(req.url,true);
  let queryObj = parseUrl.query;
    if (req.method == 'GET') {
        if (parseUrl.pathname === '/fact'){
            res.writeHead(200, {'Content-type':'text/json'});
            let k = queryObj.k;
            factorial_async(k, (fact) =>{
                res.end(JSON.stringify({k:k,fact: fact}));  
            })
            
        }

        if (parseUrl.pathname === '/') {
            let path = '03-02.html';

            fs.stat(path,(err, stat) => {
                if (err != null) {
                    console.log(err);
                }
                let dataText = fs.readFileSync(path);
                console.log(dataText);
                res.writeHead(200,{"Content-Type": "text/html; charset=utf-8", "Content-Length": stat.size});
                res.end(dataText,'binary');
            })
        }
    }

}).listen(3000);

