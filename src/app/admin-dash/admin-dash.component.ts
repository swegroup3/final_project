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

  	delete(username) {
  		window.location.reload();
  		this._user.deleteUser(username).subscribe(console.log, console.log);
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
		this._user.register(this.data)
		.subscribe(
			res => {
				window.location.reload();
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
		this._user.register(this.data)
		.subscribe(
			res => {
				window.location.reload();
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
