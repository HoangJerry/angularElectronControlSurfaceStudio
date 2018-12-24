import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { MidiControllerService } from '../../services/midi-controller.service';
import { FileService } from '../../services/file.service';
import { Controller } from '../../models/controller.model';

var $ = require('jquery');

@Component({
  selector: 'app-midi-controller',
  templateUrl: './midi-controller.component.html',
  styleUrls: ['./midi-controller.component.scss']
})
export class MidiControllerComponent implements OnInit {
  controllers : any;
  currentSetting : object;
  knobTemp :any;
  selected:any;
  constructor(private midiControllerService:MidiControllerService,
  			private fileService: FileService,
        private changeDetectorRef: ChangeDetectorRef,
        
  			) {
  }

  // ngAfterViewInit() {
  //   // Open close settingse
  //   $(window).on('click.Bst',(event)=>{
  //     console.log($(event.target));
   
  //   })
  // }

  ngOnInit() {
    this.midiControllerService.currentController
      .subscribe(controller => {
        this.controllers = controller;
    });
  	this.midiControllerService.currentSelected
      .subscribe(selected => {
        this.selected = selected;
        // this.changeDetectorRef.detectChanges();
    });
  	setTimeout(()=>{
  	this.fileService.currentSetting.subscribe(setting => {this.currentSetting = setting});
    },1000);
  }

  onChangeSilder = () =>{
    // this.fileService.writeFile('controller/',this.controllers[0].file_name,this.controllers);
  }

  onChangeKnob = (data) =>{
    // this.knobTemp = data.args.value;
  }

  onBlurKnob = (controller) =>{
    controller = this.knobTemp;
    this.fileService.writeFile('controller/',this.controllers[0].file_name,this.controllers);
  }

  onClickControllerItem = (controller) =>{
    // this.selected=controller;
    event.cancelBubble = true;
    this.midiControllerService.changeSelected(controller);
    this.midiControllerService.changeIndexSelected([this.controllers[0].controller_id,controller.id]);
  }

}
