import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { UtilityService } from './utility.service';
import { Router } from '@angular/router';


@Injectable({
	providedIn: 'root'
})
export class UserService {
	// TODO change to an actual URL for deployment
	private _api = '/api';
	private _apiRegister = this._api + '/register'
	private _apiLogin = this._api + '/login'
	private _apiAdmin = this._api + '/admin/user';
	private _apiUser = this._api + '/user';
	private _apiGuest = this._api + '/guest';

	constructor(
		private _http: HttpClient,
		private _util: UtilityService,
		private _router: Router) {}

	getType(){
		const token = localStorage.getItem('token');
		let payload, type;
		if(token){
			payload=token.split('.')[1]
			payload=window.atob(payload);
			type = JSON.parse(payload).type;
			return type;
		}
		else return null;
	}

	isEmployee(){
		return this.getType() === "employee"
	}

	isVendor(){
		return this.getType() === "vendor"
	}

	isAdmin(){
		return this.getType() === "admin"
	}

	isGuest(){
		return this.getType() === "guest"
	}

	isEVA(){
		const type = this.getType()
		return type === "employee" || type === "vendor" || type === "admin"
	}
	isEA(){
		const type = this.getType()
		return type === "employee" || type === "admin"
	}

	loggedIn(){
		// Generate a guest token if no token exists
		if (!localStorage.getItem('token')) {
			// TODO find a way to not have to subscribe within this function
			this._http.get<any>(this._apiGuest).subscribe(
				res => {
					localStorage.setItem('token', res.token);
				},
				console.log
			);
			return false;
		}
		else {
			return !this.isGuest();
		}
	}

	logout(){
		localStorage.removeItem('token');
		this._router.navigate(['/home']);
	}
	register(user) {
		return this._http.post<any>(this._apiRegister, user);
	}

	login(user) {
		return this._http.post<any>(this._apiLogin, user);
	}

	getUser(username) {
		return this._http.get<any>(this._apiAdmin + '/' + username, this._util.getAuthHeader())
	}

	// As user, get self
	getSelf() {
		var token = this._util.getToken();
		var username = token.username;
		console.log(this._apiUser + '/' + username)
		console.log(this._util.getAuthHeader())
		return this._http.get<any>(this._apiUser + '/' + username, this._util.getAuthHeader())
	}
	getName() {
		var token = this._util.getToken();
		return token.username
	}

	// As admin, get a list of all users
	getAllUsers() {
		return this._http.get<any>(this._apiUser, this._util.getAuthHeader())
	}

	updateUser(user) {
		return this._http.put<any>(this._apiUser, user, this._util.getAuthHeader())
	}

	updateUserAdmin(user) {
		return this._http.put<any>(this._apiAdmin, user, this._util.getAuthHeader())
	}

	deleteUser(username) {
		return this._http.delete<any>(this._apiUser + '/' + username, this._util.getAuthHeader())
	}
}
