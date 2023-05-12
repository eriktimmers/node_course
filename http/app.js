const http = require('http');

const server = http.createServer((req, resp) => {
    if (req.url === '/') {
        resp.write('Hello World!');
        resp.end();
    }

    if (req.url === '/api/courses') {
        resp.write(JSON.stringify([1, 2, 3]));
        resp.end();
    }
});

// const server = http.createServer();
// server.on('connection', (socket) => {
//     console.log('New message...');
// });

server.listen(3000);

console.log('listen on port 3000');