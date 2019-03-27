import { Component, OnInit } from '@angular/core';
import { DatabaseService } from '../database.service';

@Component({
	selector: 'app-internal-testing',
	templateUrl: './internal-testing.component.html',
	styleUrls: ['./internal-testing.component.css']
})
export class InternalTestingComponent implements OnInit {
	data = {};

	constructor(private _databaseService: DatabaseService) { }

	ngOnInit() {
	}

	post() {
		this._databaseService.postFoodItem(this.data).subscribe(
			res => {
				console.log(res);
			},
			err => {
				console.log(err);
			}
		);
	}
}
