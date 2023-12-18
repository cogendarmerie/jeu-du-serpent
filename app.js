const { app, BrowserWindow } = require('electron');

function createWindow(){
    const win = new BrowserWindow({
        width: 1000,
        height: 700,
        webPreferences: {
            nodeIntegration: true
        }
    });

    win.loadFile('./index.html');
}

app.whenReady().then(function () {
    createWindow();
    app.on('activate', ()=>{
        if(BrowserWindow.getAllWindows().length === 0){
            createWindow();
        }
    });
});

app.on("window-all-closed", function (){
    if(process.platform !== 'darwin') {
        app.quit();
    }
});