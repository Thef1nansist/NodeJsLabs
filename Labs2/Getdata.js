var http = require('http');
var fs = require('fs');

http.createServer(function(request,response){
    let html = fs.readFileSync('./index.html');
    if(request.method == 'GET'){

        if(request.url === '/api/name')
        {
        
        const fname = 'text.txt';
        
            
                fs.stat(fname,(err,data)=> {
                    if(err) {
                        console.log('err:', err);
                    }
                    else {
                        text = fs.readFile(fname, (err,data)=> {
                            response.writeHead(200,{'Content-Type':'text/plain;charset=utf-8'});
                            response.end(data,'binary');
                        });
                    }
                });
            
        }
        if(request.url ==='/xmlhttprequest'){
            const fname = 'xmlhttprequest.html';
            fs.stat(fname,(err,data)=> {
                    if(err) {
                        console.log('err:', err);
                    }
                    else {
                        text = fs.readFile(fname, (err,data)=> {
                            response.writeHead(200,{'Content-Type':'text/html;charset=utf-8'});
                            
                            response.end(data,'binary');
                        });
                    }
                });
            
        }
        if(request.url ==='/fetch'){
            const fname = 'fetch.html';
            fs.stat(fname,(err,data)=> {
                    if(err) {
                        console.log('err:', err);
                    }
                    else {
                        text = fs.readFile(fname, (err,data)=> {
                            response.writeHead(200,{'Content-Type':'text/html;charset=utf-8'});
                            
                            response.end(data,'binary');
                        });
                    }
                });
            
        }
        if(request.url ==='/jquery'){
            const fname = 'jquery.html';
            fs.stat(fname,(err,data)=> {
                    if(err) {
                        console.log('err:', err);
                    }
                    else {
                        text = fs.readFile(fname, (err,data)=> {
                            response.writeHead(200,{'Content-Type':'text/html;charset=utf-8'});
                            
                            response.end(data,'binary');
                        });
                    }
                });
            
        }

    }
  
}).listen(3000, () => {
console.log('Server running');
})