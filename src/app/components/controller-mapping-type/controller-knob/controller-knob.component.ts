import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { ElectronService } from '../../../providers/electron.service'
import { FileService } from '../../../services/file.service'
import { MidiControllerService } from '../../../services/midi-controller.service';

@Component({
  selector: 'app-controller-knob',
  templateUrl: './controller-knob.component.html',
  styleUrls: ['./controller-knob.component.scss']
})
export class ControllerKnobComponent implements OnInit {
  onChangeController = () =>{
    this.knob_names_show = this.knob_names.filter(s =>{
                              for (let controller of this.controllers.filter(a=>a!=this.selected)){
                                if (controller.name == s.name){
                                  return false;
                                }
                              }
                              return true;
                            });
      if (this.selected.name==null){
        this.selected.name = this.knob_names_show[0].name;
        this.selected.control_knob_align_to = this.selectAlignTo[0];
        this.selected.control_knob_radius = 4;
        this.selected.control_knob_left = 4;
        this.selected.control_knob_top = 4;
        this.onChangeName();
      }
  }
  @Input() 
  set selectedData(name: string) {
    this.selected = name;
    this.onClickInput();
    if (this.controllers!=undefined&&this.knob_names!=undefined  ){
      this.onChangeController();
    }
  }

  selected:any;
  selectedtemp:any;
  selectAlignTo = ["left","center"];
  knob_names :any;
  knob_names_show :any;
  controllers: any;
  @Output() changeSelected: EventEmitter<string> =   new EventEmitter();
  constructor(private fileService: FileService, private electronService:ElectronService,
              private midiControllerService:MidiControllerService,) {
      this.knob_names = require('../../../services/controller-input-names/knob-names.json');
  }

  ngOnInit() {
    this.midiControllerService.currentController
      .subscribe(controller => {
        // this.changeDetectorRef.detectChanges();
        this.controllers = controller;
        setTimeout(()=>{        
          if (this.controllers!=undefined&&this.knob_names!=undefined  ){
            this.onChangeController();
          }
        },10)
    });
  }

  onClickInput = () => {
    this.selectedtemp = JSON.parse(JSON.stringify(this.selected));
    console.log(this.selectedtemp);
    console.log("change!!!!!!!!!!!")
  }

  onChangeName = (script_id?) => {
    console.log(this.selectedtemp!=this.selected)
    if (this.selectedtemp!=this.selected && this.selected.name) {
      console.log("ch");
      if (this.selectedtemp==undefined||(this.selectedtemp!=undefined&&this.selectedtemp.control_knob_radius!=this.selected.control_knob_radius)){
        localStorage.setItem("control_knob_radius","true");
      }
			this.changeSelected.emit(this.selected);
    }
  }

}
