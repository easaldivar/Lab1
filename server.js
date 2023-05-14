const net = require('net');
const fs = require('fs');
const port = 8080;
const path = require('path');

const server = net.createServer((socket) => {
  console.log('[SV] Cliente conectado');

  let fileName = '';
  let fileSize = 0;
  let receivedSize = 0;
  let writeStream;


  socket.on('data', (data) => {
    if (!fileName) {
      // Nombre del archivo
      fileName = data.toString();
      console.log('[SV] Nombre archivo recibido:', fileName);
      // Crear un flujo de escritura de archivos
      const filePath = path.join(__dirname, "recieved_ " + fileName);
      writeStream = fs.createWriteStream(filePath);
      writeStream.on('error', (err) => {
        console.error(`[SV] Error al escribir en el archivo ${filePath}: ${err}`);
      });
      writeStream.on('finish', () => {
        console.log(`[SV] Archivo ${filePath} guardado.`);
      });
    } else if (fileSize === 0) {
      // Tamaño del archivo
      fileSize = parseInt(data.toString());
      console.log('[SV] Tamaño archivo recibido:', fileSize);
    } else {
      // Se reciben los datos del archivo
      receivedSize += data.length;
      writeStream.write(data);
      if (receivedSize === fileSize) {
        writeStream.end();
        console.log(`[SV] Archivo ${fileName} recibido completamente.`);
      }
    }
  });

  socket.on('end', () => {
    console.log('[SV] Cierre de conexion');
    socket.end();
  });

  socket.on('error', (error) => {
    console.error('[SV] Error de socket:', error);
  });
});

// Start sv
server.listen(port, () => {
  console.log('[SV] Servidor abierto en el 8080');
});