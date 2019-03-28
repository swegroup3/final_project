import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { UtilityService } from './utility.service';

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
		private _util: UtilityService) {}

	register(username, password, email) {
		var userData = {
			username: username,
			type: '',
			email: email,
			password: password
		};
		
		var temp;

		// Apologies in advance for this god-awful function call,
		// I have no idea how to make this look neater while still returning useful data.
		this._http.post(
			this._apiRegister, userData
		).subscribe(res => { temp = res }, err => {
			console.log(err);
			temp = err;
		});

		return temp;
	}

	// TODO what is this supposed to return
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

	// As admin, get a specific user
	getUser(username) {
		var temp;

		this._http.get(
			this._apiAdmin + '/' + username, this._util.getAuthHeader()
		).subscribe(res => { temp = res }, err => {
			console.log(err);
			temp = undefined;
		});

		return temp;
	}

	// As user, get self
	getSelf() {
		var token = this._util.getToken();
		var username = JSON.parse(token).username;

		var temp;

		this._http.get(
			this._apiUser + '/' + username, this._util.getAuthHeader()
		).subscribe(res => { temp = res }, err => {
			console.log(err);
			temp = undefined;
		});

		return temp;
	}

	// As admin, get a list of all users
	// TODO what is this supposed to return
	getAllUsers() {
		var temp;

		this._http.get(
			this._apiUser, this._util.getAuthHeader()
		).subscribe(res => { temp = res }, err => {
			console.log(err);
			temp = undefined;
		});

		return temp;
	}

	updateUser(username, email) {
		var userData = {
			username: username,
			email: email
		};

		var temp;

		this._http.put<any>(
			this._apiUser, userData, this._util.getAuthHeader()
		).subscribe(res => { temp = res }, err => {
			console.log(err);
			temp = undefined;
		});

		return temp;
	}

	updateUserType(username, type) {
		// pls work
		var userData = { username, type };

		var temp;

		this._http.put<any>(
			this._apiAdmin, userData, this._util.getAuthHeader()
		).subscribe(res => { temp = res }, err => {
			console.log(err);
			temp = undefined;
		});

		return temp;
	}

	deleteUser(username) {
		var temp;

		this._http.delete<any>(
			this._apiAdmin + '/' + username, this._util.getAuthHeader()
		).subscribe(res => { temp = res }, err => {
			console.log(err);
			temp = undefined;
		});

		return temp;
	}
}
