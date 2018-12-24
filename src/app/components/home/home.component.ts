import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { ElectronService } from '../../providers/electron.service';
import { FileService } from '../../services/file.service'
import { Observable } from 'rxjs';
import { ImportService } from '../../services/import.service';
import { Router, ActivatedRoute } from '@angular/router';


const electron = require('electron');
const Menu = electron.Menu;
const MenuItem = electron.MenuItem;
@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  switchManager = 'scriptManager';
  showHideControllerMapping = false;

  text = "";
  name = "";
  importManager = "";
  constructor(private electron: ElectronService,
              private fileService: FileService,
              private importService:ImportService,
              private router: Router,
              private changeDetectorRef: ChangeDetectorRef,){
    
  }

  ngAfterViewInit() {
    // const ctxMenu = new Menu();
    // ctxMenu.append(new MenuItem({
    //   label:'Hello'
    // }))

  }

  ngOnDestroy(){
    window.onbeforeunload = function() {
        localStorage.clear();
    }
  }
  
  ngOnInit() {
      if(sessionStorage.getItem('UsersData') == null){
        this.router.navigate(['/']);
      }
      // window.onbeforeunload = function() {
      //  localStorage.clear();
      // };

      this.importService.currentImport.subscribe((val)=>{
        this.importManager=val;
        this.changeDetectorRef.detectChanges();
      })
  }

  onChangeSelected = (change) => {
    this.switchManager=change;
  }

  // openFile = () => {
  //   this.fileService.openFile().then((res) => {
  //      this.name = res;
  //   })
  // }
  
  // writeFile = () => {
  //   this.fileService.writeFile(this.name,this.text);
  // }

  // readFile = () => {
  //   this.fileService.readFile(this.name).then((res) => {
  //     this.text = res;
  //   })
  // }

  // deleteFile = () => {
  //   this.fileService.deleteFile(this.name);
  //   this.name = '';
  //   this.text = '';
  // }
  
  closeWindow() {
    this.electron.window.close();
  }

  minimizeWindow() {
    this.electron.window.minimize();
  }
}
