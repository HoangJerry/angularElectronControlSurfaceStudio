import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { ElectronService } from '../../../providers/electron.service'
import { FileService } from '../../../services/file.service'
import { MidiControllerService } from '../../../services/midi-controller.service';

@Component({
  selector: 'app-controller-button',
  templateUrl: './controller-button.component.html',
  styleUrls: ['./controller-button.component.scss']
})
export class ControllerButtonComponent implements OnInit {
  onChangeController = () =>{
    this.button_names_show = this.button_names.filter(s =>{
                              for (let controller of this.controllers.filter(a=>a!=this.selected)){
                                if (controller.name == s.name){
                                  return false;
                                }
                              }
                              return true;
                            });
      if (this.selected.name == undefined){
        this.selected.name = this.button_names_show[0].name;
        this.selected.control_button_left = 4;
        this.selected.control_button_top = 2;
        this.selected.control_button_radius = 4;
        this.onChangeName();
      }
      if (this.selected.button_status==null){
        this.selected.button_status=1;
        this.onChangeName();
      }
      if (this.selected.control_button_shape==null){
        this.selected.control_button_shape=this.selectShape[0];
        this.onChangeName();
      }
      if (this.selected.control_button_align_to==null){
        this.selected.control_button_align_to=this.selectAlignTo[0];
        this.onChangeName();
      }
  }
  @Input() 
  set selectedData(name: string) {
    this.selected = name;
    if (this.controllers!=undefined&&this.button_names!=undefined  ){
      this.onChangeController();
    }
  }

  selected:any;
  selectedtemp : any;
  selectShape = ["Round", "Square"]
  selectAlignTo = ["left","center"];
  button_names :any;
  button_names_show :any;
  controllers: any;
  @Output() changeSelected: EventEmitter<string> =   new EventEmitter();
  constructor(private fileService: FileService, private electronService:ElectronService,
              private midiControllerService:MidiControllerService,) {
    let temp = Array.from(new Array(20),(val,index)=>index+1);
    this.button_names = temp.map(s=>{return {"id":s,"name":"Button "+s}});
    if (this.controllers!=undefined&&this.button_names!=undefined){
      this.onChangeController();
    }
  }

  ngOnInit() {
    this.midiControllerService.currentController
      .subscribe(controller => {
        this.controllers = controller;
        setTimeout(()=>{
          if (this.controllers!=undefined&&this.button_names!=undefined  ){
          this.onChangeController();
        }},10)
    });
  }

  onClickInput = () => {
    let temp = [];
    temp.push(this.selected);
    this.selectedtemp = temp.slice(0,0)[0];
  }
  onChangeName = (script_id?) => {
    if (this.selectedtemp!=this.selected && this.selected.name) {
      this.changeSelected.emit(this.selected);
    }
  }

}
