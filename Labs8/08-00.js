const http = require("http");
const url = require("url");
const querystring = require('querystring');
const fs = require("fs");


const directory = "static";
let k = 0;
let c = 0;
let s = "";

const mimeDict = {
    '.html': 'text/html',
    '.txt': 'text/plain',
    '.css': 'text/css',
    '.js': 'text/javascript',
    '.png': 'image/png',
    '.docx': 'application/msword',
    '.json': 'application/json',
    '.xml': 'application/xml',
    '.mp4': 'video/mp4',
}


let server = http.createServer();

let http_handler = (req, resp) => 
{
    console.log(`request url: ${req.url}, #`, ++k);
    let urlObj = url.parse(req.url);
    let queryObj = querystring.parse(urlObj.query);
    console.log('after urlobj');

    switch(urlObj.pathname)
    {
        case '/':
            {
                resp.writeHead(200, {'Content-Type' : 'text/html; charset=utf-8'});
                s += `url = ${req.url}, req/resp # ${c} - ${k} <br />`;
                break;
            }
        case '/close':
            {
                setTimeout( () => server.close(),10000).unref();
                resp.end(`${s} <br />server will close in 10 secund`);
                break;
            }
         case '/connection':
            {
                let timeout = queryObj.set;
                console.log(timeout);
                if (timeout) 
                {
                    server.keepAliveTimeout = Number(timeout);
                    resp.end(`keepAliveTimeout = ${server.keepAliveTimeout}`);
                }
                else 
                {
                    resp.end(`keepAliveTimeout = ${server.keepAliveTimeout}`);
                }
                break;
            }
        case '/headers':
            {
            resp.setHeader('moy-header', 'moe znachenie')

            let reqHeaders = ''
            for (let key in req.headers) {
                reqHeaders += `${key}: ${req.headers[key]}\n`
            }

            // let respHeaders = ''
            // for(let key in resp.getHeaders())
            // {
            //     respHeaders += `${key}: ${resp.headers[key]}\n`
            // }
            
            // console.log(res.getHeaders())
            // console.log(resHeaders)
            resp.end(`REQUEST:\n${JSON.stringify(reqHeaders)}\nRESPONSE: \n${JSON.stringify(resp.headers)}`)
            break;
            }
        case '/parameter':
            {
                let numberX = Number(queryObj.x);
                let numberY = Number(queryObj.y);
                if (!isNaN(numberX) && !isNaN(numberY))
                {
                    let sum = numberX + numberY;
                    let dif = numberX - numberY;
                    let mult = numberX * numberY;
                    let qout = numberX / numberY;
                    resp.end(`sum:${sum}, dif:${dif}, mult:${mult}, qout:${qout}`);
                    return;
                }
                resp.writeHead(400);
                resp.end(`x || y != numbers`);
                break;
            }
        case '/socket':
            {
                resp.write(`Client Ip: ${req.socket.remoteAddress} \n`);
                resp.write(`Client Port: ${req.socket.remotePort}\n`);
                resp.write(`Server Ip: ${req.socket.localAddress} \n`);
                resp.write(`Server Port: ${req.socket.localPort}\n`);
                resp.end();
                break;
            }
        case '/req-data':
            {
                let buf = '';
                req.on('data', (data) =>
                {
                    console.log('data', data.toString());
                    buf += data;
                })
                req.on('end', () =>
                {
                    console.log('data =', buf);
                })
                break;
            }
        case '/resp-status':
            {
                console.log(queryObj);
                let statusCode = Number(queryObj.code);
                console.log(statusCode);
                let statusMessage = queryObj.mess;
                console.log(statusMessage);
          
                if (statusCode && statusMessage && !isNaN(statusCode)) {
                    resp.statusCode = statusCode;
                    resp.statusMessage = statusMessage;
                    resp.end("<h1>Parameters have been set successfully</h1>");
                } else {
                    resp.end("<h1>Parameters have been set incorrectly</h1>");
                }
                break;
            }
        case '/files':
            {
                fs.readdir(directory, (err, files) =>
                {
                    resp.setHeader('x-static-files-count', files.length);
                    resp.end();
                })
                break;
            }
        case '/upload':
            {
                let file = fs.readFileSync('./index.html')

                resp.writeHead(200, {'Content-Type': 'text/html'})
                resp.end(file)
                break;
            } 
        default:
            {
                let regParametrMatch = urlObj.pathname.match('^\/parameter\/(.+)\/(.+)$');
                console.log(regParametrMatch);
                if (regParametrMatch)
                {
                    let numberX = Number(regParametrMatch[1]);
                    let numberY = Number(regParametrMatch[2]);
                    console.log(numberY, numberX);

                    if (!isNaN(numberX) && !isNaN(numberY))
                    {
                        let sum = numberX + numberY;
                        let dif = numberX - numberY;
                        let mult = numberX * numberY;
                        let qout = numberX / numberY;
                        resp.end(`sum:${sum}, dif:${dif}, mult:${mult}, qout:${qout}`);
                        return;
                    }

                    resp.writeHead(400);
                    resp.end(urlObj.pathname);
                    return;
                }
                else if (urlObj.pathname.includes('/files/'))
                {
                    let fileName = urlObj.pathname.replace('/files/', '');
                    let filePath = dir + '/' + fileName;
                    
                    if (fs.existsSync(filePath))
                    {
                        let fileExt = path.parse(fileName).ext;
                        let mime = mimeDict[fileExt];

                        fs.stat(filePath,(err, stats) => {
                            if (err != null){
                                console.log(err);
                            }

                            let file = fs.readFileSync(filePath);
                            res.writeHead(200, {
                            "Content-Type": mime,
                            "Content-Length": stats.size,
                            "Access-Control-Allow-Origin": "*"
                            });

                            res.end(file, "binary");
                            return;
                        })
                    }
                }

                resp.writeHead(404);
                resp.end('ERROR');

                return;


            }

    }
}


server.on('connection', (socket) => 
{
console.log(`connection: server.keepAliveTimeout = ${server.keepAliveTimeout}`, ++c);
s+= `<h2> connection: # ${c} </h2>`;
});

server.on('request', http_handler);

server.listen(3000, (e) => 
{
    console.log('server-listen(3000)')
}).on('error', (e) => {
    console.log('server.listen(3000): error: ', e.code)
});