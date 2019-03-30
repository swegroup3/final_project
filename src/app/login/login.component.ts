import { Component, OnInit } from '@angular/core';
import { UserService } from '../user.service';
import { Router } from '@angular/router';

@Component({
	selector: 'app-login',
	templateUrl: './login.component.html',
	styleUrls: ['./login.component.css']
})

export class LoginComponent implements OnInit {
	loginUserData = {}
	constructor(private _user: UserService,
				private _router: Router) {}

	ngOnInit() {
	}
	
	loginUser() {
	  
	var failed = document.getElementById("loginFailed");
    this._user.login(this.loginUserData)
      .subscribe(
        res => {
          console.log(res);
          localStorage.setItem('token', res.token);
          this._router.navigate(['/home']);
		  failed.style.display = "none";
        },
        err => {
		  failed.style.display = "block";
          console.log(err);
        }
      );
  }
}

