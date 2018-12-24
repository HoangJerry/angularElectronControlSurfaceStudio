import { Injectable,EventEmitter } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import {Headers} from '@angular/http';
import { FileService } from './file.service';
var $ = require('jquery');
const fs = require('fs');
@Injectable({
  providedIn: 'root'
})
export class HttpService {
model : any = {};
data : any;
logData : any;
httpUpdate:EventEmitter<object> = new EventEmitter();
appUpdate:EventEmitter<object> = new EventEmitter();
errorLogUpdates:EventEmitter<object> = new EventEmitter();
  // ROOT_URL = 'http://drupal-remotify:8888/'; // Local Dev
  ROOT_URL = 'https://remotify.io/'; // Live
  username : any;
  password : any;
  posts: any;
  sessionToken: any;
  css_version : any;
  // data: any;

  constructor(public http: HttpClient, public fileService: FileService) {
      this.css_version = 2.1;
   }
      
  // same error call back function for all steps
  errorResponse( thrownError ) {
    this.httpUpdate.emit(thrownError);
  }

  // 1 Get session token
  getSessionToken() {
    this.http.get(
      this.ROOT_URL + 'services/session/token', {
        headers: new HttpHeaders().set('Content-Type', 'application/json'),
        responseType: 'text' 
    }).subscribe(
      data => {
        // this.sessionToken = data
        this.systemConnect(data);
        console.log("got a session token " + data);
      }, 
      err => {
         console.log(err); // logs error
         this.errorResponse(err );
      }
    )
    
  }

  // 2. system connect
  // Now that we have the sessionToken, we need to use it with the system/connect end point
  systemConnect(sessionToken) {
    var headers = new Headers({
      'Content-Type' : 'x-www-form-urlencoded',
      'X-CSRF-Token' : sessionToken
    });
    this.http.post(
      this.ROOT_URL + 'user_authenticate/system/connect.json', {
        headers: headers,
        responseType: 'text' 
      }).subscribe(
        data => {
        // this.systemConnect(data);
        console.log("connected to system" + data);
        this.logUserIn(data);
        }, 
        err => {
           console.log(err); // logs error
           this.errorResponse( err );
        }
      )
  }

  // 3 Now we login, which assigns the session with the logging in user.
  logUserIn(data) {
     this.http.post(
      this.ROOT_URL + 'user_authenticate/user/login.json',{ 'name': this.username,  'pass': this.password }).subscribe(
        data => {
         // this.getZip(data);
          //console.log("logged in successfully" + data);
          this.httpUpdate.emit(data);
        }, 
        err => {
           console.log(err); // logs error

           this.errorResponse( err );
        }
      )
  }

  // 4 Posts json to server.
  getZip =(scriptJson,controllerJson)=> {
    var user = JSON.parse(sessionStorage.getItem('UsersData'));

     this.http.post(
      this.ROOT_URL + 'helloworld/builder_v2_services/connect_to_builder_v2',{ 'sess_id': user.sessid, 'script_json' : scriptJson,'controller_json' : controllerJson }).subscribe(
        data => {
               
                this.fileService.readFile('settings/settings.json').then((res)=>{
                      var fileRes = JSON.parse(res);
                      var dataRes = JSON.parse(data[0]);
                      var self = this;
                      
                        
                      $.each(dataRes,function(i,val){
                        var path = '';
                        var foldername = dataRes[0]['script_name'];
                        if(process.platform == "win32"){
                          path = fileRes.midi_script_folder_location+'\\'+foldername+'\\';
                        }
                        else if(process.platform == "darwin"){
                            path = fileRes.midi_script_folder_location+'/'+foldername+'/';
                        }
                        if(i != 0){
                        self.fileService.writeMidiScriptFile(path,val.file_name,val.contents);
                        }
                      });
                      this.httpUpdate.emit(dataRes);
                      // put the user data back in place.
                      sessionStorage.setItem('UsersData',JSON.stringify(user));
                });
            }, 
        err => {
              this.errorResponse( err );
              //this.errorResponse( "Failed to login " + JSON.stringify(err) );
            }
      )
      
     
  }
  getRegistered(){
      this.http.post(
      this.ROOT_URL + 'user_authenticate/user.json',JSON.stringify({ 'name': this.model.name,  'mail': this.model.email,'pass' : this.model.password,'pass2':this.model.cnfpassword }),{
   headers: new HttpHeaders().set('Content-Type', 'application/json')}).subscribe(
        data => {
         this.httpUpdate.emit(data);
        }, 
        err => {
         this.errorResponse( err );
        }
      )
  }
  requestNewPassword(){
    this.http.post(
      this.ROOT_URL + 'user_authenticate/user/request_new_password',JSON.stringify({ 'name': this.model.forgot_password_email }),{
   headers: new HttpHeaders().set('Content-Type', 'application/json')}).subscribe(
        data => {
         this.httpUpdate.emit(data);
        }, 
        err => {
         this.errorResponse( err );
        }
      )
  }
  readUpdateJson(){
    this.http.get(
      'http://remotify.io/helloworld/builder_v2_services.json'
   ).subscribe(
      data =>{
        this.appUpdate.emit(data);
      },
      err =>{
        this.errorResponse(err);
      }
    )
  }
  errorLog(){
    setTimeout(()=>{
      this.fileService.readFile('settings/settings.json').then((res)=>{
        if(res){
          this.data = JSON.parse(res);
          var myInterval;
          if(fs.existsSync(this.data.log_txt_location)){
            myInterval = setInterval(()=>{
            this.logData = this.fileService.readLogFile(this.data.log_txt_location);
            this.logData = this.logData['__zone_symbol__value'];
            if(typeof this.logData !== 'undefined'){
            this.logData = this.logData.split("\n");
            var errors = [];
            $.each(this.logData,function(i,value){
              if(value.indexOf('RemoteScriptError') > 0){
                value = value.split(":");
                if(value[1] != ''){
                 errors.push(value[1]);
                }

              }
            });
            this.errorLogUpdates.emit(errors);
              
            }else{
              clearInterval(myInterval);
            }  

            },1000); 
          }
        else{
          clearInterval(myInterval);

        }
      }
      });
    },1000);    
  }

  readJsonImport = (url) =>{
    return this.http.get("https://remotify.io/serve_json.php?f="+url,{headers: new HttpHeaders().set('Content-Type', 'application/json')})
  }  
  
}
