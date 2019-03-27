import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable({
	providedIn: 'root'
})
export class DatabaseService {
	private _api = 'http://localhost:4201/api';
	private _apiFoodItem = this._api + '/foodItem';

	constructor(private http: HttpClient) { }

	postFoodItem(foodItem) {
		// im gamer
		return this.http.post<any>(
			this._apiFoodItem,
			foodItem,
			{headers: {['Authorization']: 'im gamer'}});
	}
}
