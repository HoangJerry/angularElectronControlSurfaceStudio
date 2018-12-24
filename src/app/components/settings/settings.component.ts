import { Component, OnInit } from '@angular/core';
import { FileService } from '../../services/file.service';
import { Setting } from '../../models/setting.model';
import { HttpService } from '../../services/http.service';
var $ = require('jquery');
const fs = require('fs');
var os = require('os');
@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.scss']
})
export class SettingsComponent implements OnInit {
data : any;
log_txt_location : any;
midi_script_folder_location : any;
abelton_location : any;
live_version : any;
versionValue : any;
path : any;
  constructor(public fileService: FileService,private httpService: HttpService) {
    setTimeout(()=>{
			this.fileService.readFile('settings/settings.json').then((res)=>{
					if(res){
							this.data = JSON.parse(res);
							this.log_txt_location = this.data.log_txt_location;
							this.midi_script_folder_location = this.data.midi_script_folder_location;
	    				this.abelton_location = this.data.abelton_location;
	    				this.versionValue = this.data.live_version;
	    				var self = this;
	      			if(process.platform == 'win32'){
				      var osversion = os.release();
				       osversion = osversion.split('.');

				       if(osversion[0] == 5){
				        this.path = 'C:\\Documents and Settings'+process.env.username+'\\Application Data\\Ableton\\';
		      		}
		       		else{
				        this.path = 'C:\\Users'+process.env.username+'\\AppData\\Roaming\\Ableton\\';
				        //this.path = 'C:\\Users\\Abhishek\\Control Surface Studio\\';
				      }
				      var versions = this.getDirectories(this.path);
				      var data = [];
				      $.each(versions,function(i,val){
				          data.push({'label' : val, 'values' : self.path+val});
				      });
				      this.live_version = data;
				  	}
			    	else if(process.platform == 'darwin'){
			        this.path = '/Users/'+process.env.USER+'/Library/Preferences/Ableton';
			        var versions = this.getDirectories(this.path);
			        var data = [];
			        $.each(versions,function(i,val){
			          data.push({'label' : val, 'values' : self.path+'/'+val});
			        });
			        this.live_version = data;
			    	} 
					
          if((this.abelton_location == undefined && this.versionValue == undefined) || (this.abelton_location == '' && this.versionValue == '')){
          
            this.fileService.isError = true;
        
          $('.error-setting').html('Ableton Live Location not set<br>Live version not set<br>Log.txt location not found');
          }

        else if(this.abelton_location == undefined || this.abelton_location == ''){
          
            this.fileService.isError = true;
        
          $('.error-setting').html('Ableton Live Location not set');
          }
          else if(this.versionValue == undefined || this.versionValue == ''){
          
            this.fileService.isError = true;
        
          $('.error-setting').html('Live version not set');
          }
        }
			});
		},1000);
		
    
  }

  ngAfterViewInit() {
  }

  ngOnInit() {

    
    
  }

  updateSetting = () =>{
    this.fileService.updateSettings();
    this.fileService.changeSetting(this.fileService.settings)
  }

  updateFileLoc(){
    this.fileService.openFile().then((res) => {
      if(res){
        this.fileService.settings.log_txt_location = res;
        this.fileService.updateSettings();
        this.log_txt_location = res;
       
        if(this.abelton_location !='' && this.versionValue != ''){
          this.fileService.isError = false;
          $('.error-setting').html('');
        }
        else if(this.abelton_location =='' && this.versionValue == ''){
          $('.error-setting').html('Ableton Live Location not set<br>Live version not set');
        }
        else if(this.abelton_location =='' && this.versionValue != ''){
          $('.error-setting').html('Ableton Live Location not set');
        }
        else if(this.abelton_location !='' && this.versionValue == ''){
          $('.error-setting').html('Live version not set');
        }

      }
      
    });
    setTimeout(()=>{
        this.httpService.errorLog();
    },1000);
  }
  updateFolderLoc(){
    this.fileService.openFile().then((res) => {
      if(res){
        this.abelton_location = res;
        this.fileService.settings.abelton_location = res;
        if(process.platform == 'win32'){
          this.fileService.settings.midi_script_folder_location = res+"\\Resources\\MIDI Remote Scripts\\";
          this.midi_script_folder_location = res+"\\Resources\\MIDI Remote Scripts\\";
          this.fileService.updateSettings();
        }
        if(process.platform == 'darwin'){
          this.fileService.settings.midi_script_folder_location = res+'/Contents/App-Resources/MIDI Remote Scripts/';
          this.midi_script_folder_location = res+'/Contents/App-Resources/MIDI Remote Scripts/';
          this.fileService.updateSettings();
        }
        if(this.abelton_location !='' && this.versionValue != ''){
          this.fileService.isError = false;
          $('.error-setting').html('');
        }
        else if(this.versionValue == '' && this.log_txt_location != ''){
          this.fileService.isError = true;
          $('.error-setting').html('Live version not set');
        }
        else if(this.versionValue != '' && this.log_txt_location == ''){
          this.fileService.isError = true;
          $('.error-setting').html('Log.txt location not set');
        }
        else if(this.versionValue == '' && this.log_txt_location == ''){
            this.fileService.isError = true;
            $('.error-setting').html('Live version not set<br>Log.txt location not set');
        }
        
      }
    });
  }
  getDirectories(path) {
    if(fs.existsSync(path)){
      return fs.readdirSync(path).filter(function (file) {
        
        return fs.statSync(path+'/'+file).isDirectory();
      });
    }
  }
  changeVersion(){
    this.fileService.settings.live_version = $('#liveversion').val();
    this.versionValue = this.fileService.settings.live_version;
    if(process.platform == 'win32'){
        this.log_txt_location = this.versionValue+'\\Preferences\\Log.txt';
        this.fileService.settings.log_txt_location = this.log_txt_location;
    }
    else if(process.platform == 'darwin'){
        this.log_txt_location = this.versionValue+'/Log.txt';
        this.fileService.settings.log_txt_location = this.log_txt_location;
    }
    this.fileService.updateSettings();
    setTimeout(()=>{
        this.httpService.errorLog();
    },1000);
        if(this.abelton_location !=''){
          this.fileService.isError = false;
          $('.error-setting').html('');
        }
        else if(this.abelton_location ==''){
          this.fileService.isError = true;
          $('.error-setting').html('Ableton Live Location not set');
        }
        
  }

}
