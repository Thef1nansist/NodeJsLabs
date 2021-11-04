var http = require("http");
var nodemailer = require("nodemailer");
var url = require("url");
var fs = require("fs");
const {parse} = require('querystring');


async function main(user, pass, to) {
  // create reusable transporter object using the default SMTP transport
  let transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 465,
    secure: true, // true for 465, false for other ports
    auth: {
      user: user, // generated ethereal user
      pass: pass, // generated ethereal password
    },
  })
  
  // send mail with defined transport object
  let info = await transporter.sendMail({
    from: 'biba2000@gmail.com', // sender address
    to: to, // list of receivers
    subject: 'Hello ✔', // Subject line
    text: 'Hello world?', // plain text body
    html: '<b>Hello world?</b>', // html body
  })
}

let http_handler = (req, resp) => {
    resp.writeHead(200, {'Content-Type': 'text/html; charset=utf-8'});

    if (url.parse(req.url).pathname === '/' && req.method === 'GET') {
        resp.end(fs.readFileSync('./06-02.html'));
    }
    else if (url.parse(req.url).pathname === '/api/sendmail' && req.method === 'POST') {
        let body = '';
        req.on('data', chunk => {body += chunk.toString();});
        req.on('end', () => {
            let parm = parse(body);
            main(parm.user, parm.pass, parm.to).then(() => {
                resp.end('Ok');
            }).catch(reason => {
                resp.end(reason.toString())
            });
        })
    }
    else 
    {
        resp.end('<h1> Not support</h1>');
    }
}

let server = http.createServer(http_handler);
server.listen(3000);
console.log('Server running at 3000');


