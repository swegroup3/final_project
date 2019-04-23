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
	data = {
		'type': ''
	};
	updateData = {};
	users = [];
	selectedRow = -1;

  	constructor(private _user: UserService, private _router: Router) { }

  	ngOnInit() {
  		this._user.getAllUsers()
				.subscribe(
					res => this.users = res,
					err => console.log(err)
					);
  	}

  	setClickedRow(index){
		this.selectedRow = index;
		console.log(index);
	}

  	updateUserInForm(user) {
		const returnedTarget = Object.assign(this.updateData, user);
	}

	update() {
		window.location.reload();
		this._user.updateUserAdmin(this.updateData).subscribe(
			res => {
				console.log(res);
			},
			err => {
				console.log(err);
			});
	}

  	chooseAccountType(accountType) {
  		if (accountType === 'vendor') {
  			document.getElementById('employeeDiv').style.display = "none";
  			document.getElementById('vendorDiv').style.display = "block";
  		}
  		else if (accountType === 'employee') {
  			document.getElementById('vendorDiv').style.display = "none";
  			document.getElementById('employeeDiv').style.display = "block";
  		}
  	}

  	registerVendor() {
  		window.location.reload();
		this._user.register(this.data)
		.subscribe(
			res => {
				this.data.type = 'vendor';
				console.log(this.data);
				this._user.updateUserAdmin(this.data).subscribe(
					result => {
						console.log(this.data)
					},
					error => {
						console.log(error);
					}
				);
			},
			err => {
				console.log(err);
			}
		);
	}

	registerEmployee() {
		window.location.reload();
		this._user.register(this.data)
		.subscribe(
			res => {
				this.data.type = 'employee';
				console.log(this.data);
				this._user.updateUserAdmin(this.data).subscribe(
					result => {
						console.log(this.data)
					},
					error => {
						console.log(error);
					}
				);
			},
			err => {
				console.log(err);
			}
		);
	}

}
