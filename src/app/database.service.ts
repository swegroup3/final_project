import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { UtilityService } from './utility.service'

@Injectable({
	providedIn: 'root'
})
export class DatabaseService {
	private _api = '/api';
	private _apiFood = this._api + '/food';
	private _apiVendorFood = this._api + '/vendor/food';

	constructor(
		private _http: HttpClient,
		private _util: UtilityService) {}
	//I've rewritten all the services, see comments in user service for details.
	getAllFood() {
		return this._http.get<any>(this._apiFood)
	}
	getVendorFood(name) {
		return this._http.get<any>(this._apiVendorFood + '/' + name)
	}
	getFood(name) {
		return this._http.get<any>(this._apiFood)
	}

	createFoodEA(food) {
		return this._http.post<any>(this._apiFood, food, this._util.getAuthHeader())
	}

	updateFoodEA(food) {
		return this._http.put<any>(this._apiFood, food, this._util.getAuthHeader())
	}

	deleteFoodEA(_id) {
		return this._http.delete<any>(
			this._apiFood + '/' + _id, this._util.getAuthHeader())
	}
	createFoodVendor(food) {
		return this._http.post<any>(this._apiVendorFood, food, this._util.getAuthHeader())
	}

	updateFoodVendor(food) {
		return this._http.put<any>(this._apiVendorFood, food, this._util.getAuthHeader())
	}

	deleteFoodVendor(_id) {
		return this._http.delete<any>(
			this._apiVendorFood + '/' + _id, this._util.getAuthHeader())
	}
	deleteAllFood() {
		return this._http.delete<any>(this._apiFood, this._util.getAuthHeader())
	}
}
