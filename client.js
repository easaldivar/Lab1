const net = require('net');
const fs = require('fs');
const port = 8080;
const host = 'localhost'; // replace with the server's IP if it's not local

const client = new net.Socket();
const fileStream = fs.createReadStream('robsito.jpeg');

client.connect(port, host, () => {
    console.log('Connected to server');
    fileStream.on('readable', () => {
        let chunk;
        while (null !== (chunk = fileStream.read())) {
            console.log('Sending data...');
            client.write(chunk);
        }
    });

    fileStream.on('end', () => {
        console.log('Data transfer completed');
        client.end();
    });
});

client.on('close', () => {
    console.log('Connection closed');
});

client.on('error', (err) => {
    console.error('An error occurred:', err);
});