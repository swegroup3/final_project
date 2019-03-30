import { Component, OnInit } from '@angular/core';
import { UserService } from '../user.service';
import { Router } from '@angular/router';

@Component({
	selector: 'app-signup',
	templateUrl: './signup.component.html',
	styleUrls: ['./signup.component.css']
})
export class SignupComponent implements OnInit {
	registerUserData = {}
	
	constructor(private _user: UserService,
				private _router: Router) { }

	ngOnInit() {
	}
	registerUser() {
		this._user.register(this.registerUserData)
		.subscribe(
			res => {
			console.log(res);
			localStorage.setItem('token', res.token);
			this._router.navigate(['/home']);
			},
			err => {
			console.log(err);
			}
		);
	}
}
