# Redes de Computadores - Lab 1

## Caracteristicas del programa
- Transferencias de archivos grandes
- Selector de archivos en consola
- Barra de progreso en cliente y servidor

## Uso del programa

### Ejecucion del servidor
 Primero se ejecuta el servidor (quien va a recibir el archivo), para hacer esto basta con escribir en la terminal
```
npm run server
```
Por defecto el servidor corre en el localhost con puerto 8080, una vez ejecutado el comando el servidor estara escuchando conexiones entrantes.

### Ejecucion del cliente

Para correr el cliente se debe ejecutar en la terminal:

```
npm run testclient
```
El cliente (quien enviara el archivo) comenzara a correr y aparecera el selector de archivos, usando las flechas se selecciona algun archivo que se encuentre en la carpeta "files" y comenzara la transferencia.                                