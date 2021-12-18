module.exports = (req, resp, code, message) =>
{
    resp.writeHead(500, {'Content-Type': 'application/json; charset=utf-8'});
    resp.end(`{"error": "${code}", "message": "${message}"}`);
}