import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Mode } from '../../models/script-mode.model';
import { Toast,ToasterModule, ToasterService, ToasterConfig} from 'angular2-toaster';

@Component({
  selector: 'app-script-mapping-type',
  templateUrl: './script-mapping-type.component.html',
  styleUrls: ['./script-mapping-type.component.scss']
})
export class ScriptMappingTypeComponent implements OnInit {
  @Input() 
  set selectedData(name){
    this.selected=name;
    this.onClickInput();
    if(this.selected.minimum==undefined){
      if (this.selected.type.type=='Volume'){
        this.selected.minimum = -69;
        this.selected.maximum = 0;
      }
      if (this.selected.type.type=='Pan'){
        this.selected.minimum = -50;
        this.selected.maximum = 50;
      }
      if (this.selected.type.type=='Tempo'){
        this.selected.minimum = 80;
        this.selected.maximum = 120;
      }
    }
    if (this.selected.type.type=="Device"&&this.selected.device_selector==undefined){
      this.selected.device_selector= "number";
      this.selected.device_selector_input= "";
      this.selected.device_selector_chain_targeting = [];
    }
    if (this.selected.type.type=="Track"&&this.selected.track_type==undefined){
      this.selected.track_type= "track";
      this.selected.track_include_folded=true;
      this.selected.track_number = 1;
      this.selected.track_relative_to_session = true;
    }
    if ((this.selected.type.type=='Volume' || this.selected.type.type=='Pan'||
      this.selected.type.type=='Tempo') && this.selected.snap_to==undefined){
      this.selected.snap_to = "True";
    }
    if ((this.selected.type.type=='Highlight Navigation' || this.selected.type.type=='Session Box Navigation') && this.selected.nav_tracks_or_scenes==undefined){
      this.selected.nav_tracks_or_scenes= "tracks";
      this.selected.highlight_navigation_type = "Select Device Number";
      this.selected.highlight_number= 1;
    }
    setTimeout(()=>{if (this.selected.type.type!='Script'&&
        this.selected.type.type!='Mode'&&
        this.selected.type.type!='Reaction'&&
        this.selected.type.type!='Session Box'&&
        this.selected.type.type!='Drumrack'&&
        this.selected.type.type!='Track'&&
        this.selected.type.type!='Device'&&
        this.selected.type.type!='Parameter Bank'&&
        this.selected.type.type!='Sends'&&
        this.selected.type.type!='Drumpad Mutes'&&
        this.selected.type.type!='Drumpad Solos'&&
        this.selected.type.type!='Drumpad Deletes'&&
        this.selected.type.type!='Drumpad Duplicates'&&
        this.selected.type.type!='Drumpad Selects'&&
        this.selected.type.type!='Clip'){
            if (this.selected.controller_input_id==undefined){
              this.selected.controller_input_id=this.selectControllerInput[0].id;
              this.selected.control="default";
              this.selected.control_type="Absolute";
              this.selected.control_type_takeover_mode="None";
              this.selected.control_type_on=127;
              this.selected.control_type_off=0;
              this.selected.control_type_first=1;
              this.selected.control_type_last=127;
              this.selected.control_type_reverse_mode="off";
              this.selected.control_type_left=1;
              this.selected.control_type_right=127;
              this.selected.control_type_steps=20;
              this.selected.control_type_reverse_mode="False";
            }
      };},10)
    this.onChangeName();
  }
  @Input() 
  set controllers(data:any){
    if (data!=undefined){
      this.controllersInput=data;
      this.selectControllerInput = data.filter(s=>s!=undefined&&s.type.type!=undefined&&s.type.type!='Keys'&&s.type.type!="Pads"&&s.type.type!="Container");
      this.selectControllerButtonInput = data.filter(s=>s!=undefined&&s.type.type!=undefined&&s.type.type!='Keys'&&s.type.type!="Pads"&&s.type.type!="Container"&&s.type.type!="Knob"&&s.type.type!="Slider"&&s.type.type!="Crossfader"&&s.type.type!="Encoder");
    }
  };

  selected:any;
  sessionbox:any;
  controllersInput:any;
  selectControllerInput:any;
  selectControllerButtonInput: any;
  selectedtemp : any;
  selectControlType = ["Absolute","Relative","On/Off","Increment","Decrement"]
  selectTakeoverMode = ["None","Pickup","Value scaling"]
  selectTrackType = ["track", "return", "selected", "master"]
  selectTrackSceneNavType = ["tracks", "scenes"]
  selectHighlightNavType = ["Select track/scene number", "Scroll"]
  selectYesNo = [{"value": true,"display": "Yes"}, 
                {"value": false,"display": "No"}];

  selectOnOff = [{"value": "True","display": "On"},
                {"value": "False","display": "Off"}];

  deviceSelector = ["number", "selected"] // removed name, type 
  selectbankingType = ["Scroll", "Select Bank Number"]
  selectDeviceNavType = ["Scroll", "Select Device Number"]
  @Output() changeSelected: EventEmitter<string> = new EventEmitter();
  @Output() changeScript: EventEmitter<string> = new EventEmitter();
  
  constructor(private toasterService: ToasterService,) {
  	this.selectedtemp = new Mode;
  }
  
  onChangeScript = (change) =>{
    this.changeScript.emit(change);
  }
  //return an array of numbers to use in dropdown lists 

  numberArray = (value, includeZero) => {
    var arr = new Array();
    var i;
    var count = 0;

    // Include Zero option
    if(includeZero == true) {
      arr[count] = 0; 
      count ++;
     }
    for (i = 1; i <= value; i++) {
        arr[count] = i;
        count ++;
    };
    return arr;
  }

  selectTrackNumber = this.numberArray(128, false)

  onClickInput = () => {
    this.selectedtemp = JSON.parse(JSON.stringify(this.selected));
  }

  onChangeName = (script_id?) => {  
    if (this.selectedtemp!=this.selected && this.selected.name) {
      if (this.selectedtemp.controller_input_id!=this.selected.controller_input_id){
        this.selected.controller_input = this.controllersInput[this.selected.controller_input_id];
        this.selected.control="default";
      }

      if(this.selected.minimum>this.selected.maximum){
        this.toasterService.pop('error','Error','Minimum value should be less than maximum value')
        this.selected.minimum = this.selected.maximum
      }

      if(this.selected.control_type_first>this.selected.control_type_last){
        this.toasterService.pop('error','Error','"First" value should be a lower value than "last"')
        this.selected.control_type_first=this.selected.control_type_last;
      }
		  this.changeSelected.emit(this.selected);
      
      this.onClickInput();
    }
  }

  // mapping type script: add deactivated class to rows based on current selection
  addDeactivateClass = ($formElement) => {
   
    var cssClass = "";

    if(this.selected.track_type == "master" || this.selected.track_type == "selected") {
      if($formElement == "track-number" || 
         $formElement == "track-include-folded" ||
         $formElement == "track-relative-to-session-box") {

        cssClass = "deactivated";
      }

    }else if(this.selected.track_type == "return") {
      if($formElement == "track-include-folded" ||
         $formElement == "track-relative-to-session-box") {
        cssClass = "deactivated";
      }
    }

    return cssClass;
  }

  // add to object array of: device selector > chain targeting
  addLevel = () => {
    var newObject = {"device":1,"chain":1};
    this.selected.device_selector_chain_targeting.push(newObject);

    // update the json file
    this.changeSelected.emit(this.selected);
    this.onClickInput();
  }

  // remove last from object array of: device selector > chain targeting
  removeLevel = () => {
    this.selected.device_selector_chain_targeting.pop()
    // update the json file
    this.changeSelected.emit(this.selected);
    this.onClickInput();
  }

  // Deprecated?
  inputChange = (idx, devVal, chainVal) => {
    // input value updates aren't being passed
    console.log(devVal);
    console.log(chainVal);
    // this.selected.device_selector_chain_targeting[idx].device = "yes";
    // this.selected.device_selector_chain_targeting[idx].chain = "no";
    // console.log(this.selected);
  }

  ngOnInit() {

  }

}
