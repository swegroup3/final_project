import { Component, OnInit } from '@angular/core';
import { CartService } from '../cart.service';

@Component({
  selector: 'app-checkout',
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.css']
})
export class CheckoutComponent implements OnInit {
  cart = []


  constructor(private _checkoutService: CartService) { }

  ngOnInit() {
    this._checkoutService.getCart().subscribe(res => {
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

}
