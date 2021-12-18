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
            console.log(path);
            req.on('data', function (data)
            {
                objJSON += data;
            });
          
            req.on('end', function ()
            {
                let fileJSON = JSON.parse(readFile());
                let id = JSON.parse(objJSON)[0].id;
                console.log(id);
                console.log(fileJSON[0].id);
                let flag = true;
                fileJSON.forEach((item) => {
                    if (item.id === id)
                    {
                        flag = false;
                    }
                });
                console.log(flag);
                if (flag)
                {
                    fileJSON.push(JSON.parse(objJSON)[0]);
                    fs.writeFile(pathToFile, JSON.stringify(fileJSON), (e) =>
                    {
                        if(e)
                        {
                            console.log("Error");
                            errorHandler(req, resp, e.code, e.message);
                        }
                        else
                        {
                            console.log("Добавлен студент");
                            resp.writeHead(200, {
                            "Content-Type": "application/json; charset=utf-8",
                            });

                            resp.end(JSON.stringify(JSON.parse(objJSON)));
                        }
                    })
                }
                else
                {
                    errorHandler(req, resp, 2, `Exists student with ${id}`)
                };
            })
        break;
        }
        case '/backup':
        {
            let date = new Date();
            fs.copyFile(pathToFile,
                 `./backup/${date.getFullYear()}${date.getMonth() + 1}${date.getDate()}_StudentList.json`,
                 (e) =>
                 {
                     if (e) {
                        console.log("Error");
                        errorHandler(req, resp, e.code, e.message);
                        } else {
                        console.log("Копия была создана");
                        resp.end("Копия была создана");
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