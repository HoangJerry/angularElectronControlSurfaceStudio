import { Component, OnInit } from '@angular/core';
import { FileService } from '../../services/file.service';
import { ImportService } from '../../services/import.service';
import { Toast,ToasterModule, ToasterService, ToasterConfig} from 'angular2-toaster';
import { HttpService } from '../../services/http.service';
@Component({
  selector: 'app-controller-import',
  templateUrl: './controller-import.component.html',
  styleUrls: ['./controller-import.component.scss']
})
export class ControllerImportComponent implements OnInit {
	controller_computer_file:any;
  scripts:any;
  content:any;
  constructor(private fileService:FileService,
              private toasterService: ToasterService,
              private importService:ImportService,
              private httpService:HttpService) {
  	var Connect = new XMLHttpRequest();

  	Connect.open("GET", "https://remotify.io/pre_built_scripts_all/pre_built_midi_controllers_feed", false);
  	Connect.setRequestHeader("Content-Type", "text/xml");
  	Connect.send(null);
  	this.scripts = Connect.responseXML;
  	this.scripts = this.scripts.childNodes[0];
  }

  ngOnInit() {
  }

  onChangeFile = (event) => {
    if (event.srcElement.files.length!=0){
      this.controller_computer_file = event.srcElement.files;
    }
  }

  onClickImport = () => {
    if (this.controller_computer_file==undefined){
      this.toasterService.pop('warning','system','no file was selected');
      return;
    }
    if (this.controller_computer_file[0].type!="application/json"){
      this.toasterService.pop('warning','system','not json files')
    }
    else{
      this.fileService.readFile(this.controller_computer_file[0].path,true).then((res)=>{
        this.content=JSON.parse(res);
        if (this.content!=undefined && this.content[0].type=='controller'){
          this.importService.changeImportController(this.content);
        }
        else{
          this.toasterService.pop('warning','system','not controller file')
        }
      })
    }
  }

  onClickImportFromServer = (url) =>{
    this.httpService.readJsonImport(url).subscribe((data)=>{
      this.importService.changeImportController(data);
    })
  }

}
