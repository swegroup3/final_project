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

	constructor(
		private _http: HttpClient,
		private _util: UtilityService,
		private _router: Router) {}

		
	/*I've rewritten the service functions, see the comment on login for details.
	register(username, password, email) {
		var userData = {
			username: username,
			type: '',
			email: email,
			password: password
		};
		
		var temp;

		this._http.post(
			this._apiRegister, userData
		).subscribe(res => { temp = res }, err => {
			console.log(err);
			temp = err;
		});

		return temp;
	}
	*/
	
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
	
	isEVA(){
		const type = this.getType()
		return type === "employee" || type === "vendor" || type === "admin"
	}
	
	loggedIn(){
		return !!localStorage.getItem('token');
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
	
	/* I've left this up as a reference, but there are a couple of issues with it. We don't want the username and password directly here, we want a user object based on the schema we defined earlier. We also don't want to use .subscribe here or do error handling here, we should leave that to the page that calls these functions.  See here: https://blog.angularindepth.com/when-to-subscribe-a83332ae053
	
	login(username, password) {
		var userData = {
			username: username,
			password: password
		};

		var temp;

		this._http.post<any>(
			this._apiLogin, userData
		).subscribe(res => {
			this._util.setToken(res.token);
			temp = res.status;
		}, err => {
			console.log(err);
			temp = err.status;
		});
		return temp;
	}
*/
	// As admin, get a specific user
	/*getUser(username) {
		var temp;

		this._http.get(
			this._apiAdmin + '/' + username, this._util.getAuthHeader()
		).subscribe(res => { temp = res }, err => {
			console.log(err);
			temp = undefined;
		});

		return temp;
	}*/
	getUser(username) {
		return this._http.get(this._apiAdmin + '/' + username, this._util.getAuthHeader())
	}

	// As user, get self
	getSelf() {
		var token = this._util.getToken();
		var username = JSON.parse(token).username;
		return this._http.get(this._apiUser + '/' + username, this._util.getAuthHeader())
	}

	// As admin, get a list of all users
	// TODO what is this supposed to return
	getAllUsers() {
		return this._http.get(this._apiUser, this._util.getAuthHeader())
	}

	updateUser(user) {
		return this._http.put<any>(this._apiUser, user, this._util.getAuthHeader())
	}

	updateUserAdmin(user) {
		return this._http.put<any>(this._apiAdmin, user, this._util.getAuthHeader())
	}

	deleteUser(username) {
		this._http.delete<any>(this._apiAdmin + '/' + username, this._util.getAuthHeader())
	}
}
