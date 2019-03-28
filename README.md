# Bodega

This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 7.3.6.

## Development server

Run `ng serve` for a dev server. Navigate to `http://localhost:4200/`. The app will automatically reload if you change any of the source files.

## Code scaffolding

Run `ng generate component component-name` to generate a new component. You can also use `ng generate directive|pipe|service|class|guard|interface|enum|module`.

## Build

Run `ng build` to build the project. The build artifacts will be stored in the `dist/` directory. Use the `--prod` flag for a production build.

## Running unit tests

Run `ng test` to execute the unit tests via [Karma](https://karma-runner.github.io).

## Running end-to-end tests

Run `ng e2e` to execute the end-to-end tests via [Protractor](http://www.protractortest.org/).

## Further help

To get more help on the Angular CLI use `ng help` or go check out the [Angular CLI README](https://github.com/angular/angular-cli/blob/master/README.md).

## API

Get a specific food item get /api/food/:name
Get a specific user (Admin) GET /api/admin/user/:name
Get a specific user (That User) GET /api/user/:name
Get all users (Admin) GET /api/User
Get all the food GET /api/food/
Add a food item (Admin, Vendor, Employee) POST /api/food
Update a food item (Admin, Vendor, Employee) PUT /api/food/
Delete a food item (Admin, Vendor, Employee) DELETE /api/food/:name
Delete all food items (Admin, Vendor, Employee) DELETE /api/food
Update a user profile (That User) PUT (/api/user/)
Update user permissions (Admin) PUT (/api/admin/user)
Create a user POST (/api/user)
Delete User (Admin) DELETE (/api/user/:user)
Log in POST (/api/login)
