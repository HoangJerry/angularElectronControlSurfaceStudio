import { Component, OnInit, Input, Output, EventEmitter, ChangeDetectorRef } from '@angular/core';
import { FileService } from '../../../services/file.service'
import { ElectronService } from '../../../providers/electron.service'
import { MidiControllerService } from '../../../services/midi-controller.service';
@Component({
  selector: 'app-controller-slider',
  templateUrl: './controller-slider.component.html',
  styleUrls: ['./controller-slider.component.scss']
})
export class ControllerSliderComponent implements OnInit {
  onChangeController = () =>{
    this.silder_names_show = this.silder_names.filter(s =>{
                              for (let controller of this.controllers.filter(a=>a!=this.selected)){
                                if (controller.name == s.name){
                                  return false;
                                }
                              }
                              return true;
                            });
      if (this.selected.name==null){
        this.selected.name = this.silder_names_show[0].name;
        this.selected.width = 2;
        this.selected.height = 8;
        this.selected.top = 8;
        this.selected.left = 4;
        this.onChangeName();
      }
  }
  @Input() 
  set selectedData(name: string) {
    this.selected = name;
    if (this.controllers!=undefined){
      this.onChangeController();
    }
  }
  selected:any;
  selectedtemp : any;
  silder_names :any;
  silder_names_show :any;
  controllers: any;
  @Output() changeSelected: EventEmitter<string> =   new EventEmitter();
  constructor(private fileService: FileService, private electronService:ElectronService,
  						private midiControllerService:MidiControllerService,
              private changeDetectorRef: ChangeDetectorRef) {
    this.silder_names = require('../../../services/controller-input-names/slider-names.json');
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

  ngOnInit() {
  	this.midiControllerService.currentController
      .subscribe(controller => {
        // this.changeDetectorRef.detectChanges();
        this.controllers = controller;
        setTimeout(()=>{  
          if (this.controllers!=undefined&&this.silder_names!=undefined  ){
            this.onChangeController();
          }
        },10)
    });
  }

}
