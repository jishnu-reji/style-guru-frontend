import { Component } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { ApiService } from '../services/api.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent {

  registerForm = this.fb.group({
    username:["",[Validators.pattern('[a-zA-Z]*'),Validators.required]],
    email:["",[Validators.email,Validators.required]],
    password:["",[Validators.pattern('[a-zA-Z0-9]*'),Validators.required]]
  })
  constructor(private fb:FormBuilder,private toaster:ToastrService,private api:ApiService,private router:Router){}

  register(){
    if(this.registerForm.valid){
      const username = this.registerForm.value.username
      const email = this.registerForm.value.email
      const password = this.registerForm.value.password
      console.log(username,email,password);
      const user = {username,email,password}
      this.api.registerApi(user).subscribe({
        next:(result:any)=>{
          this.toaster.success(`${result.username} has successfully registered`)
          this.registerForm.reset()
          this.router.navigateByUrl('/login')
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
