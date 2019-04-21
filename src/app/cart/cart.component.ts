import { Component, OnInit } from '@angular/core';
import { CartService } from '../cart.service';

@Component({
	selector: 'app-cart',
	templateUrl: './cart.component.html',
	styleUrls: ['./cart.component.css']
})
export class CartComponent implements OnInit {
	cart = []

	constructor(
		private _cartService: CartService) { }

	ngOnInit() {
		this._cartService.getCart().subscribe(res => {
			this.cart = res.items;
		}, console.log);
	}

	remove(foodItemId) {
		window.location.reload();
		this._cartService.deleteItemFromCart(foodItemId).subscribe(console.log, console.log);
	}
}
