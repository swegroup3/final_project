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

	// TODO what is this supposed to return
	getAllFood() {
		var temp;

		this._http.get(
			this._apiFood
		).subscribe(res => {
			temp = res;
		}, err => {
			temp = undefined;
		});
	}

	getFood(name) {
		var temp;

		this._http.get(
			this._apiFood
		).subscribe(res => { temp = res }, err => {
			console.log(err);
			temp = undefined;
		});

		return temp;
	}

	createFood(food) {
		var temp;

		this._http.post<any>(
			this._apiFood, food, this._util.getAuthHeader()
		).subscribe(res => { temp = res.status }, err => {
			console.log(err);
			temp = err.status;
		});

		return temp;
	}

	updateFood(food) {
		var temp;

		this._http.put<any>(
			this._apiFood, food, this._util.getAuthHeader()
		).subscribe(res => { temp = res.status }, err => {
			console.log(err);
			temp = err.status;
		});

		return temp;
	}

	deleteFood(name) {
		var temp;

		this._http.delete<any>(
			this._apiFood + '/' + name, this._util.getAuthHeader()
		).subscribe(res => { temp = res.status }, err => {
			console.log(err);
			temp = err.status;
		});

		return temp;
	}

	deleteAllFood() {
		var temp;

		this._http.delete<any>(
			this._apiFood, this._util.getAuthHeader()
		).subscribe(res => {temp = res.status }, err => {
			console.log(err);
			temp = err.status;
		});

		return temp;
	}
}
