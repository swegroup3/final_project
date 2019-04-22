import { Component, OnInit } from '@angular/core';
import { DatabaseService } from '../database.service';
import { UserService } from '../user.service';

@Component({
	selector: 'app-internal-testing',
	templateUrl: './internal-testing.component.html',
	styleUrls: ['./internal-testing.component.css']
})
export class InternalTestingComponent implements OnInit {
	data = {
		vendor: ""
	};
	updateData = {};
	foods = [];
	selectedRow = -1;

	constructor(private _databaseService: DatabaseService, private _user: UserService) { }

	ngOnInit() {
		this.data.vendor = this._user.getName();
		this._databaseService.getVendorFood(this._user.getName())
				.subscribe(
					res => this.foods = res,
					err => console.log(err)
					);
	}

	post() {
		window.location.reload();
		this._databaseService.createFoodVendor(this.data).subscribe(console.log, console.log);
	}

	updateItemInForm(food) {
		const returnedTarget = Object.assign(this.updateData, food);
	}

	delete(food) {
		window.location.reload();
		this._databaseService.deleteFoodVendor(food.name).subscribe(console.log, console.log);
	}

	update() {
		window.location.reload();
		this._databaseService.updateFoodVendor(this.updateData).subscribe(console.log, console.log);
	}

	setClickedRow(index){
		this.selectedRow = index;
		console.log(index);
	}
}
