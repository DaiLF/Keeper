const electron = require('electron');
const {app, BrowserWindow, Menu} = electron;

let mainWin = null;

function createWindow() {
    Menu.setApplicationMenu(null);

    mainWin = new BrowserWindow({
        width: 800,
        height: 600,
        title: '主页',
        show: false,
        frame: false,
        webPreferences: {
            nodeIntegration: true,
        }
    });


    mainWin.loadFile('./index.html');
    mainWin.on('ready-to-show', () => {
        mainWin.show();
    });

    mainWin.on('closed', () => {
        mainWin = null;
    });
}




app.on('ready', () => {
    createWindow();
});

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit();
    }
});

app.on('activate', () => {
    if (mainWin == null) {
        createWindow();
    }
});
