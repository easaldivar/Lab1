const net = require('net');
const fs = require('fs');
const port = 8080;

const server = net.createServer((socket) => {
    console.log('Client connected');

    let fileStream = fs.createWriteStream('received_file');

    socket.on('data', (data) => {
        console.log('Data received');
        fileStream.write(data);
    });

    socket.on('end', () => {
        console.log('Data transfer completed');
        fileStream.end();
    });

    socket.on('error', (err) => {
        console.error('An error occurred:', err);
    });
});

server.listen(port, () => {
    console.log(`Server listening on port ${port}`);
});