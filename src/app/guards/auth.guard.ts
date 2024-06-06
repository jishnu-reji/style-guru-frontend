import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { ToastrService } from 'ngx-toastr';

export const authGuard: CanActivateFn = () => {
  const authService = inject(AuthService)
  const router = inject(Router)
  const toaster = inject(ToastrService)
  if(authService.isLoggedin()){
    return true
  }
  else{
    toaster.warning("Operation denied!!! Please login...")
    router.navigateByUrl("/login")
    return false
  }
};
