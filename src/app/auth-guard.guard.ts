import { LoginComponent } from './login/login.component';
import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { UserAuthService } from './services/user-auth.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuardGuard implements CanActivate {
  constructor(private authService: UserAuthService,private router:Router){}
  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    // if (this.authService.isUserLogged()) { 
    //   // localStorage.setItem('isLoggedIn', 'true');
    //   return true; 

    // } else {
    //   this.router.navigate(['/login']);
    //   return false;
    // }
    if (this.authService.isUserLogged()) {
      return true;
    } else {
      this.router.navigate(['/login']);
      return false;
    }
  }
  
}
