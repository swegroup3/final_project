import { Component, OnInit } from '@angular/core';
import { UserService } from '../user.service';
import { Router } from '@angular/router';
import { registerContentQuery } from '@angular/core/src/render3';

@Component({
  selector: 'app-admin-dash',
  templateUrl: './admin-dash.component.html',
  styleUrls: ['./admin-dash.component.css']
})
export class AdminDashComponent implements OnInit {
	data = {}

  	constructor(private _user: UserService, private _router: Router) { }

  	ngOnInit() {
  	}
  	registerVendor() {
		this._user.register(this.data)
		.subscribe(
			res => {
			console.log(this.data)
			localStorage.setItem('token', res.token);
			this._router.navigate(['/home']);
			},
			err => {
			console.log(err);
			}
		);
	}
}
