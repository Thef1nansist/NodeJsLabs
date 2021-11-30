const http = require("http");
const url = require("url");
const querystring = require('querystring');
const fs = require("fs");
const path = require("path");
const {parseString} = require("xml2js");
const xmlbuilder = require('xmlbuilder');
const multiparty = require('multiparty')

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}


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
    if (req.method === "GET")
    {
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
                    
                    resp.end(`<br />server will close in 10 secund`);
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
                    resp.setHeader('moy-header', 'moe znachenie');

                    let reqHeaders = ''
                    for (let key in req.headers) {
                        reqHeaders += `${key}: ${req.headers[key]}\n`;
                    }
                    
                    resp.end(`REQUEST:\n${JSON.stringify(reqHeaders, null, "  ")}\nRESPONSE: \n${JSON.stringify(resp.getHeaders())}`);
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
                    sleep(10000).then(() => resp.end());
                   
                    break;
                }
            case '/req-data':
                {
                    let buf = '';
                    req.on('data', (data) =>
                    {
                        console.log('data', data.length);
                        buf += data;
                    })
                    req.on('end', () =>
                    {
                        console.log('data =', buf.length);
                    })
                    break;
                }
            case '/resp-status':
                {
                    let statusCode = Number(queryObj.code);
                    let statusMessage = queryObj.mess;
          
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
                    let file = fs.readFileSync('./index.html');

                    resp.writeHead(200, {'Content-Type': 'text/html'});
                    resp.end(file);
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
                        let filePath = directory + '/' + fileName;
                    
                        if (fs.existsSync(filePath))
                        {
                            console.log(fileName);
                            let fileExt = path.parse(fileName).ext;
                            let mime = mimeDict[fileExt];

                            fs.stat(filePath,(err, stats) => {
                                if (err != null){
                                    console.log(err);
                                }

                                let file = fs.readFileSync(filePath);
                                console.log(file);
                                resp.writeHead(200, {
                                "Content-Type": mime,
                                "Content-Length": stats.size,
                                "Access-Control-Allow-Origin": "*"
                                });
                                resp.end(file, "binary");
                                console.log("end");
                                return;
                            })
                        }
                        else
                        {
                            resp.writeHead(404);
                            resp.end('ERROR 404');
                            return;
                    }
                }
                return;
            }
        }
    }
    else if (req.method === "POST")
    {
        switch (urlObj.pathname)
        {
            case '/formparameter':
                {
                    let result = '';
                    let dataFromReq = '';
                    req.on('data', (data) =>
                    {
                        dataFromReq += data;
                    });
                    req.on('end', () => 
                    {
                        result += `<br/>`;
                        let data = querystring.parse(dataFromReq);
                        for(let key in data)
                        {
                            result += `${key} = ${data[key]} <br/>`
                        };
                        resp.writeHead(200, {'Content-Type' : 'text/html; charset="UTF-8"'});
                        resp.write('Params: ');
                        resp.end(result);
                    })
                    break;
                }
                case '/json':
                    {
                        let result = '';
                        req.on('data', (data) => 
                        {
                            result += data;
                        });
                        req.on('end', () =>
                        {
                            try
                            {
                                console.log('sho');
                                let queryObj = JSON.parse(result);
                                //console.log(JSON.stringify(queryObj));
                                result = {
                                    x_plus_y: queryObj.x + queryObj.y,
                                    ___comment: queryObj.___comment,
                                    Concation_s_o: `${queryObj.s}: ${queryObj.o.surname}, ${queryObj.o.firstname}`,
                                    Length_m: queryObj.m.length
                                }
                                resp.writeHead(200, {'Content-Type' : 'application/json; charset="UTF-8"'});
                                resp.end(JSON.stringify(result, null, '  '));
                            }
                            catch (message)
                            {
                                resp.writeHead(400);
                                resp.end("ERROR 404" + `${message}`);
                            }
                        })
                        break;
                    }
                case '/xml':
                    {
                        
                        let result = '';
                        let objXml = null;

                        req.on('data', (data) =>
                        {
                            result += data;
                        });
                        
                        req.on('end', () =>
                        {
                            try
                            {
                                console.log("sho");
                                parseString(result, (err, res) => 
                                {
                                    if (err)
                                    {
                                        console.log(err)
                                    }
                                    objXml = res;
                                });
                                    let sum = 0;
                                    let concatStr = '';
                                    let id = objXml.request.$.id;

                                    objXml.request.x.map((e,i) =>
                                    {
                                        sum += Number(e.$.value);
                                        console.log(sum);
                                    });

                                     objXml.request.m.map((e,i) =>
                                    {
                                        concatStr += e.$.value;
                                        console.log(concatStr);
                                    });

                                    let xmlDoc = xmlbuilder.create('response', ).att('request', id)
                                    xmlDoc.ele('sum', {'element': 'x', 'result': sum})
                                    xmlDoc.ele('concat', {'element': 'm', 'result': concatStr})

                                    resp.writeHead(200, {'Content-Type': 'application/xml'})
                                    resp.end(xmlDoc.end({pretty:true}));
                            }
                            catch (message)
                            {
                                resp.writeHead(400);
                                resp.end('Error 400' + message);
                            }
                        })
                        break;
                    }
                    case "/upload":
                        {
                            let result = '';
                            let form = new multiparty.Form({uploadDir:'./static'});
                            form.on('field', (name, value) =>
                            {
                                console.log(name, value);
                                result += `${name} = ${value}\n`; 
                            });
                            
                            form.on('file', (name, file) =>
                            {
                                result += `${name} = ${file.originalFilename} : ${file.path}`;
                            });

                            form.on('error', (err) =>
                            {
                                resp.end(err);
                            })
                            
                            form.on('close', () =>
                            {
                                resp.end(result);
                            });

                            form.parse(req);
                            break;
                        }
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