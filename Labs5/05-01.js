var http = require('http');
var url = require('url');
var fs = require('fs');
var readline = require('readline');
var data = require('./DB');

var db = new data.DB;

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
    prompt: 'server ->'
});

let dataCollecting = false
let commits = 0
let requests = 0

let timeout = null
let statTimeout = null
let interval = null

process.stdin.unref();



let stat = {
    startTime: "",
    endTime: "",
    requests: 0,
    commits: 0
}

db.on('GET', (req, resp) => {

    if (dataCollecting) {
        requests++
    }
    console.log('DB.get');
    resp.end(JSON.stringify(db.select()));
});

db.on('POST', (req, resp) => {

    if (dataCollecting) {
        requests++
    }
    console.log('DB.post');
    req.on('data', data => {
        let res = JSON.parse(data);
        res.id = Number(res.id);
        db.insert(res);
        resp.end(JSON.stringify(data));
    });
});

db.on('PUT', (req, resp) => {

    if (dataCollecting) {
        requests++
    }
    console.log("DB.put");
    req.on('data', data => {
        let res = JSON.parse(data);
        let flag = db.update(res);

        resp.end(flag ? 'completed' : 'not completed');
    });
});
db.on('DELETE', (req, resp) => {
    if (dataCollecting) {
        requests++
    }
    console.log("DB.delete");

    let queryData = url.parse(req.url, true).query;
    let id = queryData.id;
    let line = db.delete(id);
    console.log(line);
    resp.end(line !== undefined ? JSON.stringify(line) : 'Selected element was not found');
});

const server = http.createServer(function (req, res) {
    req.socket.unref()
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
        case '/api/ss':
            {
                res.end(JSON.stringify(stat));
            }
        default:
            break;
    }
}).listen(3000)


rl.prompt();
rl.on('line', (line) => {
    let args = line.split(' ')
    switch (args[0]) {
        case 'sd':
            if (args[1]) {
                timeout = setTimeout(() => server.close(), args[1] * 1000)
            }
            else {
                clearTimeout(timeout)
            }
            break;
        case 'sc':
            if (args[1]) {
                interval = setInterval(() => {
                    db.commit()
                    if (dataCollecting) {
                        commits++
                    }
                }, args[1] * 1000).unref()
            }
            else {
                clearInterval(interval)
            }
            break
        case 'ss':
            if (args[1]) {
                stat.startTime = new Date().toISOString().slice(0, 10)
                requests = 0
                commits = 0
                dataCollecting = true

                statTimeout = setTimeout(() => {
                    commitStat()
                }, args[1] * 1000)
            }
            else {
                clearTimeout(statTimeout)

                commitStat()
            }
            break
        default:
            console.log(line);
            break
    }
    rl.prompt();
}).on('close', () => {
    server.close()
});

function commitStat() {
    stat.requests = requests
    stat.commits = commits
    stat.endTime = new Date().toISOString().slice(0, 10)

    requests = 0
    commits = 0
    dataCollecting = false
}