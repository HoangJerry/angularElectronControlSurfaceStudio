import { Component, OnInit } from '@angular/core';
import { FileService } from '../../services/file.service';
import { HttpService } from '../../services/http.service';
var $ = require('jquery');
const fs = require('fs');
@Component({
  selector: 'app-error-log',
  templateUrl: './error-log.component.html',
  styleUrls: ['./error-log.component.scss']
})
export class ErrorLogComponent implements OnInit {
data : any;
showError : any;
  constructor(private fileService: FileService,private httpService: HttpService) {
       
         
        this.httpService.errorLog();
        this.httpService.errorLogUpdates.subscribe((res)=>{
          this.showError = res;
          
          if(this.showError != ''){
            this.fileService.isErrorLog  = true;
            
          }
          else{
            this.fileService.isErrorLog  = false;
          }
          
        });

  }

  ngOnInit() {
  }

  clearLog(){
    this.data = this.fileService.readFile('settings/settings.json');
    this.data = JSON.parse(this.data['__zone_symbol__value']);
    this.fileService.updateLogFile(this.data.log_txt_location);
    this.showError =[];
     this.httpService.errorLogUpdates.emit(this.showError);
     this.fileService.isErrorLog = false;

  }

}
