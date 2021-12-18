const url = require('url');
const fs = require('fs');

const errorHandler = require('./errorHandler');
const readFile = require('./readFile');

module.exports = (req, resp) => 
{
    let path = url.parse(req.url).pathname;
    console.log(path);

    let reg = path.search('\/[1-9]+');
    

    switch(path)
    {
        case '/':
        {
            resp.setHeader('Content-Type', 'application/json; charset=utf-8');
            console.log(path);
            resp.end(readFile());
        break;
        }
        case '/backup': 
        {
            fs.readdir('./backup', (err, files) => 
            {
                resp.setHeader('Content-Type', 'application/json');
                let json = [];
                for (let i = 0; i < files.length; i++) 
                {
                    json.push({
                        id: i,
                        name: files[i]
                    });
                }

                resp.end(JSON.stringify(json));
                console.log(files.length);
            });
        break;
        }
        default:
        {
            if (reg != -1)
            {

            let fileJSON = readFile();
            let id = Number(path.match(/\d+/)[0]);
            JSON.parse(fileJSON).forEach(item =>
                {
                    if (item.id === id)
                    {
                        resp.setHeader('Content-Type', 'application/json');
                        resp.write(JSON.stringify(item));
                    }
                });
            if(!resp.hasHeader('Content-Type'))
            {
            errorHandler(req, resp, 1, `Студент с id ${id} не существует`);
            };
            resp.end();
            }
            else
            {
            resp.writeHead(404, {'Content-Type': 'application/json; charset=utf-8'});
            resp.end(`error 404`);
            }
        break;
        }
    }
}