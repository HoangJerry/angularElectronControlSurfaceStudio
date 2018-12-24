import { Injectable } from '@angular/core';
import { ElectronService } from '../providers/electron.service';
import { Observable } from 'rxjs';
import { Setting } from '../models/setting.model';
import { BehaviorSubject } from 'rxjs';
import { ImportService } from '../services/import.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Toast,ToasterModule, ToasterService, ToasterConfig} from 'angular2-toaster';

var os = require('os');
@Injectable({
  providedIn: 'root'
})
export class FileService {
  dir = '/Control Surface Studio/';
  path : any;
  settings : Setting;
  currentSetting : any;
  settingSource :any;
  isError : boolean;
  isErrorLog : boolean;
  isMidi : boolean;
  purchasedApp:boolean;

  constructor(public electron: ElectronService,
              public http: HttpClient,
              private toasterService: ToasterService,
              private importService:ImportService) {
    this.path = os.homedir();

    // Setup directory
    this.dir = this.getUserHome()+this.dir;
    if (!this.electron.fs.existsSync(this.dir)){
        this.electron.fs.mkdirSync(this.dir);
    }
    if (!this.electron.fs.existsSync(this.dir+'settings/')){
        this.electron.fs.mkdirSync(this.dir+'settings/');
    }
    if (!this.electron.fs.existsSync(this.dir+'script/')){
        this.electron.fs.mkdirSync(this.dir+'script/');
        let scripts_to_import = ["/midiscripts/my_first_script.json"];
        for (let s of scripts_to_import){
          this.http.get("https://remotify.io/serve_json.php?f="+s,{headers: new HttpHeaders().set('Content-Type', 'application/json')}).subscribe((data)=>{
            this.importService.changeImportScript(data);
          })
        }
      }
    if (!this.electron.fs.existsSync(this.dir+'controller/')){
        this.electron.fs.mkdirSync(this.dir+'controller/');

        let controllers_to_import = ["/midicontrollers/akai_midimix.json", "/midicontrollers/dj_tt_midi_fighter_twister.json"];

        for (let s of controllers_to_import){
          this.http.get("https://remotify.io/serve_json.php?f="+s,{headers: new HttpHeaders().set('Content-Type', 'application/json')}).subscribe((val:any)=>{
            let ret = [];
            try{
              val.forEach(s=>{if(s!=null){if (s.has_child!=0) {s.has_child=1} ret[s.id]=s;}})
              ret[0].controller_id = this.settings.last_controller_id;
              ret[0].file_name = [ret[0].controller_id,'controller.json'].join('_');
              this.writeFile('controller/',ret[0].file_name,val);
            }
            catch{
              this.toasterService.pop('error','system','file is not controller file')
            }
            this.settings.last_controller_id +=1;
            this.updateSettings();
          })
        }

    }

    // Get settings information
    if (!this.electron.fs.existsSync(this.dir+'settings/settings.json')){
      this.settings = new Setting;
      this.settings.last_controller_id = 1;
      this.settings.last_script_id = 1;
      this.settings.abelton_location = '';
      this.settings.live_version = '';
      if(process.platform == "win32"){

        this.settings.log_txt_location = '';
        this.settings.midi_script_folder_location = '';
      }
      else if(process.platform == "darwin"){
        this.settings.log_txt_location = '';
        this.settings.midi_script_folder_location = '';
      }
      this.updateSettings();
        setTimeout(()=>{
      this.readFile('settings/settings.json').then((res) => {
        if (res!=undefined){
          this.settings = <Setting>JSON.parse(res);
          this.settingSource = new BehaviorSubject(this.settings);
            this.currentSetting = this.settingSource.asObservable();
        }
      })
      },1000);
    }
    else{
      this.readFile('settings/settings.json').then((res) => {
        if (res!=undefined){
          this.settings = <Setting>JSON.parse(res);
          this.settingSource = new BehaviorSubject(this.settings);
          this.currentSetting = this.settingSource.asObservable();
        }
      })
    }

  }

  changeSetting(message:any){
    this.settingSource.next(message);
  }

  getUserHome = ()=> {
    return process.env[(process.platform == 'win32') ? 'USERPROFILE' : 'HOME'];
  }

  updateSettings = () => {
    this.writeFile('settings/','settings.json',this.settings);
  }

  openFile = async() => {
    // Open the Dialog for choosing a file in user's computer.
    const fileNames = await this.electron.remote.dialog.showOpenDialog({
      properties: ['openFile']
    });
    // Check no file was selected.
    if (fileNames === undefined) {
      // Show inform
      this.showNotification("Inform", "No file selected");
      return ''
    } else {
      // return file path.
      return fileNames[0];
    }
  }

  openDir = async() => {
    // Open the Dialog for choosing a file in user's computer.
    const fileNames = await this.electron.remote.dialog.showOpenDialog({
      properties: ['openDirectory']
    });
    // Check no file was selected.
    if (fileNames === undefined) {
      // Show inform
      this.showNotification("Inform", "No file selected");
      return ''
    } else {
      // return file path.
      return fileNames[0];
    }
  }

  writeFile = (path, fileName , content) => {
    // Check if the directory was not created.
    if (!this.electron.fs.existsSync(this.dir+path)){
        this.electron.fs.mkdirSync(this.dir+path);
    }
    // Write file
    this.electron.fs.writeFile(this.dir+ path + fileName, JSON.stringify(content), (err) => {
      if (err) {
        this.showNotification('Error', "An error ocurred creating the file:" + err.message)
        return;
      }
      // this.showNotification("Inform", "File is succesfully updated")
    });
  }

  writeMidiScriptFile = (path, fileName , content) => {
    // Check if the directory was not created.
    if (!this.electron.fs.existsSync(path)){
        this.electron.fs.mkdirSync(path);
    }
    // Write file
    this.electron.fs.writeFile(path + fileName, content, (err) => {
      if (err) {
        this.showNotification('Error', "An error ocurred creating the file:" + err.message)
        return;
      }
      // this.showNotification("Inform", "File is succesfully updated")
    });
  }

  readDirectory = (directory) => {
    // Check if the directory was not created.
    if (!this.electron.fs.existsSync(this.dir+directory)){
        this.electron.fs.mkdirSync(this.dir+directory);
    }
    let ret = [];
    let arr_script:any;
    if (JSON.parse(localStorage.getItem("scripts"))!=null&&JSON.parse(localStorage.getItem("scripts"))!=undefined){
      arr_script = JSON.parse(localStorage.getItem("scripts"));
    }
    let arr_controller:any;
    if (JSON.parse(localStorage.getItem("controllers"))!=null&&JSON.parse(localStorage.getItem("controllers"))!=undefined){
      arr_controller = JSON.parse(localStorage.getItem("controllers"));
    }
    let files = this.electron.fs.readdirSync(this.dir + directory)
    for (let file of files){
      this.readFile(directory+file).then((res) => { 

        if (directory=='script/'){
          let temp = [];
          temp = temp.concat(JSON.parse(res))
          temp.forEach(s=>{if(s!=null){if (s.has_child!=0) {s.has_child=1}}})
          if (arr_script!=undefined&&arr_script[temp[0].script_id]!=undefined){
            temp[0].has_child=arr_script[temp[0].script_id]
          }
          ret[temp[0].script_id]=temp;
        }
        if (directory=='controller/'){
          let temp = [];
          let my_temp = [];
          temp = temp.concat(JSON.parse(res));
          for (let s of temp){
            if (s!=null){
              if(s.has_child!=0) {
                s.has_child=1}; 
              my_temp[s.id]=s
            }
          }

          if (arr_controller!=undefined&&arr_controller[temp[0].controller_id]!=undefined){
            temp[0].has_child=arr_controller[temp[0].controller_id]
          }
          ret[temp[0].controller_id]=my_temp;
        }
      });
    }    
    return ret;
  }

  isExistFiles = (path):boolean => {
    return this.electron.fs.existsSync(this.dir + path);
  }

  readFile = async(path, system?) => {
    try {
      // try to read the file in current path
      if (system) {
        return this.electron.fs.readFileSync(path, 'utf-8');
      }
      return this.electron.fs.readFileSync(this.dir+path, 'utf-8');
    } catch (err) {
      this.showNotification('Error', "An error ocurred reading the file:" + err);
    }
  }

  updateLogFile = (path) => {
    if (!this.electron.fs.existsSync(path)){
          return false;
      }
     // Write file
    this.electron.fs.writeFile(path,'', (err) => {
      if (err) {
        this.showNotification('Error', "An error ocurred creating the file:" + err.message)
        return;
      }
      // this.showNotification("Inform", "File is succesfully updated")
    });
  }

  readLogFile = async(path) => {
    try {
      // try to read the file in current path
      return this.electron.fs.readFileSync(path, 'utf-8');
    } catch (err) {
      this.showNotification('Error', "An error ocurred reading the file:" + err);
    }
  }

  deleteFile = (path, notify?) => {
    path = this.dir + path;
    // a void function, return nothing.
    // check if the file path is available
    if (this.electron.fs.existsSync(path)) {
      // delete by unlink
      this.electron.fs.unlink(path, (err) => {
        if (err) {
          this.showNotification('Error', "An error ocurred updating the file" + err.message, notify)
          return;
        }
        this.showNotification("Inform", "File succesfully deleted", notify)
      });
    } else {
      this.showNotification('Error', "This file doesn't exist, cannot delete", notify)
    }
  }

  showNotification = (title, content, notify?) => {
    if (notify==false){
      return;
    }
    // create a desktop notification
    let myNotification = new Notification(title, {
      body: content
    })
  }

  fileNameCreate = (str) => {
    //remove unnecessary space and replace with underscore
    str = str.trim();
    str = str.replace(/\s+/g, " ");
    str = str.replace(/ /g, "_");
    return str.toLowerCase()+'.json';
  }
}