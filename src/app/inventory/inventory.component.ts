import { Component, OnInit } from '@angular/core';
import { DatabaseService } from '../database.service';

@Component({
	selector: 'app-inventory',
	templateUrl: './inventory.component.html',
	styleUrls: ['./inventory.component.css']
})
export class InventoryComponent implements OnInit {
	data = {};
	foods = [];

	constructor(private _databaseService: DatabaseService) { }

	ngOnInit() {
		this._databaseService.getAllFood()
				.subscribe(
					res => this.foods = res,
					err => console.log(err)
					);
	}

	post() {
		this._databaseService.createFood(this.data).subscribe(console.log, console.log);
	}

}
