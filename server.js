const net = require("net");
const fs = require("fs");
const port = 8080;
const path = require("path");
const crypto = require('crypto');
const algorithm = 'aes-256-cbc';
const password = 'YourSecurePassword'; // Deberian ser 32 bytes
const key = crypto.scryptSync(password, 'salt', 32); // Salt debe ser unica para cada usuario

function decrypt(data){
  const iv = data.slice(0, 16); // Suponiendo que IV se antepone al archivo cifrado
  const content = data.slice(16); // El resto debe ser el contenido.

  const decipher = crypto.createDecipheriv(algorithm, key, iv);

  let decrypted = decipher.update(content);
  decrypted = Buffer.concat([decrypted, decipher.final()]);

  return decrypted;
}

const server = net.createServer((socket) => {
    console.log("[SV] Cliente conectado");

    let receivedSize = 0;
    let writeStream;

    let fileName = "";
    let fileSize = 0;

    function saveFile(fileName, fileSize) {
        return new Promise((resolve, reject) => {
            const filePath = path.join(__dirname, "received_" + fileName);
            const writeStream = fs.createWriteStream(filePath);

            writeStream.on('error', (err) => {
                reject(`[SV] Error al escribir en el archivo ${filePath}: ${err}`);
            });

            writeStream.on('finish', () => {
                resolve(filePath);
            });

            socket.on('data', (data) => {
                writeStream.write(data);
                receivedSize += data.length;

                // Barra de progreso custom
                let percent = Math.trunc((receivedSize / fileSize) * 100);
                const emptyLength = 25 - Math.trunc(percent / 4);
                const progressBar = "█".repeat(Math.trunc(percent / 4)) + "░".repeat(emptyLength);

                process.stdout.clearLine();
                process.stdout.cursorTo(0);
                process.stdout.write('[' + progressBar + '] ' + percent + "%");

                if (receivedSize === fileSize) {
                  writeStream.end();
                  console.log(`\n[SV] Archivo ${fileName} recibido completamente.`);
          
                  // Leer el archivo, descifrarlo y luego volver a escribirlo
                  const fileData = fs.readFileSync(filePath);
                  const decryptedData = decrypt(fileData);
                  fs.writeFileSync(filePath, decryptedData);
          
                  console.log(`[SV] Archivo ${filePath} desencriptado.`);
                }
            });
        });
    }

    socket.on('data', (data) => {
        if (!fileName) {
            // Nombre del archivo
            fileName = data.toString();
            console.log('[SV] Nombre archivo recibido:', fileName);
        } else if (!fileSize) {
            // Tamaño del archivo
            fileSize = parseInt(data.toString());
            console.log('[SV] Tamaño archivo recibido:', fileSize);

            saveFile(fileName, fileSize)
                .then((filePath) => {
                    console.log(`[SV] Archivo ${filePath} guardado.`);
                })
                .catch((error) => {
                    console.error(error);
                });
        } 
    });


    socket.on("end", () => {
        console.log("[SV] Cierre de conexion");
        socket.end();
    });

    socket.on("error", (error) => {
        console.error("[SV] Error de socket:", error);
    });
});

// Inicia sv
server.listen(port, () => {
    console.log("[SV] Servidor abierto en el 8080");
});
