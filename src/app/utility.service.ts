import { Injectable } from '@angular/core';

@Injectable({
	providedIn: 'root'
})
// Some utility functions (i.e. cookies management) for use in other services
export class UtilityService {
	constructor() {}
	
	getToken() {
		return localStorage.getItem('token');
	}

	setToken(token) {
		localStorage.setItem('token', token);
	}

	getAuthHeader() {
		return {
			headers: {
				['Authorization']: this.getToken()
			}
		}
	}
}
