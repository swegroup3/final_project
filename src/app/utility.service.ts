import { Injectable } from '@angular/core';

@Injectable({
	providedIn: 'root'
})
// Some utility functions (i.e. cookies management) for use in other services
export class UtilityService {
	constructor() {}

	getToken() {
		var rawtoken =  localStorage.getItem('token');
		var payload=rawtoken.split('.')[1]
		payload=window.atob(payload);
		return JSON.parse(payload);
	}

	setToken(token) {
		localStorage.setItem('token', token);
	}

	getAuthHeader() {
		return {
			headers: {
				['Authorization']: localStorage.getItem("token")
			}
		}
	}
}
