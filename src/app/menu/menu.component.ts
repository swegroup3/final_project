import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { UserService } from '../user.service';

@Component({
	selector: 'app-menu',
	templateUrl: './menu.component.html',
	styleUrls: ['./menu.component.css']
})
export class MenuComponent implements OnInit {
	@ViewChild('navbarToggler') navbarToggler: ElementRef;

	constructor(private _userService: UserService) { }

	ngOnInit() {
	}

	collapse() {
		if (this.navbarToggler.nativeElement.offsetParent !== null) {
			this.navbarToggler.nativeElement.click();
		}
	}
}
