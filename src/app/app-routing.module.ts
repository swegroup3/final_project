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
import { VendorregistrationComponent } from './vendorregistration/vendorregistration.component';
import { CheckoutComponent } from './checkout/checkout.component';
import { OrderconfirmationComponent } from './orderconfirmation/orderconfirmation.component';
import { AdminDashComponent } from './admin-dash/admin-dash.component';
import {AdminGuard} from './admin.guard';
import {EvaGuard} from './eva.guard';
import {VendorGuard} from './vendor.guard';
import {UserGuard} from './user.guard';


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
		path: 'vendor',
		component: InternalTestingComponent,
		canActivate: [EvaGuard]
	},
	{
		path: 'history',
		component: HistoryComponent
	},
	{
		path: 'account',
		component: AccountInfoComponent,
		canActivate: [UserGuard]
	},
	{
		path: 'vendorreg',
		component: VendorregistrationComponent
	},
	{
		path: 'checkout',
		component: CheckoutComponent
	},
	{
		path: 'confirmation',
		component: OrderconfirmationComponent
	},
	{
		path: 'admin',
		component: AdminDashComponent,
		canActivate: [AdminGuard]
	}
];

@NgModule({
	imports: [RouterModule.forRoot(routes)],
	exports: [RouterModule]
})
export class AppRoutingModule { }
