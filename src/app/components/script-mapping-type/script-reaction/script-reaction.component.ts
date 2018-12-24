import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

export class Condition {
  argument_1 : any;
  argument_1_additional : any;
  operator : any;
  argument_2 : any;
  argument_2_additional:any;
}

export class Reaction {
  assignee : any;
  assignee_additional : any;
  operator : any;
  value_to_assign : any;
  value_to_assign_additional : any;
}

export class ConditionFull extends Condition{
  outer_operator :any = "";
}

@Component({
  selector: 'app-script-reaction',
  templateUrl: './script-reaction.component.html',
  styleUrls: ['./script-reaction.component.scss']
})
export class ScriptReactionComponent implements OnInit {
  @Input() 
  set selectedData(name){
    this.selected=name;
    if (this.selected.reaction_conditions==undefined){
      this.selected.reaction_conditions=[];
      let temp:Condition = new Condition;
      this.selected.reaction_conditions.push(temp);
    }
    if (this.selected.reaction_reactions==undefined){
      this.selected.reaction_reactions = [];
      let temp:Reaction = new Reaction;
      this.selected.reaction_reactions.push(temp);
    }
    setTimeout(()=>{
    if (this.selected.reaction_listener==undefined){
        this.selected.reaction_listener = this.selectListener[1].value;
        this.selected.reaction_conditions[0].argument_1 = this.selectArgument1[1].value;
        this.selected.reaction_conditions[0].operator = this.selectOperator[0];
        this.selected.reaction_conditions[0].argument_2 = this.selectArgument2[0].value;
        this.selected.reaction_reactions[0].assignee = this.selectAssignee[0].value;
        this.selected.reaction_reactions[0].operator = this.selectOperatorReation[0];
        this.selected.reaction_reactions[0].value_to_assign = this.selectArgument2[0].value;
        this.onChangeName();
    }},50)
  }
  @Input() selectControllerInput;
  selected:any;
  selectOuterOperator = ["or", "and"]
  selectArgument1:any = [];
  selectArgument2:any = [];
  selectAssignee:any = [];
  selectValueToAssign:any = [];
  selectLOM:any;
  selectController:any;
  selectListener:any = [];
  selectedtemp:any;
  @Output() changeSelected: EventEmitter<string> =   new EventEmitter();
  constructor() {
    
  }

  ngOnInit() {
    setTimeout(()=>{
      this.selectLOM = this.LOM.map(s=>{return {"name":s,"value":"lom_name="+s}})
      this.selectControllerInput = this.selectControllerInput.filter(s=>s!=undefined&&s.type.type!=undefined&&s.type.type!="Keys"&&s.type.type!="Pads"&&s.type.type!="Container"&&s.type!="Controller")
      this.selectController = this.selectControllerInput.map(s=>{return {'name':s.name,'value':'control_id='+s.id}})
      this.selectListener =  this.selectListener.concat([{'name':'--- Controls','value':null}])
                                                  .concat(this.selectController)
                                                  .concat([{'name':'--- Mixer','value':null}])
                                                  .concat(this.Mixer)
                                                  .concat([{'name':'--- LOM','value':null}])
                                                  .concat(this.selectLOM);
      this.selectListener = this.selectListener.filter(s=>s!=undefined);                      
      this.selectArgument1 = this.selectArgument1.concat([{'name':'--- Controls','value':null}])
                                                .concat(this.selectController)
                                                .concat([{'name':'--- LOM','value':null}])
                                                .concat(this.selectLOM);
      this.selectArgument1 = this.selectArgument1.filter(s=>s!=undefined);                                         
      this.selectArgument2 = this.selectArgument2.concat([{'name':'Input','value':''},
                                                          {'name':'True','value':'True'},
                                                          {'name':'False','value':'False'}])
                                                  .concat([{'name':'--- Controls','value':null}])
                                                  .concat(this.selectController)
                                                  .concat([{'name':'--- LOM','value':null}])
                                                  .concat(this.selectLOM);
      this.selectArgument2 = this.selectArgument2.filter(s=>s!=undefined); 
      this.selectAssignee = this.selectAssignee.concat([{'name':'Show Message','value':'self.show_message'},
                                                          {'name':'Log Message','value':'self.log_message'}])
                                                .concat([{'name':'--- Controls','value':null}])
                                                .concat(this.selectController)
                                                .concat([{'name':'--- LOM','value':null}])
                                                .concat(this.selectLOM);
      this.selectAssignee = this.selectAssignee.filter(s=>s!=undefined); 

    },)
  }


  onClickInput = () => {
    this.selectedtemp = JSON.parse(JSON.stringify(this.selected));
  }
  
  onChangeName = () =>{
    // On change selected listener
    if (this.LOM.filter(s=>this.selected.reaction_listener=="lom_name="+s).length>0){
      this.selectAssignee = [];
      this.selectAssignee = this.selectAssignee.concat([{'name':'Show Message','value':'show message'},
                                                          {'name':'Log Message','value':'log message'}])
                                                .concat([{'name':'--- Controls','value':null}])
                                                .concat(this.selectController)
      this.selectAssignee = this.selectAssignee.filter(s=>s!=undefined);
      this.selected.reaction_reactions.map(s=>s.assignee=this.selectAssignee[0].value);
    }
    else{
      // Not select LOM 
      this.selectAssignee = [];
      this.selectAssignee = this.selectAssignee.concat([{'name':'Show Message','value':'show message'},
                                                          {'name':'Log Message','value':'log message'}])
                                                .concat([{'name':'--- Controls','value':null}])
                                                .concat(this.selectController)
                                                .concat([{'name':'--- LOM','value':null}])
                                                .concat(this.selectLOM);
      this.selectAssignee = this.selectAssignee.filter(s=>s!=undefined); 
    }
    this.changeSelected.emit(this.selected);
  }

  onClickAddCondition = () =>{
    let temp:ConditionFull = new ConditionFull;
    temp.argument_1= this.selectArgument1[1].value;
    temp.operator= this.selectOperator[0];
    temp.outer_operator= this.selectOuterOperator[0];
    temp.argument_2= this.selectArgument2[0].value;
    this.selected.reaction_conditions.push(temp);
    console.log(this.selected)
    this.onChangeName();
  }
  onClickSubCondition = () =>{
    this.selected.reaction_conditions.length-=1;
    this.onChangeName();
  }
  onClickAddReaction = () =>{
    let temp:Reaction = new Reaction;
    temp.assignee = this.selectAssignee[0].value;
    temp.operator = this.selectOperatorReation[0];
    temp.value_to_assign = this.selectArgument2[0].value;
    this.selected.reaction_reactions.push(temp);
    this.onChangeName();
  }
  onClickSubReaction = () =>{
    this.selected.reaction_reactions.length-=1;
    this.onChangeName();
  }
  selectOperator = ["==",">",">=","<","<=","!="]
  selectOperatorReation = ["=","( )"]

  Mixer=[
    {"name":"Track Volume","value":"mixer_name=volume_listener"},
    {"name":"Track Panning","value":"mixer_name=panning_listener"},
    {"name":"Track Mute","value":"mixer_name=mute_listener"},
    {"name":"Track Solo","value":"mixer_name=solo_listener"},
    {"name":"Track Arm","value":"mixer_name=arm_listener"},
  ]

  LOM = ["cue points",
    "return tracks",
    "scenes",
    "tracks",
    "visible tracks",
    "master track",
    "view",
    "appointed device",
    "arrangement overdub",
    "back to arranger",
    "can jump to next cue",
    "can jump to prev cue",
    "can redo",
    "can undo",
    "clip trigger quantization",
    "current song time",
    "exclusive arm",
    "exclusive solo",
    "groove amount",
    "is playing",
    "last event time",
    "loop",
    "loop length",
    "loop start",
    "metronome",
    "midi recording quantization",
    "nudge down",
    "overdub",
    "punch in",
    "punch out",
    "nudge up",
    "re enable automation enabled",
    "record mode",
    "root note",
    "scale name",
    "select on launch",
    "session automation record",
    "session record",
    "session record status",
    "signature denominator",
    "signature numerator",
    "song length",
    "swing amount",
    "tempo",
    "capture and insert scene",
    "continue playing",
    "create audio track",
    "create midi track",
    "create return track",
    "create scene",
    "delete scene",
    "delete track",
    "duplicate scene",
    "duplicate track",
    "find device position",
    "get beats loop length",
    "get beats loop start",
    "get current beats song time",
    "get current smpte song time",
    "is cue point selected",
    "jump by",
    "jump to next cue",
    "jump to prev cue",
    "move device",
    "play selection",
    "re enable automation",
    "redo",
    "scrub by",
    "set or delete cue",
    "start playing",
    "stop all clips",
    "stop playing",
    "tap tempo",
    "trigger session record",
    "undo "]
}
