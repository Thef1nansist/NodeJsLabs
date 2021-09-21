// const prompt = require('prompt-sync')();
const http = require('http');


http.createServer(function(request, response) {
    
 response.contentType='text/html';
    response.write('<h1>norm</h1>');
    console.log('norm->');
    process.stdin.setEncoding('utf-8');
    var state = 'norm';
    var chang = 'norm';
    process.stdin.on('readable', ()=>{
        while((state = process.stdin.read()) != null){
         if (state.trim() == 'exit')
            {
                process.exit(0);
            }
            else if (state.trim() == 'norm') {
                chang[chang.length - 1] = '\0';
                process.stdout.write('reg = '+ chang+'->norm \n');
                process.stdout.write('norm->');
                response.write('<h1>norm</h1>');
                chang = state;
            }
            else if (state.trim() == 'stop') {
                chang[chang.length - 1] = '\0';
                process.stdout.write('reg = '+ chang+ '-> stop \n');
                process.stdout.write('stop->');
                response.write('<h1>stop</h1>');
                chang = state;
            }
            else if (state.trim() == 'test') {
                chang[chang.length - 1] = '\0';
                process.stdout.write('reg = '+ chang+ '-> test \n');
                process.stdout.write('test->');
                response.write('<h1>test</h1>');
                chang = state;
            }
            else if (state.trim() == 'idle') {
                chang[chang.length - 1] = '\0';
                process.stdout.write('reg = '+ chang+ '–> idle \n');
                process.stdout.write('idle->');
                response.write('<h1>idle</h1>');
                chang = state;
            }
            else {
                process.stdout.write(state)
            }
        }
    });
  
}).listen(3000);