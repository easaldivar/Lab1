const net = require('net');
const fs = require('fs');
const crypto = require('crypto');

const algorithm = 'aes-256-cbc';
const password = 'YourSecurePassword'; // Deberian ser 32 bytes
const key = crypto.scryptSync(password, 'salt', 32); // Salt debe ser unica para cada usuario

function encrypt(data){
    const iv = crypto.randomBytes(16); // Generar un IV aleatorio seguro
    const cipher = crypto.createCipheriv(algorithm, key, iv);

    let encrypted = cipher.update(data);
    encrypted = Buffer.concat([encrypted, cipher.final()]);

    return Buffer.concat([iv, encrypted]); // Anteponer IV al archivo encriptado
}

async function sendFile(filePath) {
     // Se obtiene el nombre del archivo
     let fileName = filePath.substring(filePath.lastIndexOf('/') + 1);
     fileName = filePath.substring(filePath.lastIndexOf('\\') + 1);
 
     // Encrypt the file and write to a temporary file
     const fileData = fs.readFileSync(filePath);
     const encryptedData = encrypt(fileData);
     const tempFilePath = filePath + '.enc'; // Agrega la extensión .enc para el archivo encriptado
     fs.writeFileSync(tempFilePath, encryptedData);
 
     //definirle a filesize el tamaño del archivo
     const fileSize = fs.statSync(tempFilePath).size;
 
     // Conexion al servidor
     const client = net.createConnection({ port: 8080 }, async () => {
         console.log('[CL] Conectado al servidor');
 
         // Se envia el nombre de archivo
         client.write(fileName);

         await delay(1000);

         // Se envia el tamaño del archivo
         client.write(fileSize.toString());
         
         await delay(1000);

         // Se lee el archivo y se envia al servidor
        let sentSize = 0;
        const fileStream = fs.createReadStream(filePath);
        fileStream.on('data', (data) => {
            client.write(data);
            sentSize += data.length;
            // Barra de progreso custom
            let percent = Math.trunc((sentSize / fileSize) * 100);
            const emptyLength = 25 - Math.trunc(percent / 4);
            const progressBar = "█".repeat(Math.trunc(percent / 4)) + "░".repeat(emptyLength);

            process.stdout.clearLine();
            process.stdout.cursorTo(0);
            process.stdout.write('[' + progressBar + '] ' + percent + "%");
        });
        
        // Enviado el archivo se cierra la conexion
        fileStream.on('end', () => {
            client.end();
            console.log('[CL] Archivo enviado');

            // Eliminar el archivo cifrado temporal
            fs.unlink(tempFilePath, (err) => {
                if (err) {
                    console.error('There was an error deleting the file:', err);
                } else {
                    console.log('Successfully deleted temporary file');
                }
            });
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
function delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}
module.exports.sendFile = sendFile;