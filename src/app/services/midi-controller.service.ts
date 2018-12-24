import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Controller } from '../models/controller.model';
import { FileService } from '../services/file.service';
@Injectable({
  providedIn: 'root'
})
export class MidiControllerService {
  controller : Controller = new Controller;
  temp:any;
  private messageSource = new BehaviorSubject(this.temp);
  currentController = this.messageSource.asObservable();
  style = document.querySelector('[data="slider"]');
  
  private selectedSource = new BehaviorSubject(this.controller);
  currentSelected = this.selectedSource.asObservable();
  
  private selectedIndexSource = new BehaviorSubject(this.controller);
  currentIndexSelected = this.selectedIndexSource.asObservable();
  
  private scriptSource = new BehaviorSubject(this.temp);
  currentScript =  this.scriptSource.asObservable();


  constructor() {

  }

  changeController(message: Controller) {
    if (message!=undefined){
      let controllers = Object.keys(message).map(key => message[key]);
      this.style.innerHTML = '';
      for (let controller of controllers){
        if (controller.type.type=="Slider"){
          this.style.innerHTML += ".slider#slider-"+controller.id+"::-webkit-slider-thumb { height: " + controllers[0].square_size*controller.width + "px !important; }";
        }
        if (controller.type.type=="Crossfader"){
          this.style.innerHTML += ".slider#crossfader-"+controller.id+"::-webkit-slider-thumb { height: " + controllers[0].square_size*controller.height + "px !important; }";
        }
      }
    } 
    this.messageSource.next(message);
  }

  changeSelected(message:any){
    this.selectedSource.next(message);
  }

  changeScript(message:any){
    this.scriptSource.next(message);
  }

  changeIndexSelected(message:any){
    this.selectedIndexSource.next(message);
  }

}
