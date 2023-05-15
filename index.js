const client = require('./client');
const { selectFiles } = require('select-files-cli');

let selectedFiles;

// Selector de archivos
selectFiles({
    multi: false,
    startingPath: 'files'
}).then(({ selectedFiles, status }) => {
    console.log(selectedFiles);
   
    console.log(status);
   
    console.log('seleccion: ' + selectedFiles);
    client.sendFile(selectedFiles.toString());
  });
