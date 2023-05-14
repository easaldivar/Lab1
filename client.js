const net = require('net');
const fs = require('fs');

function sendFile(filePath) {
    // Se obtiene el nombre del archivo
    const fileName = filePath.substring(filePath.lastIndexOf('/') + 1);

    //definirle a filesize el tamaño del archivo
    const fileSize = fs.statSync(filePath).size;

    // Conexion al servidor
    const client = net.createConnection({ port: 8080 }, () => {
        console.log('[CL] Conectado al servidor');

        // Se envia el nombre de archivo
        client.write(fileName);

        // Se envia el tamaño del archivo
        client.write(fileSize.toString());

        // Se lee el archivo y se envia al servidor
        const fileStream = fs.createReadStream(filePath);
        fileStream.on('data', (data) => {
            client.write(data);
        });
        
        // Enviado el archivo se cierra la conexion
        fileStream.on('end', () => {
            client.end();
            console.log('[CL] Archivo enviado');
        });

        // En caso de error se cierra la conexion
        fileStream.on('error', (error) => {
            console.error('[CL] Error en la transferencia:', error);
            client.end();
        });

    });
    // Cierre de conexion
    client.on('end', () => {
        console.log('[CL] Cierre de conexion');
        client.end();
    });

    client.on('error', (error) => {
        console.error('Error en la transferencia:', error);
        client.end();
    });
}

module.exports.sendFile = sendFile;