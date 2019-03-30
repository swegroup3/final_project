import { Component, OnInit } from '@angular/core';
import { DatabaseService } from '../database.service';


@Component({
	selector: 'app-home',
	templateUrl: './home.component.html',
	styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
	
	foods = [];
	constructor(private _databaseService: DatabaseService) { }

	ngOnInit() {
		this._databaseService.getAllFood()
			.subscribe(
				res => this.foods = res,
				err => console.log(err)
				);
	}

}
