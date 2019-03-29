import { NgModule, Component } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { LoginComponent } from './login/login.component';
import { CartComponent } from './cart/cart.component';
import { PartnerComponent } from './partner/partner.component';
import { InventoryComponent } from './inventory/inventory.component';
import { AboutComponent } from './about/about.component';
import { SignupComponent } from './signup/signup.component';
import { InternalTestingComponent } from './internal-testing/internal-testing.component';
import { HistoryComponent } from './history/history.component';
import { AccountInfoComponent } from './account-info/account-info.component';
import { UpdateformComponent } from './updateform/updateform.component';
import { VendorregistrationComponent } from './vendorregistration/vendorregistration.component';


const routes: Routes = [
	{
		path: '',
		redirectTo: 'home',
		pathMatch: 'full'
	},
	{
		path: 'home',
		component: HomeComponent
	},
	{
		path: 'login',
		component: LoginComponent
	},
	{
		path: 'cart',
		component: CartComponent
	},
	{
		path: 'partner',
		component: PartnerComponent
	},
	{
		path: 'inventory',
		component: InventoryComponent
	},
	{
		path: 'about',
		component: AboutComponent
	},
	{
		path: 'signup',
		component: SignupComponent
	},
	{
		path: 'debug',
		component: InternalTestingComponent
	},
	{
		path: 'history',
		component: HistoryComponent
	},
	{
		path: 'account',
		component: AccountInfoComponent
	},
	{
		path: 'updateform',
		component: UpdateformComponent
	},
	{
		path: 'vendorreg',
		component: VendorregistrationComponent
	}
];

@NgModule({
	imports: [RouterModule.forRoot(routes)],
	exports: [RouterModule]
})
export class AppRoutingModule { }
