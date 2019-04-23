import { Component, OnInit } from '@angular/core';
import { UserService } from '../user.service';
import { Router } from '@angular/router';

@Component({
	selector: 'app-account-info',
	templateUrl: './account-info.component.html',
	styleUrls: ['./account-info.component.css']
})
export class AccountInfoComponent implements OnInit {
	updateUserData = {}

	constructor(private _user: UserService,
				private _router: Router) { }

	ngOnInit() {
		this._user.getSelf()
			.subscribe(
					res => {
						this.updateUserData = res;
						console.log(this.updateUserData);
					},
					err => console.log(err)
				);
	}
	updateUser() {
		window.location.reload();
		this._user.updateUser(this.updateUserData)
		.subscribe(
			res => {
			console.log(res);
			//this._router.navigate(['/account']);
			},
			err => {
			console.log(err);
			}
		);
	}


	showConfirm(){
		document.getElementById('confirmation').style.display = "block";
	}

}
