const fs = require('fs');
const url = require('url');

const errorHandler = require("./errorHandler");
const readFile = require("./readFile");
const pathToFile = "./file/StudentList.json";

module.exports = (req, resp) =>
{
    let path = url.parse(req.url).pathname;
    console.log(path);
    let backupFlag = /\/backup\/\d{8}/.test(path);

    if (backupFlag)
    {
        let flag = false;
        console.log('tut');
        fs.readdir("./backup", (err, files) => {
        for (let i = 0; i < files.length; i++) {
        if (files[i].match(/\d{8}/)[0] > Number(path.match(/\d+/))) {
          flag = true;
          fs.unlink(`./backup/${files[i]}`, (e) => {
            if (e) {
              console.log("Error");
              errorHandler(req, resp, e.code, e.message);
            } else {
              console.log("Ok");
              resp.end("Ok");
            }
            });
            }
        }
        if (!flag) {
            errorHandler(req, resp, 3, "Нет файлов");
        }
            });
    }
    else if((/\/\d+/.test(path)))
    {
        let fileJSON = JSON.parse(readFile());
        let id = Number(path.match(/\d+/)[0]);

        for(let i = 0; i < fileJSON.length; i++)
        {
            console.log(fileJSON[i].id);
            if(fileJSON[i].id == id)
            {
                resp.setHeader("Content-Type", "application/json");
                resp.write(JSON.stringify(fileJSON[i]));
                delete fileJSON[i];
                fileJSON = fileJSON.filter( function (x)
                {
                    return x !== null;
                })
                console.log('delete succsesfully');
            }
        }
            if (!resp.hasHeader("Content-Type"))
            {
                errorHandler(req, resp, 1, `Студент с id ${id} не существует`);
            } 
            else 
            {
                fs.writeFile(pathToFile, JSON.stringify(fileJSON), (e) => 
                {
                    if (e) 
                    {
                        console.log("Error");
                        errorHandler(req, resp, e.code, e.message);
                    } 
                    else 
                    {
                        resp.end();
                    }
                });
            }       
    }
    else {
        resp.writeHead(404, {
        "Content-Type": "application/json; charset=utf-8",
        });
        resp.end(`error 404`);
    }
}
