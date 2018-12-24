import { Injectable } from '@angular/core';

// If you import a module but never use any of the imported values other than as TypeScript types,
// the resulting javascript file will look as if you never imported the module at all.
import { ipcRenderer, webFrame, remote, BrowserWindow } from 'electron';
import * as childProcess from 'child_process';
import * as fs from 'fs';

@Injectable()
export class ElectronService {

  ipcRenderer: typeof ipcRenderer;
  webFrame: typeof webFrame;
  remote: typeof remote;
  childProcess: typeof childProcess;
  window: BrowserWindow;
  fs: typeof fs;
  app: any;

  constructor() {
    // Conditional imports
    if (this.isElectron()) {
      this.ipcRenderer = window.require('electron').ipcRenderer;
      this.webFrame = window.require('electron').webFrame;
      this.remote = window.require('electron').remote;
      this.window = window.require('electron').remote.getCurrentWindow();

      this.childProcess = window.require('child_process');
      this.fs = window.require('fs');
      this.app = window.require('electron').app;
      const {getCurrentWindow, globalShortcut} = require('electron').remote;

          var reload = ()=>{
            getCurrentWindow().reload()
          }

          globalShortcut.register('F5', reload);
          globalShortcut.register('CommandOrControl+R', reload);
          // here is the fix bug #3778, if you know alternative ways, please write them
          window.addEventListener('beforeunload', ()=>{
            globalShortcut.unregister('F5');
            globalShortcut.unregister('CommandOrControl+R');
          })
    }
  }

  isElectron = () => {
    return window && window.process && window.process.type;
  }

}
