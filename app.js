// const express = require('express');
// // Config
// const app = express();
// const port = 3000;

const { app, BrowserWindow } = require('electron');

function createWindow(){
    const win = new BrowserWindow({
        width: 800,
        height: 600,
        webPreferences: {
            nodeIntegration: true
        }
    });

    win.loadFile('./index.html');
    win = null;
}