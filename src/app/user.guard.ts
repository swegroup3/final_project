import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { UserService } from './user.service';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UserGuard implements CanActivate {

	constructor(private _user: UserService, private _router: Router) { }

  canActivate(): boolean{
  	if (this._user.loggedIn()){
      return true;
    } else {
      this._router.navigate(['/login']);
      alert('Login first');
      return false;
    }
  }
  
}
