import { Component, OnInit,  } from '@angular/core';
import { FileService } from '../../services/file.service';
import { Toast,ToasterModule, ToasterService, ToasterConfig} from 'angular2-toaster';
import { ImportService } from '../../services/import.service';
import { HttpService } from '../../services/http.service';

@Component({
  selector: 'app-script-import',
  templateUrl: './script-import.component.html',
  styleUrls: ['./script-import.component.scss']
})
export class ScriptImportComponent implements OnInit {
  script_computer_file:any;
  scripts:any;
  content:any;
  constructor(private fileService:FileService,
  						private toasterService: ToasterService,
  						private importService:ImportService,
              private httpService:HttpService) {
  	
  	
  	// for (let s of this.scripts.children){
  	// 	console.log(s.children)
  	// }
  }

  ngOnInit() {
  	var Connect = new XMLHttpRequest();
  	Connect.open("GET", "https://remotify.io/pre_built_scripts_all/pre_built_midi_scripts_feed", false);
  	Connect.setRequestHeader("Content-Type", "text/xml");
  	Connect.send(null);
  	this.scripts = Connect.responseXML;
  	this.scripts = this.scripts.childNodes[0];
  }

  onChangeFile = (event) => {
    if (event.srcElement.files.length!=0){
      this.script_computer_file = event.srcElement.files;
    }
  }

  onClickImport = () => {
  	if (this.script_computer_file==undefined){
      this.toasterService.pop('warning','system','no file was selected');
      return;
    }
  	if (this.script_computer_file[0].type!="application/json"){
  		this.toasterService.pop('warning','system','not json files')
  	}
  	else{
  		this.fileService.readFile(this.script_computer_file[0].path,true).then((res)=>{
  			this.content=JSON.parse(res);
  			if (this.content!=undefined && this.content[0].type=='script'){
          this.importService.changeImportScript(this.content);
        }
        else{
          this.toasterService.pop('warning','system','not script file')
        }
  		})
  	}
  }

  onClickImportFromServer = (url) =>{
    this.httpService.readJsonImport(url).subscribe((data)=>{
      this.importService.changeImportScript(data);
    })
  }

}
