const client = require('./client');
const { selectFiles } = require('select-files-cli');

let selectedFiles;

selectFiles({
    multi: false,
    startingPath: 'files'
}).then(({ selectedFiles, status }) => {
    console.log(selectedFiles);
   
    // [
    //  '/Users/sam/Documents/select-files-cli/README.md',
    //  '/Users/sam/Documents/select-files-cli/index.js'
    // ]
   
    console.log(status);
   
    // 'SELECTION_COMPLETED' (or 'SELECTION_CANCELLED')
    console.log('seleccion: ' + selectedFiles);
    client.sendFile(selectedFiles.toString());
  });

// client.sendFile('files/test.txt');
