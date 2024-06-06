import { Component } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { ApiService } from '../services/api.service';
import { Router } from '@angular/router';


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {

  loginForm = this.fb.group({
    email:["",[Validators.email,Validators.required]],
    password:["",[Validators.pattern('[a-zA-Z0-9]*'),Validators.required]]
  })

  constructor(private fb:FormBuilder,private toaster:ToastrService,private api:ApiService,private router:Router){}

  login(){
    if(this.loginForm.valid){
      const email = this.loginForm.value.email
      const password = this.loginForm.value.password
      console.log(email,password);
      const user = {email,password}
      this.api.loginApi(user).subscribe({
        next:(result:any)=>{
          this.toaster.success(`${result.user.username} has successfully Logged in`)
          sessionStorage.setItem('user',JSON.stringify(result.user))
          sessionStorage.setItem('token',result.token)
          this.loginForm.reset()
          this.api.getwishlistCount()
          this.api.getcartCount()
          this.router.navigateByUrl('')
        },
        error:(reason:any)=>{
          console.log(reason);
          this.toaster.warning(reason.error)
        }
      })
    }
    else{
      this.toaster.info("Invalid Form")
    }
  }
}
