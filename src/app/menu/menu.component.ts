import { Component, OnInit } from '@angular/core';
import { UserService } from '../user.service';

@Component({
	selector: 'app-menu',
	templateUrl: './menu.component.html',
	styleUrls: ['./menu.component.css']
})
export class MenuComponent implements OnInit {

	constructor(private _userService: UserService) { }

	ngOnInit() {
	}

}
