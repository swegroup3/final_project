import { Component, OnInit } from '@angular/core';
import { DatabaseService } from '../database.service';

@Component({
	selector: 'app-internal-testing',
	templateUrl: './internal-testing.component.html',
	styleUrls: ['./internal-testing.component.css']
})
export class InternalTestingComponent implements OnInit {
	data = {};
	updateData = {};
	foods = [];
	selectedRow = -1;

	constructor(private _databaseService: DatabaseService) { }

	ngOnInit() {
		this._databaseService.getAllFood()
				.subscribe(
					res => this.foods = res,
					err => console.log(err)
					);
	}

	post() {
		window.location.reload();
		this._databaseService.createFood(this.data).subscribe(console.log, console.log);
	}

	updateItemInForm(food) {
		const returnedTarget = Object.assign(this.updateData, food);
	}

	delete(food) {
		window.location.reload();
		this._databaseService.deleteFood(food.name).subscribe(console.log, console.log);
	}

	update() {
		window.location.reload();
		this._databaseService.updateFood(this.updateData).subscribe(console.log, console.log);
	}

	setClickedRow(index){
		this.selectedRow = index;
		console.log(index);
	}
}
