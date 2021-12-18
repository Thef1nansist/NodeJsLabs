const fs = require("fs");
const url = require("url");

const errorHandler = require("./errorHandler");
const readFile = require("./readFile");
const pathToFile = "./file/StudentList.json";

module.exports = (req, resp) =>
{
    let path = url.parse(req.url).pathname;
    
    
    switch(path)
    {
        case '/':
            {
            let objJSON = '';
            let flag = false;
            console.log(path);
            req.on('data', function (data)
            {
                objJSON += data;
            });
          
            req.on('end', function ()
            {
                let fileJSON = JSON.parse(readFile());
                let id = JSON.parse(objJSON)[0].id;
                
                let i = 0;
                fileJSON.forEach((item) => {
                    if (item.id === id)
                    {
                        fileJSON[i] = JSON.parse(objJSON)[0];
                        fs.writeFile(pathToFile, JSON.stringify(fileJSON), (e) =>
                        {
                            if (e) {
                            console.log('ERROR');
                            errorHandler(request, response, e.code, e.message);
                            }
                            else {
                            
                            console.log('Cтудент был обновлён');
                            resp.writeHead(200, {'Content-Type': 'application/json; charset=utf-8'});
                            resp.end(JSON.stringify(JSON.parse(objJSON)));
                            }
                        })
                        flag = true;
                    }
                    i++;
                });
                if(!flag)
                {
           
                    errorHandler(req, resp, 2, `Студента нет с таким id: ${id}`);
                }
            })
        break;
        }
        default:
            {
                resp.writeHead(404, {
                "Content-Type": "application/json; charset=utf-8",
                });
                resp.end(`error 404`);
            }
    }
}