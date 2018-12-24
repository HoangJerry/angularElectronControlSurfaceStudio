import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ImportService {
	import:any;
	private importSource = new BehaviorSubject(this.import);
  currentImport = this.importSource.asObservable();

  constructor() { }

  changeImport(message:any){
    this.importSource.next(message);
  }

  private importScriptSource = new BehaviorSubject(this.import);
  currentImportScript = this.importScriptSource.asObservable();

  changeImportScript(message:any){
    this.importScriptSource.next(message);
  }

  private importControllerSource = new BehaviorSubject(this.import);
  currentImportController = this.importControllerSource.asObservable();

  changeImportController(message:any){
    this.importControllerSource.next(message);
  }
}
