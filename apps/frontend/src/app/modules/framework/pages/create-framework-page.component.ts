import { Component } from "@angular/core";
import { Router } from "@angular/router";

import { CreateFrameworkDTO } from "@nx-nestjs-angular-starter/api/framework";

import { FrameworkService, TopbarService } from "@nx-nestjs-angular-starter/frontend-shared";

import { FrameworkFormComponent } from "../components/framework-form.component";

@Component({
	selector: "app-create-framework-page",
	standalone: true,
	imports: [FrameworkFormComponent],
	template: ` <app-framework-form (save)="create($event)" /> `,
})
export class CreateFrameworkPageComponent {
	constructor(
		private frameworkService: FrameworkService,
		private router: Router,
		private topbarService: TopbarService
	) {
		this.topbarService.setHeader("New framework");
	}

	async create(dto: CreateFrameworkDTO) {
		await this.frameworkService.create(dto);

		await this.router.navigate(["/app/frameworks"]);
	}
}
