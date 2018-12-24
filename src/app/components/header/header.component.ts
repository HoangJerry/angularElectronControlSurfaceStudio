import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FileService } from '../../services/file.service';
var $ = require('jquery');
const {shell} = require('electron');
@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {

  constructor(private router: Router,public fileService: FileService) { 
  	this.fileService.isError = false;
  }

  ngOnInit() {
 	$('ul li').click(function(){
 		
		
		var displayProperty = $(this).find('div').css('display');
		if(displayProperty == 'block'){
			$('.dropdown').hide();
			$(this).find('div').css('display','none');
		}
		if(displayProperty == 'none'){
			$('.dropdown').hide();
			$(this).find('div').css('display','block');
		}
		return false;
	});
	$('.container').click(function(e){
		e.stopPropagation();
	});
	$(document).click(function(){
	 	$('.dropdown').hide();
	 	
	});
	var userData = JSON.parse(sessionStorage.getItem('UsersData'));
      if(userData != null){
        if(userData.user.roles[5] == 'lifetime'){
          this.fileService.purchasedApp = true;
        }
        else{
          this.fileService.purchasedApp = false;
        }
      }
	
		
	
	
  }
  logout(){
  	sessionStorage.clear();
  	this.router.navigate(['/']);
  }
  goTo(){
  	shell.openExternal("https://remotify.io");
  }

}
