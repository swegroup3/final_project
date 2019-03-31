import { Component, OnInit } from '@angular/core';
import { UserService } from '../user.service';
import { Router } from '@angular/router';
import { registerContentQuery } from '@angular/core/src/render3';

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
			localStorage.setItem('token', res.token);
			this._router.navigate(['/home']);
			},
			err => {
			console.log(err);
			}
		);
	}
}
