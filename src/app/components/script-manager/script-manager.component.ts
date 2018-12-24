import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { HttpService } from '../../services/http.service';
import { Script } from '../../models/script.model';
import { Controller } from '../../models/controller.model';
import { Mode } from '../../models/script-mode.model';

import { FileService } from '../../services/file.service';
import { ElectronService } from '../../providers/electron.service';
import { Toast,ToasterModule, ToasterService, ToasterConfig} from 'angular2-toaster';
import { MidiControllerService } from '../../services/midi-controller.service';
import { ImportService } from '../../services/import.service';

var $ = require('jquery');
const {shell} = require('electron');
export class Selected {
  script: number;
  id: number;
}
const {remote} = require('electron')
const {Menu, MenuItem} = remote
@Component({
  selector: 'app-script-manager',
  templateUrl: './script-manager.component.html',
  styleUrls: ['./script-manager.component.scss']
})

export class ScriptManagerComponent implements OnInit {
  selected : Selected;
  selectedtemp : any;
  premode: any;
  second_panal: Selected = new Selected;
  scripts : any[];
  scripts_show : any[] = [];
  controllers : any[];
  script_mapping :any;
  script_mapping_show :any;
  script_clipboard:any;
  script_import:any =null;
  importServiceSubcribe:any;
  menu:any;
  clickSettingIcon:any;
  constructor(public fileService: FileService, 
              private electronService :ElectronService,
              private httpService: HttpService,
              private toasterService: ToasterService,
              private changeDetectorRef: ChangeDetectorRef,
              private midiControllerService:MidiControllerService,
              private importService:ImportService) {
    this.scripts = this.fileService.readDirectory('script/');
    this.script_mapping = require('../../services/script-mapping.data.json');
    this.script_mapping_show = this.script_mapping.filter(script => script.parent==null)
    
  	this.controllers = this.fileService.readDirectory('controller/'); 
    this.selectedtemp =  new Script;
    if (this.scripts!=undefined && JSON.parse(localStorage.getItem("scripts_selected"))!=undefined){
  	  this.selected =  JSON.parse(localStorage.getItem("scripts_selected"))
    }
    else{
      this.selected = new Selected;
    }
    if (JSON.parse(localStorage.getItem("scripts_show"))!=null){
      this.scripts_show = JSON.parse(localStorage.getItem("scripts_show"))
    }

    this.importServiceSubcribe = this.importService.currentImportScript.subscribe((val)=>{
        if (val!=undefined&&val!=null){
          try{
            val.forEach(s=>{
              if(s!=null){
                if (s.has_child!=0) 
                  {s.has_child=1}
              }
            })
            val[0].script_id = this.fileService.settings.last_script_id
            val[0].file_name = [val[0].script_id,'script.json'].join('_');
            this.fileService.writeFile('script/',val[0].file_name,val);
          }
          catch{
            this.toasterService.pop('error','system','file is not script file')
          }
          this.scripts[this.fileService.settings.last_script_id] = val;
          this.fileService.settings.last_script_id +=1;
          this.fileService.updateSettings();
          // console.log(this.scripts);
          this.importService.changeImportScript(null);
        }
    })    
  } 
    createMenu = () =>{
    this.menu = new Menu()
    this.menu.append(new MenuItem({label: 'Delete', 
            click: () => { 
              if (this.selected.id == 0) {
                this.fileService.deleteFile('script/'+this.scripts[this.selected.script][0].file_name)
                let script = this.selected.script; 
                this.second_panal = new Selected;
                this.selected =  new Selected;
                this.deleteScript(script,0);
                 
              };
              if (this.selected.id != 0&&this.selected.id!=undefined){
                this.deleteScriptShow(this.selected.script,this.selected.id);
                this.deleteScript(this.selected.script,this.selected.id);
                let ret = [];
                this.scripts[this.selected.script].map(s=>ret[s.id]=s)
                this.scripts[this.selected.script]=ret;
                this.second_panal.script = null
                this.selected.id = 0
                if (this.scripts[this.selected.script][0].file_name != undefined){
                  this.fileService.writeFile('script/',this.scripts[this.selected.script][0].file_name,this.scripts[this.selected.script]);
                }
              }
            }
        }))

    if (this.selected.id!=0){
      this.menu.append(new MenuItem({label: 'Copy', click: () => {
        this.script_clipboard=new Object;
        if (this.selected.id==0){
          this.script_clipboard['data'] = JSON.parse(JSON.stringify(this.scripts[this.selected.script]));
        }else{
          this.script_clipboard['data'] = [];
          this.script_clipboard['data'].push(this.scripts[this.selected.script][this.selected.id]);
          this.copyScript(this.selected.script,this.selected.id);
          this.script_clipboard['parent']= this.scripts[this.selected.script][this.scripts[this.selected.script][this.selected.id].parent_id];
        }
      }}))
    }
    let canPaste = false;
    try{
      if (this.script_clipboard['parent'].type==this.scripts[this.selected.script][this.selected.id].type||
        this.script_clipboard['parent'].type.type==this.scripts[this.selected.script][this.selected.id].type.type){
        canPaste =true;
      }
    }
    catch (error){}
    if (this.script_clipboard!=undefined&&canPaste){
      this.menu.append(new MenuItem({label: 'Paste', click: () => {
        if (this.script_clipboard['parent'].type==this.scripts[this.selected.script][this.selected.id].type||
          this.script_clipboard['parent'].type.type==this.scripts[this.selected.script][this.selected.id].type.type){
          this.pasteScript();
          if (this.scripts[this.selected.script][0].file_name != undefined){
            this.fileService.writeFile('script/',this.scripts[this.selected.script][0].file_name,this.scripts[this.selected.script]);
          }
        }  
      }}))
    }
    else{
      this.menu.append(new MenuItem({label: 'Paste',enabled:false}));
    }
  }

  onClickImport = () => {
    if (this.script_import==null){
      this.script_import = 'script-import';
    }
    else{
      this.script_import = null;
    }
    this.importService.changeImport(this.script_import)


  }

  pasteScript = () => {
    let change_parent=[];
    for (let i=0; i<this.script_clipboard['data'].length;i++){
      change_parent[i]=false;
    }
    let last_index = this.scripts[this.selected.script].length
    this.script_clipboard['data']=JSON.parse(JSON.stringify(this.script_clipboard['data']));
    this.script_clipboard['data'][0].parent_id = this.selected.id;
    this.script_clipboard['data'].map(s=>{
      let temp = JSON.parse(JSON.stringify(s.id));
      let index = JSON.parse(JSON.stringify(last_index));
      this.script_clipboard['data'].map((c,i)=>{if(c.parent_id==temp&&change_parent[i]==false){c.parent_id=index;change_parent[i]=true}})
      s.id=last_index;
      if (s.has_child!=0){s.has_child=1};
      last_index++;
    })
    this.scripts[this.selected.script] = this.scripts[this.selected.script].concat(this.script_clipboard['data']);
    this.showChildrend(this.selected.script, this.scripts[this.selected.script][this.selected.id]);
    this.showChildrend(this.selected.script, this.scripts[this.selected.script][this.selected.id]);
  }

  copyScript= (script, id)=>{
    let temp = this.scripts[script].filter(script => script!=null&&script!=undefined&&script.parent_id==id&&script.has_child)
    temp.forEach((s)=>{
         this.copyScript(script, s.id);
    })
    this.script_clipboard['data'] = this.script_clipboard['data'].concat(this.scripts[script].filter(script => script.parent_id==id));
  }

  deleteScriptShow = (script, id)=>{
    let temp = this.scripts_show[script].filter(script => script!=null&&script!=undefined&&script.parent_id==id&&script.has_child)
    temp.forEach((s)=>{
         this.deleteScriptShow(script, s.id);
    })
    this.scripts_show[script] = this.scripts_show[script].filter(script => script!=null&&script!=undefined&&script.parent_id!=id&&script.id!=id);
  } 

  deleteScript = (script, id)=>{
    if(id==0){
      this.scripts[script]=undefined;
    }
    else{
      let temp = this.scripts[script].filter(script => script!=null&&script!=undefined&&script.parent_id==id&&script.has_child)
      temp.forEach((s)=>{
           this.deleteScript(script, s.id);
      })
      this.scripts[script] = this.scripts[script].filter(script => script!=null&&script!=undefined&&script.parent_id!=id&&script.id!=id);
     }
  }

  ngAfterViewInit() {
    // Open close settingse
    $(window).on('click.Bst',(event)=>{
      // console.log($(event.target));
      // console.log($('.container-content').siblings());
      if ($('.container-second').has(event.target).length == 0 && !$('.container-second').is(event.target) 
        && $('.container-second').siblings().has(event.target).length == 0 && !$('.container-second').siblings().is(event.target)
        && $('.container-third').has(event.target).length == 0 && !$('.container-third').is(event.target)){
        this.second_panal.script=null;
      }      
      if ($('.container-third').has(event.target).length == 0 && !$('.container-third').is(event.target) 
        && $('.container-third').siblings().has(event.target).length == 0 && !$('.container-third').siblings().is(event.target)
        ){
        this.premode=null;
        this.script_mapping.map(script => {if (script.has_child!=0) {script.has_child=1}});
        this.script_mapping_show=this.script_mapping.filter(script => script.parent==null);
      }    
      // if ($('.script-manager').has(event.target).length == 0 && !$('.script-manager').is(event.target)){
      //   this.premode=null;
      //   this.selected.script=null;
      //   console.log(this.selected);
        // this.script_mapping.map(script => {if (script.has_child!=0) {script.has_child=1}});
        // this.script_mapping_show=this.script_mapping.filter(script => script.parent==null);
      // }
    })

    $(window).contextmenu((event)=>{  
      if($('.script-manager').has(event.target).length){
        this.createMenu();
        this.menu.popup({window: remote.getCurrentWindow()})
      }
    })
  }

  onChangeSelected = (change) => {
    this.scripts[this.selected.script][this.selected.id] = change;
    setTimeout(()=>{
      if (this.controllers[this.scripts[this.selected.script][0].controller_id]!=undefined&&this.scripts[this.selected.script][this.selected.id].controller_input_id!=undefined){
        this.midiControllerService.changeSelected(this.controllers[this.scripts[this.selected.script][0].controller_id][this.scripts[this.selected.script][this.selected.id].controller_input_id]);
      }
      else{
        this.midiControllerService.changeSelected(null)
      }
      this.onChangeName()},100);
  }

  hideChildrendMapping = (id) =>{
    let temp = this.script_mapping_show.filter(script => script.parent==id&&script.has_child);
    temp.forEach((s)=>{
         this.hideChildrendMapping(s.id);
         s.has_child = 1;
    })
    this.script_mapping_show = this.script_mapping_show.filter(script => script.parent!=id)
  }

  showChildrendMapping = (val) =>{
    val.has_child *= -1;
    let temp = this.script_mapping_show.filter(mode => mode.id==val.id)[0];
    let index = this.script_mapping_show.indexOf(temp);

    if (val.has_child==-1){
      this.script_mapping_show = this.script_mapping_show.slice(0, index+1).concat(this.script_mapping.filter(script => script.parent==val.id)).concat(this.script_mapping_show.slice(index+1,this.script_mapping_show.length)) ;
    }
    else{
      this.hideChildrendMapping(val.id);
    }
  }

  hideChildrend = (script, id) =>{
    if (this.scripts_show[script]==undefined){
        this.scripts_show[script] = this.scripts[script].filter(script => script.parent_id==id);
    }
    let temp = this.scripts_show[script].filter(script => script.parent_id==id&&script.has_child);
    temp.forEach((s)=>{
         this.hideChildrend(script, s.id);
         s.has_child = 1;
    })
    this.scripts_show[script] = this.scripts_show[script].filter(script => script.parent_id!=id);
  }

  showChildrend = (script, val) =>{
    val.has_child *= -1;
    if (val.has_child==-1){
      if (this.scripts_show[script]==undefined||this.scripts_show[script]==null){
        this.scripts_show[script] = this.scripts[script].filter(s => {if(s!=null){return s.parent_id==val.id}});
      }
      else{
        let temp = this.scripts_show[script].filter(s=>s.id==val.id)[0]
        let index = this.scripts_show[script].indexOf(temp);

        this.scripts_show[script] = this.scripts_show[script].slice(0, index+1).concat(this.scripts[script].filter(s => {if(s!=null){return s.parent_id==val.id}})).concat(this.scripts_show[script].slice(index+1,this.scripts_show[script].length)) ;
      }
    } else{
      this.hideChildrend(script, val.id);
    }
  }

  onClickAdd = () => {
    this.premode=null;
  	let scriptfile = [];
    let script = new Script;
    this.selected.script = this.fileService.settings.last_script_id;
    this.selected.id = script.id;
    this.second_panal.script = this.selected.script;
    this.second_panal.id = script.id;
    
    script.name = "New Script";
    script.script_id = this.fileService.settings.last_script_id;
    console.log(this.controllers);
    if (this.controllers!=null&&this.controllers!=undefined&&this.controllers.length>0){
      script.controller_id=this.controllers.find(s=>s!=null&&s!=undefined)[0].controller_id;
    }
    scriptfile.push(script);
    this.scripts[this.fileService.settings.last_script_id]=scriptfile;
    this.onChangeName();
  }

  showParentMapping = (mode) =>{
    if (mode.parent!=null){
      let parent = this.script_mapping.filter(script => script.id==mode.parent)[0]
      this.showParentMapping(parent);
    }
    if(mode.has_child!=0){
      mode.has_child=1;
      this.showChildrendMapping(mode);
    }
  }

  onClickForShowMapping = (val,script,parent?) => {
    this.premode = val;
    this.second_panal.script = null;
    this.script_mapping_show = this.script_mapping.filter(script => script.parent==null);
    try{
      this.showParentMapping(val);
    } catch (e){
      this.script_mapping_show = this.script_mapping.filter(script => script.parent==null)
    }
    this.selected.script = script;
    if (!parent){
      parent=0
    }
    this.selected.id = parent;
  }

  // Counts number of times a mapping type appears in a script.
  // script = script object
  // type = mapping type to search for
  instanceCounter = (script, type) => {
    var instance_count = 0;
    this.scripts[this.selected.script].forEach(mapping => {
      if(mapping!=null){
        if(mapping.type.type == type) {
          instance_count ++;
        }   
      }
      
    });
    instance_count ++;  

    return instance_count;
  }

  onClickAddMapping = (val) =>{
    if (val.parent!=this.scripts[this.selected.script][this.selected.id].type.id){
      return ;
    }
    let last = this.scripts[this.selected.script][this.scripts[this.selected.script].length-1];
    let parent = this.scripts[this.selected.script][this.selected.id]
    let mode = new Mode;

    // Add mode attribute
    mode.id = parseInt(last.id)+1;
    mode.type = val;
    mode.parent_id = this.selected.id;
    mode.level = parent.level+1;
    var instance_count = this.instanceCounter(this.scripts[this.selected.script], val.type);
    mode.name = val.type + " " + instance_count;
    if (val.has_child!=0){
      mode.has_child=1;
    }
    if (parent.level==null){
      mode.level = 0;
    }
    // Reload script directory
    parent.has_child = 1;
    this.hideChildrend(this.selected.script, parent.id);
    this.scripts[this.selected.script].push(mode);
    this.showChildrend(this.selected.script, parent);
    this.selected.id = mode.id;
    this.midiControllerService.changeScript(this.scripts[this.selected.script])
    this.second_panal.script=this.selected.script;
    this.second_panal.id=mode.id;
    // Close premode tab
    this.premode=null;
    this.fileService.writeFile('script/',this.scripts[this.selected.script][0].file_name,this.scripts[this.selected.script]);
  }
  
  onClickSettingIcon = (script, id) => {
    this.clickSettingIcon = true
    if (this.second_panal.script === script && this.second_panal.id===id){
      this.second_panal.script = null
    }
    else{
      this.second_panal.script = script
      this.second_panal.id = id
    }
  }

  onClickItem = (script, id) => {
    if (this.clickSettingIcon == false){
      this.second_panal.script = null
    }
    this.selected.script = script
    this.selected.id = id
    // Select controller input in MDID
    if (this.controllers[this.scripts[this.selected.script][0].controller_id]!=undefined&&this.scripts[this.selected.script][this.selected.id].controller_input_id!=undefined){
      this.midiControllerService.changeSelected(this.controllers[this.scripts[this.selected.script][0].controller_id][this.scripts[this.selected.script][this.selected.id].controller_input_id]);
    }
    else{
      this.midiControllerService.changeSelected(null)
    }
    // Close premode tab
    this.premode=null;
    this.clickSettingIcon = false;
    this.midiControllerService.changeController(this.controllers[this.scripts[this.selected.script][0].controller_id])
    this.midiControllerService.changeScript(this.scripts[this.selected.script])
  }

  onClickInput = () => {
  	this.selectedtemp = JSON.parse(JSON.stringify(this.scripts[this.selected.script][this.selected.id]));
  }
  updateControllerID = (old, controllerInput, id, canInform) =>{
    let first;
    let check=false;
    for (let c of controllerInput){
      if (c!=undefined){
        if (first==undefined){
          first=c;
        }
        try{
          if (c.name==this.controllers[old][id].name){
            id = c.id;
            check = true;
            break;
          }
        }
        catch {}
      }
    }
    if (!check){
      if (first!=undefined){
        id = first.id;
      } 
      canInform = true;
    }

    return [id,canInform];
  }
  onChangeSelectController = (change) => {
    // Change square or width or height
    let old = JSON.parse(JSON.stringify(this.scripts[this.selected.script][this.selected.id].controller_id));
    this.scripts[this.selected.script][this.selected.id].controller_id = change;
    let canInform = false;
    this.scripts[this.selected.script] = this.scripts[this.selected.script].map(s=>{
                                              if (s!=null&&s!=undefined&&this.controllers[old][s.controller_input_id]!=undefined){
                                                let check = false;
                                                let first:any;
                                                let controllerInput = this.controllers[change].filter(s=>s!=undefined&&s.type.type!=undefined&&s.type.type!='Keys'&&s.type.type!="Pads"&&s.type.type!="Container");
                                                for (let c of controllerInput){
                                                  if (c!=undefined){
                                                    if (first==undefined){
                                                      first=c;
                                                    }
                                                    try{
                                                      if (c.name==this.controllers[old][s.controller_input_id].name){
                                                        s.controller_input_id=c.id;
                                                        s.controller_input = c; 
                                                        check = true;
                                                        break;
                                                      }
                                                    }
                                                    catch {}
                                                  }
                                                }
                                                if (!check&&s.controller_input_id!=undefined){
                                                  if (first!=undefined){
                                                    s.controller_input_id = first.id;
                                                    s.controller_input = first;
                                                  }
                                                  canInform = false
                                                }
                                              }
                                              if (s!=null&&s!=undefined && s.drumrack!=undefined){
                                                let first:any;
                                                let controllerInput = this.controllers[change].filter(s=>s!=undefined&&s.type.type!=undefined&&s.type.type!='Keys'&&s.type.type!="Pads"&&s.type.type!="Container"&&s.type.type!="Knob"&&s.type.type!="Slider"&&s.type.type!="Crossfader"&&s.type.type!="Encoder");
                                                for (let d=0; d<s.drumrack.length; d++){
                                                  if (s.drumrack[d]!=null && s.drumrack[d]!=undefined){
                                                    [s.drumrack[d],canInform] = this.updateControllerID(old,controllerInput,s.drumrack[d],canInform)

                                                  } //end if d
                                                }
                                              }
                                              
                                              if (s!=null&&s!=undefined && s.session_box_clips !=undefined){                        
                                                let controllerInputButton = this.controllers[change].filter(s=>s!=undefined&&s.type.type!=undefined&&s.type.type!='Keys'&&s.type.type!="Pads"&&s.type.type!="Container"&&s.type.type!="Knob"&&s.type.type!="Slider"&&s.type.type!="Crossfader"&&s.type.type!="Encoder");
                                                for (let c=0; c<s.session_box_height; c++){
                                                  if (s.session_box_clips[c] !=undefined){
                                                    for (let d=0; d<s.session_box_width; d++){
                                                      if (s.session_box_clips[c][d]!=null && s.session_box_clips[c][d]!=undefined){
                                                        [s.session_box_clips[c][d],canInform] = this.updateControllerID(old,controllerInputButton,s.session_box_clips[c][d],canInform)
                                                      }
                                                    }
                                                  }

                                                  if (s.session_box_scenes[c] != undefined){
                                                    [s.session_box_scenes[c],canInform] = this.updateControllerID(old,controllerInputButton,s.session_box_scenes[c],canInform)
                                                  }
                                                }

                                                let controllerInput = this.controllers[change].filter(s=>s!=undefined&&s.type.type!=undefined&&s.type.type!='Keys'&&s.type.type!="Pads"&&s.type.type!="Container");
                                                for (let c=0; c<s.session_box_width; c++){
                                                  if (s.session_box_stops[c] !=undefined){
                                                    [s.session_box_stops[c],canInform] = this.updateControllerID(old,controllerInput,s.session_box_stops[c],canInform)
                                                  }
                                                }

                                                if (s.session_box_stop_all !=undefined){
                                                  [s.session_box_stop_all,canInform] = this.updateControllerID(old,controllerInput,s.session_box_stop_all,canInform)
                                                }

                                              }

                                              return s});
    if (this.selected.id==0){
      this.midiControllerService.changeController(this.controllers[this.scripts[this.selected.script][0].controller_id])
    }
    if (canInform){
      this.toasterService.pop('error','Error',"Check all 'Controller Input' selections. The new controller does not contain all your selections")
    }
  }

  onChangeScript = (change)=>{
    this.scripts[this.selected.script]=[];
    for (let c of change){
      this.scripts[this.selected.script][c.id]=c;
    }
    this.hideChildrend(this.selected.script, this.selected.id);
    this.scripts[this.selected.script][this.selected.id].has_child=1;
    this.showChildrend(this.selected.script, this.scripts[this.selected.script][this.selected.id]);
    if (this.scripts[this.selected.script][0].file_name != undefined){
        this.fileService.writeFile('script/',this.scripts[this.selected.script][0].file_name,this.scripts[this.selected.script]);
    }
  }

  onChangeName = (script_id?) => {
    if (this.selectedtemp!=this.scripts[this.selected.script][this.selected.id] && this.scripts[this.selected.script][this.selected.id].name) {
      if (this.scripts[this.selected.script][0].file_name != undefined){
        this.fileService.writeFile('script/',this.scripts[this.selected.script][0].file_name,this.scripts[this.selected.script]);
      }
      else{
        if (script_id){
          let fileName = [script_id,'script.json'].join('_');
          let data = this.scripts.filter(script => script.script_id == script_id)[0];
          this.fileService.writeFile('script/',fileName, data);
        }
        else{
          // set script_id and file name
          this.scripts[this.selected.script][this.selected.id].script_id = this.selected.script;
          this.scripts[this.selected.script][this.selected.id].file_name = [this.selected.script,'script.json'].join('_');
          this.fileService.writeFile('script/',this.scripts[this.selected.script][this.selected.id].file_name, this.scripts[this.selected.script]);
          // update script in settings file
          this.fileService.settings.last_script_id +=1;
          this.fileService.updateSettings();
        }
        
      }  	
      this.onClickInput();
    }
  }

  ngOnInit() {
    window.onbeforeunload = () => {
      this.ngOnDestroy()
    }
  }
  ngOnDestroy(){
    this.importServiceSubcribe.unsubscribe();
    $(window).off("contextmenu");
    localStorage.setItem("scripts_show", JSON.stringify(this.scripts_show));
    let array: any = [];
    this.scripts.map(s=>{if (s!=undefined&&s[0].has_child==-1){
      array[s[0].script_id]=-1
    }})
    localStorage.setItem("scripts", JSON.stringify(array));
    localStorage.setItem("scripts_selected", JSON.stringify(this.selected));
  }

  installScript =(script_id,controller_id)=>{
      var scriptJson;
      var controllerJson;
      var scriptsname='';
        this.scripts.forEach(function(value) {
          if(value[0].script_id == script_id){
                scriptJson = value;
                scriptsname = value[0].name;
            }
          });
        this.controllers.forEach(function(value) {
          if(value[0].controller_id == controller_id){
                controllerJson = value;
            }
          });
       $('#ready-'+script_id).hide();
       $('#installing-'+script_id).show();
      if(scriptJson && controllerJson){
        this.httpService.getZip(scriptJson,controllerJson);
        var i =0;
        this.httpService.httpUpdate.subscribe((res)=>{
         if(res.error){
            var errors='';
            res.error.forEach(function(value){
               errors+=value+'\n';
            });
           $('#ready-'+script_id).show();
           $('#installing-'+script_id).hide();
           if(i==0){
           var toast : Toast = {
              type: 'error',
              title: 'Error',
              body: errors,
              showCloseButton: true 
             };
            this.toasterService.pop(toast);
            i++;
            }
          }
          else{
            $('#ready-'+script_id).show();
           $('#installing-'+script_id).hide();
           if(i==0){
           var toast : Toast = {
              type: 'success',
              title: 'Inform',
              body: scriptsname+' installed successfully.',
             };
           this.toasterService.pop(toast);
            i++;
            }
          }
        });
      }
      else{
      
      var toast : Toast = {
              type: 'error',
              title: 'Error',
              body: 'Controller missing',
              showCloseButton: true 
             };
      this.toasterService.pop(toast);
      $('#ready-'+script_id).show();
      $('#installing-'+script_id).hide();
      }
  }
   goTo(){
    shell.openExternal("https://remotify.io/product/control-surface-studio");
  }

}
