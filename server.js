const net = require('net');
const fs = require('fs');
const port = 8080;

const server = net.createServer((socket) => {
  console.log('[SV] Cliente conectado');

  let fileName = '';
  let fileData = Buffer.alloc(0);

  socket.on('data', (data) => {
    if (!fileName) {
      // Nombre del archivo
      fileName = data.toString();
      console.log('[SV] Nombre archivo recibido:', fileName);
    } else {
      // Se reciben los datos del archivo
      fileData = Buffer.concat([fileData, data]);
    }
  });

  socket.on('end', () => {
    if (fileName && fileData.length > 0) {
      // Se guarda el archivo
      fs.writeFile('received_' + fileName, fileData, (err) => {
        if (err) {
          console.error('[SV] ERROR:', err);
        } else {
          console.log('[SV] Archivo guardado:', fileName);
        }
      });
    } else {
      console.log('[SV] Archivo incompleto');
    }

    // Cierre de conexion
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