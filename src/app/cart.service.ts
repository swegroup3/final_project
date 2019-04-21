import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { UtilityService } from './utility.service'
import { getToken } from '@angular/router/src/utils/preactivation';

@Injectable({
	providedIn: 'root'
})
export class CartService {
	private _api = '/api';
	private _apiCart = this._api + '/cart';
	private _apiPurchase = this._apiCart + '/purchase';

	constructor(
		private _http: HttpClient,
		private _util: UtilityService) {}
	
	addItemToCart(foodItemId) {
		var data = {
			username: this._util.getToken().username,
			id: foodItemId
		};
		return this._http.post<any>(this._apiCart, data, this._util.getAuthHeader());
	}

	getCart() {
		var username = this._util.getToken().username;
		return this._http.get<any>(this._apiCart + '/' + username, this._util.getAuthHeader());
	}

	deleteItemFromCart(foodItemId) {
		var data = {
			username: this._util.getToken().username,
			id: foodItemId
		};
		return this._http.put<any>(this._apiCart, data, this._util.getAuthHeader());
	}

	purchaseCart() {
		var data = {
			username: this._util.getToken().username
		};
		return this._http.post<any>(this._apiPurchase, data, this._util.getAuthHeader());
	}
}
