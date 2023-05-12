const fs = require('fs');
const server = require('./server');
const client = require('./client');

client.sendFile('files/test.txt');
client.sendFile('files/robsito.jpeg');
