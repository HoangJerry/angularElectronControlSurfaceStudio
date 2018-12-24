import { Component, OnInit } from '@angular/core';
import { HttpService } from '../../services/http.service';
import { FileService } from '../../services/file.service';
import { Router, ActivatedRoute } from '@angular/router';
var $ = require('jquery');
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  model : any = {};
  username : any;
  password : any;
  updateJsonArray : any;
  appVersion : any;
  constructor(private httpService: HttpService,private router: Router,private fileService: FileService) { }
  
  ngOnInit() {
    if(sessionStorage.getItem('UsersData') != null){
      this.router.navigate(['/home']);
    }
       
    this.appVersion = this.httpService.css_version;
    this.httpService.readUpdateJson();
    this.httpService.appUpdate.subscribe((res)=>{
    if(!res.error){
      this.updateJsonArray = JSON.parse(res[0]);
      this.updateJsonArray = this.updateJsonArray[0];
      var server_win_version = this.updateJsonArray['win32-x64-prod']['version'];
      var server_mac_version = this.updateJsonArray['darwin-x64-prod']['version'] 

      $('.box').hide();
      if(process.platform == 'win32' && server_win_version > this.appVersion) {
        // show update form
        $('#b2').show();
      } else if(process.platform == 'darwin' && server_mac_version > this.appVersion) {
        // show update form
        $('#b2').show();
      } else {
        // show login form
        $('#b3').show();
      }
    }
    });
  }
  showModel(id) {
  		$('.box').hide();
  		$('#'+id).show();
  }
  login(){
      $('#login-lead').show();
      if(!this.username){
        $('#login-lead').hide();
        $('.error-login').show();
        $('.error-login').html('!Email or username required');
      }
      else if(!this.password){
        $('#login-lead').hide();
        $('.error-login').show();
        $('.error-login').html('!Password required');
      }
      else{
          $('.error-login').hide();
          $('.error-login').html('');
          this.httpService.username = this.username;
          this.httpService.password = this.password;
          this.httpService.getSessionToken();
          this.httpService.httpUpdate.subscribe((res) =>{
            if(!res.error){
              $('.error-login').hide();
              $('.error-login').html('');
              sessionStorage.setItem('UsersData',JSON.stringify(res));
              this.router.navigate(['/home']);
              $('#login-lead').hide();
            }
            else{
              $('.error-login').html(res.error);
              $('.error-login').show();
              $('#login-lead').hide();
            }
          });
      }
  }
  register(){
    $('#register-lead').show();
    const reg = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if(!this.model.name){
        $('.error-register').show();
        $('.success-forgotPassword').hide();
        $('.error-register').html('!Username required');
        $('#register-lead').hide();
      }
      else if(!this.model.email){
         $('.error-register').show();
         $('.success-forgotPassword').hide();
        $('.error-register').html('!Email address required');
        $('#register-lead').hide();
      }
      else if(reg.test(this.model.email) == false){
         $('.error-register').show();
         $('.success-forgotPassword').hide();
        $('.error-register').html('!Please Enter Valid Email.');
        $('#register-lead').hide();
      }
      else if(!this.model.password){
         $('.error-register').show();
         $('.success-forgotPassword').hide();
        $('.error-register').html('!Password required.');
        $('#register-lead').hide();
      }
      else if(!this.model.cnfpassword){
         $('.error-register').show();
         $('.success-forgotPassword').hide();
        $('.error-register').html('!Confirm Password required.');
        $('#register-lead').hide();
      }
      else if(this.model.password != this.model.cnfpassword){
         $('.error-register').show();
         $('.success-forgotPassword').hide();
        $('.error-register').html('!Confirm password not match.');
        $('#register-lead').hide();
      }
      else{
          this.httpService.model = this.model;
          this.httpService.getRegistered();
          this.httpService.httpUpdate.subscribe((res)=>{
              if(!res.error){
              $('.error-register').hide();
              $('.error-register').html('');
              $('.success-register').show();
              $('.success-register').html('A welcome message with further instructions has been sent to your e-mail address.');
            }
            else{
              $('.error-register').html('');
              $.each(res.error.form_errors,function(i,val){
                $('.error-register').append(val+'<br>');
                
              });
              $('.error-register').show();
              $('.success-register').hide();
            }
          });
          $('#register-lead').hide();
      }
  }
  requestNewPassword(){
  const reg = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    $('#forgot-password').show();
      if(!this.model.forgot_password_email){
        $('#forgot-password').hide();
        $('.error-forgotPassword').show();
        $('.success-forgotPassword').hide();
        $('.error-forgotPassword').html('!Email required');
      }
      /*else if(reg.test(this.model.forgot_password_email) == false){
        $('#forgot-password').hide();
        $('.error-forgotPassword').show();
        $('.success-forgotPassword').hide();
        $('.error-forgotPassword').html('!Enter valid email address');
      }*/
      else{
          this.httpService.model = this.model;
          this.httpService.requestNewPassword();
          this.httpService.httpUpdate.subscribe((res)=>{
              if(!res.error){
              $('.error-forgotPasswordr').hide();
              $('.error-forgotPassword').html('');
              $('.success-forgotPassword').show();
              $('.success-forgotPassword').html('Further instructions have been sent to your e-mail address.');
            }
            else{
              $('.error-forgotPassword').show();
              $('.error-forgotPassword').html(res.error);
               $('.success-forgotPassword').hide();
            }
          });
          $('#forgot-password').hide();

      }
  }
  updateApp(){
    if(process.platform == 'win32'){
      window.location.href=this.updateJsonArray['win32-x64-prod']['update'];
      
    }
    else if(process.platform == 'darwin'){
      window.location.href=this.updateJsonArray['darwin-x64-prod']['update'];
    }

  }
  
 

}
