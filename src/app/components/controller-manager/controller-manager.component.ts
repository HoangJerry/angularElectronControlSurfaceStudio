import { Component, OnInit, ChangeDetectorRef } from '@angular/core';

import { FileService } from '../../services/file.service';
import { ElectronService } from '../../providers/electron.service';
import { MidiControllerService } from '../../services/midi-controller.service';
import { ImportService } from '../../services/import.service';
import { Toast,ToasterModule, ToasterService, ToasterConfig} from 'angular2-toaster';

import { Controller } from '../../models/controller.model';
import { Mode } from '../../models/controller-mode.model';

var $ = require('jquery');

export class Selected {
  controller: number;
  id: number;
}

export class ColorAssignment {
  color:any;
  assignment:any;
}

const {remote} = require('electron')
const {Menu, MenuItem} = remote


@Component({
  selector: 'app-controller-manager',
  templateUrl: './controller-manager.component.html',
  styleUrls: ['./controller-manager.component.scss']
})
export class ControllerManagerComponent implements OnInit {
  selected : Selected = new Selected;
  selectedtemp : any;
  premode: any;
  second_panal: Selected = new Selected;
  controllers : any[] = [];
  controllers_show : any[] = [];
  controller_mapping :any;
  controller_mapping_show :any;
  controller_clipboard:any;
  controller_import:any =null;
  importServiceSubcribe:any;
  menu:any;
  clickSettingIcon:any;
  selectAssignment = Array.from(new Array(128),(val,index)=>index);
  constructor(private fileService: FileService, 
              private electronService :ElectronService,
              private midiControllerService:MidiControllerService,
              private changeDetectorRef: ChangeDetectorRef,
              private toasterService: ToasterService,
              private importService:ImportService) {
  	this.controllers = this.fileService.readDirectory('controller/');  
    this.controller_mapping = require('../../services/controller-mapping.data.json');
  	this.selectedtemp =  new Controller;   
    if (JSON.parse(localStorage.getItem("controllers_show"))!=null){
      this.controllers_show = JSON.parse(localStorage.getItem("controllers_show"))
    } 
  }

  onClickAddColorAssignment = () =>{
    let temp = new ColorAssignment;
    if (this.controllers[this.selected.controller][this.selected.id].color_assignments == undefined){
      this.controllers[this.selected.controller][this.selected.id].color_assignments = [];
    }
    this.controllers[this.selected.controller][this.selected.id].color_assignments.push(temp);
    this.onChangeName();
  }
  
  onClickSubColorAssignment = () =>{
    try{
      this.controllers[this.selected.controller][this.selected.id].color_assignments.length-=1;
      this.onChangeName();
    }
    catch{}
  }

  createMenu = () =>{
    this.menu = new Menu()
    this.menu.append(new MenuItem({label: 'Delete', 
            click: () => { 
              if (this.selected.id == 0) {
                this.fileService.deleteFile('controller/'+this.controllers[this.selected.controller][0].file_name)
                let controller = this.selected.controller; 
                this.second_panal = new Selected;
                this.selected =  new Selected;
                this.deleteScript(controller,0);
                 
              }
              if (this.selected.id != 0&&this.selected.id !=undefined){
                this.deleteScriptShow(this.selected.controller,this.selected.id);
                this.deleteScript(this.selected.controller,this.selected.id);
                let ret = [];
                this.controllers[this.selected.controller].map(s=>ret[s.id]=s)
                this.controllers[this.selected.controller]=ret;
                this.second_panal.controller = null
                this.selected.id = 0
                if (this.controllers[this.selected.controller][0].file_name != undefined){
                  this.fileService.writeFile('controller/',this.controllers[this.selected.controller][0].file_name,this.controllers[this.selected.controller]);
                }
              } 
            }
        }))
    if (this.selected.id!=0){
      this.menu.append(new MenuItem({label: 'Copy', click: () => {
        this.controller_clipboard=new Object;
        if (this.selected.id==0){
          this.controller_clipboard['data'] = JSON.parse(JSON.stringify(this.controllers[this.selected.controller]));
        }else{
          this.controller_clipboard['data'] = [];
          this.controller_clipboard['data'].push(this.controllers[this.selected.controller][this.selected.id]);
          this.copyScript(this.selected.controller,this.selected.id);
          this.controller_clipboard['parent']= this.controllers[this.selected.controller][this.controllers[this.selected.controller][this.selected.id].parent_id];
        }
      }}))
    }

    let canPaste = false;
    try{
      if (this.controller_clipboard['parent'].type==this.controllers[this.selected.controller][this.selected.id].type||
          this.controller_clipboard['parent'].type.type==this.controllers[this.selected.controller][this.selected.id].type.type){
        canPaste =true;
      }
    }
    catch (error){}
    if (this.controller_clipboard!=undefined&&canPaste){
      this.menu.append(new MenuItem({label: 'Paste', click: () => {
        if (this.controller_clipboard['parent'].type==this.controllers[this.selected.controller][this.selected.id].type||
            this.controller_clipboard['parent'].type.type==this.controllers[this.selected.controller][this.selected.id].type.type){
          this.pasteScript();
          if (this.controllers[this.selected.controller][0].file_name != undefined){
            this.fileService.writeFile('controller/',this.controllers[this.selected.controller][0].file_name,this.controllers[this.selected.controller]);
          }
        }    
      }}))
    }
    else{
      this.menu.append(new MenuItem({label: 'Paste',enabled:false}));
    }
  }

  pasteScript = () => {
    let change_parent=[];
    for (let i=0; i<this.controller_clipboard['data'].length;i++){
      change_parent[i]=false;
    }
    let last_index = this.controllers[this.selected.controller].length
    this.controller_clipboard['data']=JSON.parse(JSON.stringify(this.controller_clipboard['data']));
    this.controller_clipboard['data'][0].parent_id = this.selected.id;
    this.controller_clipboard['data'].map(s=>{
      let temp = JSON.parse(JSON.stringify(s.id));
      let index = JSON.parse(JSON.stringify(last_index));
      this.controller_clipboard['data'].map((c,i)=>{if(c.parent_id==temp&&change_parent[i]==false){c.parent_id=index;change_parent[i]=true}})
      s.id=last_index;
      if (s.has_child!=0){s.has_child=1};
      last_index++;
    })
    this.controllers[this.selected.controller] = this.controllers[this.selected.controller].concat(this.controller_clipboard['data']);
    this.showChildrend(this.selected.controller, this.controllers[this.selected.controller][this.selected.id]);
    this.showChildrend(this.selected.controller, this.controllers[this.selected.controller][this.selected.id]);
  }

  copyScript= (controller, id)=>{
    let temp = this.controllers[controller].filter(controller => controller.parent_id==id&&controller.has_child)
    temp.forEach((s)=>{
         this.copyScript(controller, s.id);
    })
    this.controller_clipboard['data'] = this.controller_clipboard['data'].concat(this.controllers[controller].filter(controller => controller.parent_id==id));
  }

  deleteScriptShow = (controller, id)=>{
    let temp = this.controllers_show[controller].filter(c => c.parent_id==id&&c.has_child)
    temp.forEach((s)=>{
         this.deleteScriptShow(controller, s.id);
    })
    this.controllers_show[controller] = this.controllers_show[controller].filter(controller => controller.parent_id!=id&&controller.id!=id);
  } 

  deleteScript = (controller, id)=>{
    if(id==0){
      this.controllers[controller]=undefined;
    }
    else{
      let temp = this.controllers[controller].filter(c => c.parent_id==id&&c.has_child)
      temp.forEach((s)=>{
           this.deleteScript(controller, s.id);
      })
      this.controllers[controller] = this.controllers[controller].filter(c => c.parent_id!=id&&c.id!=id);
     }
  }

  onClickImport = () => {
    if (this.controller_import==null){
      this.controller_import = 'controller-import';
    }
    else{
      this.controller_import = null;
    }
    this.importService.changeImport(this.controller_import)
  }

  ngAfterViewInit() {
    // Open close settingse
    $(window).on('click.Bst',(event)=>{
      // console.log($(event.target));
      // console.log($('.container-content').siblings());
      if ($('.container-second').has(event.target).length == 0 && !$('.container-second').is(event.target) 
        && $('.container-second').siblings().has(event.target).length == 0 && !$('.container-second').siblings().is(event.target)
        && $('.container-third').has(event.target).length == 0 && !$('.container-third').is(event.target)){
        // this.selected.controller=null;
        this.second_panal.controller=null;
        // this.midiControllerService.changeSelected(null)

      }      
      if ($('.container-third').has(event.target).length == 0 && !$('.container-third').is(event.target) 
        && $('.container-third').siblings().has(event.target).length == 0 && !$('.container-third').siblings().is(event.target)
        ){
        this.premode=null;
      }    
    })

    $(window).contextmenu((event)=>{     
      if($('.controller-manager').has(event.target).length){
        this.createMenu();
        this.menu.popup({window: remote.getCurrentWindow()})
      }
    })
  }


  hideChildrend = (script, id) =>{
    if (this.controllers_show[script]==undefined){
        this.controllers_show[script] = this.controllers[script].filter(script => script.parent_id==id);
    }
    let temp = this.controllers_show[script].filter(script => script.parent_id==id&&script.has_child);
    temp.forEach((s)=>{
         this.hideChildrend(script, s.id);
         s.has_child = 1;
    })
    this.controllers_show[script] = this.controllers_show[script].filter(script => script.parent_id!=id);
  }

  showChildrend = (script, val) =>{
    val.has_child *= -1;
    if (val.has_child==-1){
      if (this.controllers_show[script]==undefined){
        this.controllers_show[script] = this.controllers[script].filter(script => script.parent_id==val.id);
      }
      else{
        let temp = this.controllers_show[script].filter(s=>s.id==val.id)[0]
        let index = this.controllers_show[script].indexOf(temp);
        this.controllers_show[script] = this.controllers_show[script].slice(0, index+1).concat(this.controllers[script].filter(script => script.parent_id==val.id)).concat(this.controllers_show[script].slice(index+1,this.controllers_show[script].length)) ;
      }  
    } else{
      this.hideChildrend(script, val.id);
    }
  }


  onChangeSelected = (change) => {
    this.controllers[this.selected.controller][this.selected.id] = change;
    this.onChangeName()
  }

  onchangeController = (change)=>{
    this.controllers[this.selected.controller]=[];
    for (let c of change){
      this.controllers[this.selected.controller][c.id]=c;
    }
    this.hideChildrend(this.selected.controller, this.selected.id);
    this.showChildrend(this.selected.controller, this.controllers[this.selected.controller][this.selected.id]);
    this.onChangeName()
  }

  onClickAddMode = (val) =>{
    let last = this.controllers[this.selected.controller][this.controllers[this.selected.controller].length-1];
    let parent = this.controllers[this.selected.controller][this.selected.id]
    let mode = new Mode;
    // Add mode attribute
    mode.id = parseInt(last.id)+1;
    mode.type = val;
    mode.parent_id = this.selected.id;
    mode.level = parent.level+1;
    mode.icon = val.icon;
    if (val.has_child!=0){
      mode.has_child=1;
    }
    if (parent.level==null){
      mode.level = 0;
    }
    // Reload script directory
    parent.has_child = 1;
    this.hideChildrend(this.selected.controller, parent.id);
    this.controllers[this.selected.controller].push(mode);
    this.showChildrend(this.selected.controller, parent);
    this.selected.id = mode.id;
    this.second_panal.controller=this.selected.controller;
    this.second_panal.id = mode.id;
    // Close premode tab
    this.premode=null;
  }

  onClickForShowMapping = (val,script,parent?) => {
    this.premode = val;
    this.second_panal.controller = null;
    this.selected.controller = script;
    if (!parent){
      parent=0
    }
    this.selected.id = parent;
    this.midiControllerService.changeController(this.controllers[this.selected.controller])
  }

  onClickAdd = () => {
    this.premode=null;
  	let controllerfile = [];
    let controller = new Controller;
    controller.controller_id = this.fileService.settings.last_controller_id;
    controller.name = "New Controller";
    controllerfile.push(controller);

    this.selected.controller = this.fileService.settings.last_controller_id;
    this.selected.id = controller.id;
    this.second_panal.controller=this.selected.controller;
    this.second_panal.id = controller.id;
    this.controllers[this.fileService.settings.last_controller_id] = controllerfile;
  }

  onClickSettingIcon = (controller, id) => {
    this.clickSettingIcon = true
    if (this.second_panal.controller === controller && this.second_panal.id===id){
      this.second_panal.controller = null
    }
    else{
      this.second_panal.controller = controller;
      this.second_panal.id = id;
    }
  }

  onClickItem = (controller, id) => {
    if (this.clickSettingIcon == false){
          this.second_panal.controller = null
    }
    this.clickSettingIcon = false;
    this.selected.controller = controller
    this.selected.id = id
    this.midiControllerService.changeSelected(this.controllers[this.selected.controller][this.selected.id]);
    // Close premode tab
    this.premode=null;
    this.midiControllerService.changeController(this.controllers[this.selected.controller]);
  }
  onClickInput = () => {
    this.selectedtemp = JSON.parse(JSON.stringify(this.controllers[this.selected.controller][this.selected.id]));
  }

  onChangeName = (script_id?) => {
    // Change square or width or height
    if (this.controllers[this.selected.controller][this.selected.id].type.type=="Knob"&& localStorage.hasOwnProperty("control_knob_radius")){
      localStorage.removeItem('control_knob_radius');
      this.midiControllerService.changeController(this.controllers[-1])
    }
    setTimeout(() => {this.midiControllerService.changeController(this.controllers[this.selected.controller])},1000)
    

    if (this.selectedtemp!=this.controllers[this.selected.controller][this.selected.id] && this.controllers[this.selected.controller][this.selected.id]) {
      if (this.controllers[this.selected.controller][0].file_name != undefined){
        this.fileService.writeFile('controller/',this.controllers[this.selected.controller][0].file_name,this.controllers[this.selected.controller]);
      }
      else{
        if (script_id){
          let fileName = [script_id,'script.json'].join('_');
          let data = this.controllers.filter(script => script.script_id == script_id)[0];
          this.fileService.writeFile('controller/',fileName, data);
        }
        else{
          // set script_id and file name
          this.controllers[this.selected.controller][this.selected.id].controller_id = this.selected.controller;
          this.controllers[this.selected.controller][this.selected.id].file_name = [this.selected.controller,'controller.json'].join('_');
          this.fileService.writeFile('controller/',this.controllers[this.selected.controller][this.selected.id].file_name, this.controllers[this.selected.controller]);
          // update script in settings file
          this.fileService.settings.last_controller_id +=1;
          this.fileService.updateSettings();
        }
        
      }  	
    }
  }

  ngOnInit() {
   this.midiControllerService.currentIndexSelected
      .subscribe(selected => {
        this.selected.controller = selected[0];
        this.selected.id = selected[1];
    });

    if (this.selected.controller==undefined){
      if (this.controllers!=undefined && JSON.parse(localStorage.getItem("controllers_selected"))!=undefined){
      this.selected =  JSON.parse(localStorage.getItem("controllers_selected"))
      }
      else{
        this.selected = new Selected;
      }
    }

    this.importServiceSubcribe = this.importService.currentImportController.subscribe((val)=>{
        if (val!=null){
          let ret = [];
          try{
            val.forEach(s=>{if(s!=null){if (s.has_child!=0) {s.has_child=1} ret[s.id]=s;}})
            ret[0].controller_id = this.fileService.settings.last_controller_id
            ret[0].file_name = [ret[0].controller_id,'controller.json'].join('_');
            this.fileService.writeFile('controller/',ret[0].file_name,val);
          }
          catch{
            this.toasterService.pop('error','system','file is not controller file')
          }
          this.controllers[this.fileService.settings.last_controller_id] = ret;
          this.fileService.settings.last_controller_id +=1;
          this.fileService.updateSettings();
          this.importService.changeImportController(null);
        }
      })

    window.onbeforeunload = () => {
      this.ngOnDestroy()
    }
  }

  ngOnDestroy(){
    this.importServiceSubcribe.unsubscribe();
    $(window).off("contextmenu")
    localStorage.setItem("controllers_show", JSON.stringify(this.controllers_show));
    let array: any = [];
    this.controllers.map(s=>{if (s[0].has_child==-1){
      array[s[0].controller_id]=-1
    }})
    localStorage.setItem("controllers", JSON.stringify(array));
    this.midiControllerService.changeIndexSelected([this.selected.controller,this.selected.id]);
    localStorage.setItem("controllers_selected", JSON.stringify(this.selected));
  }

}
