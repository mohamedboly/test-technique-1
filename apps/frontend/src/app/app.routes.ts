import { Route } from "@angular/router";
import { MainLayoutComponent } from "@nx-nestjs-angular-starter/frontend-shared";
import { CreateFrameworkPageComponent } from "./modules/framework/pages/create-framework-page.component";
import { ListFrameworkPageComponent } from "./modules/framework/pages/list-framework-page.component";
import { EditFrameworkPageComponent } from "./modules/framework/pages/edit-framework-page.component";

export const appRoutes: Route[] = [
	{
		path: "app",
		component: MainLayoutComponent,
		children: [
			{
				path: "frameworks",
				component: ListFrameworkPageComponent,
			},
			{
				path: "frameworks/new",
				component: CreateFrameworkPageComponent,
			},
			{
				path: "frameworks/:id/edit",
				component: EditFrameworkPageComponent,
			},
		],
	},
	{
		path: "**",
		pathMatch: "full",
		redirectTo: "/app/frameworks",
	},
];
