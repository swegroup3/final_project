import { Component, OnInit } from '@angular/core';
import { CartService } from '../cart.service';
import { Router } from '@angular/router';


@Component({
	selector: 'app-checkout',
	templateUrl: './checkout.component.html',
	styleUrls: ['./checkout.component.css']
})
export class CheckoutComponent implements OnInit {
	cart = []
	error = ""

	constructor(private _cartService: CartService,
	private _router: Router) { }

	ngOnInit() {
		this._cartService.getCart().subscribe(res => {
			this.cart = res.items;
		}, console.log);
	}

	getTotalPrice(){
		let sum = 0;
		for(let i = 0; i < this.cart.length; i++){
			let product = this.cart[i].price * this.cart[i].quantity;
			sum += product;
		}
		return sum;
	}

	purchase() {
		this._cartService.purchaseCart().subscribe(res => {
    		localStorage.setItem("pin",res.pin);
				this._router.navigate(['/confirmation']);
		},
		(err) => {console.log(err)
			this.error = err.error
			this.showError();
		},
		 console.log);


	}

	showError(){
		document.getElementById('submit').style.display = "none";
		document.getElementById('error').style.display = "block";
	}


}
