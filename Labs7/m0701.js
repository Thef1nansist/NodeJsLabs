const url = require('url');
const fs = require('fs');
const path = require('path');

const mimeDictionary = {
    '.html' : 'text/html',
    '.css' : 'text/css',
    '.js' : 'text/javascript',
    '.png' : 'image/png',
    '.docx' : 'application/msword',
    '.json' : 'application/json',
    '.xml' : 'application/xml',
    'mp4' : 'video/mp4'
}

module.exports.get_handler = (dir, res, req) =>
{
    let urlObj = url.parse(req.url);
    let filePath = dir + urlObj.pathname;
    let fileExtension = path.parse(urlObj.pathname).ext;

    if (req.method === 'GET') 
    {
        if(fileExtension === '')
        {
            res.writeHead(404);
            res.end('Wrong file path');
            return;
        }

        if (fs.existsSync(filePath))
        {
            let mime = mimeDictionary[fileExtension];

            fs.stat(filePath, (err, stats) => 
            {
                if(err != null)
                {
                    console.log(err);
                }

                let file = fs.readFileSync(filePath);
                
                    res.writeHead(200, {
                    "Content-Type": mime,
                    "Content-Length": stats.size,
                    "Access-Control-Allow-Origin": "*"
                });

                res.end(file, 'binary');
            })
            return
        }
           res.writeHead(404)
        res.end('File does not exists')
    }
        res.writeHead(405)
    res.end('GET requests only')
}