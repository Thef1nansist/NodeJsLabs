var http = require('http');
var url = require('url');
var fs = require('fs');
var data = require('./DB');

var db = new data.DB;

db.on('GET', (req, resp) => {
    console.log('DB.get');
    resp.end(JSON.stringify(db.select()));
});

db.on('POST', (req, resp) => {
    console.log('DB.post');
    req.on('data', data => {
        let res = JSON.parse(data);
        res.id = Number(res.id);
        db.insert(res);
        resp.end(JSON.stringify(data));
    });
});

db.on('PUT', (req, resp) => {
    console.log("DB.put");
    req.on('data', data => {
        let res = JSON.parse(data);
        let flag = db.update(res);

        resp.end(flag ? 'completed' : 'not completed');
    });
});
db.on('DELETE', (req, resp) => {
    console.log("DB.delete");

    let queryData = url.parse(req.url, true).query;
    let id = queryData.id;
    let line = db.delete(id);
    console.log(line);
    resp.end(line !== undefined ? JSON.stringify(line) : 'Selected element was not found');
});

http.createServer(function (req, res) {
    switch (url.parse(req.url).pathname) {
        case '/':
            {
                fs.readFile('./04-02.html', (err, data) => {
                    if (err) {
                        throw err;
                    }
                    res.writeHead(200, { "Content-Type": "text/html; charset=utf-8" });
                    res.end(data);
                });
            }
            break;
        case '/api/db':
            {
                db.emit(req.method, req, res)
            }
            break;
        default:
            break;
    }
}).listen(3000);

