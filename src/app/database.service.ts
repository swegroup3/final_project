import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { UtilityService } from './utility.service'

@Injectable({
	providedIn: 'root'
})
export class DatabaseService {
	private _api = '/api';
	private _apiFood = this._api + '/food';

	constructor(
		private _http: HttpClient,
		private _util: UtilityService) {}
	//I've rewritten all the services, see comments in user service for details.
	getAllFood() {
		return this._http.get<any>(this._apiFood)
	}

	getFood(name) {
		return this._http.get<any>(this._apiFood)
	}

	createFood(food) {
		return this._http.post<any>(this._apiFood, food, this._util.getAuthHeader())
	}

	updateFood(food) {
		return this._http.put<any>(this._apiFood, food, this._util.getAuthHeader())
	}

	deleteFood(name) {
		this._http.delete<any>(
			this._apiFood + '/' + name, this._util.getAuthHeader())
	}

	deleteAllFood() {
		this._http.delete<any>(this._apiFood, this._util.getAuthHeader())
	}
}
