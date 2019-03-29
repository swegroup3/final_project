import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http/';
import { FormsModule } from '@angular/forms';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoginComponent } from './login/login.component';
import { CartComponent } from './cart/cart.component';
import { HomeComponent } from './home/home.component';
import { MenuComponent } from './menu/menu.component';
import { PartnerComponent } from './partner/partner.component';
import { InventoryComponent } from './inventory/inventory.component';
import { AboutComponent } from './about/about.component';
import { SignupComponent } from './signup/signup.component';
import { InternalTestingComponent } from './internal-testing/internal-testing.component';
import { HistoryComponent } from './history/history.component';
import { AccountInfoComponent } from './account-info/account-info.component';
import { UpdateformComponent } from './updateform/updateform.component';
import { VendorregistrationComponent } from './vendorregistration/vendorregistration.component';
import { CheckoutComponent } from './checkout/checkout.component';



@NgModule({
	declarations: [
		AppComponent,
		LoginComponent,
		CartComponent,
		HomeComponent,
		MenuComponent,
		PartnerComponent,
		InventoryComponent,
		AboutComponent,
		SignupComponent,
		InternalTestingComponent,
		HistoryComponent,
		AccountInfoComponent,
		UpdateformComponent,
		VendorregistrationComponent,
		CheckoutComponent
	],
	imports: [
		BrowserModule,
		AppRoutingModule,
		HttpClientModule,
		FormsModule
	],
	providers: [],
	bootstrap: [AppComponent]
})
export class AppModule { }
