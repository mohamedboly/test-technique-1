import { CommonModule } from "@angular/common";
import { Component } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";

import { FrameworkService, TopbarService } from "@nx-nestjs-angular-starter/frontend-shared";

import { map, switchMap } from "rxjs";

import { UpdateFrameworkDTO } from "@nx-nestjs-angular-starter/api/framework";
import { FrameworkFormComponent } from "../components/framework-form.component";

@Component({
	selector: "app-edit-framework-page",
	standalone: true,
	imports: [CommonModule, FrameworkFormComponent],
	template: `
		@if (framework$ | async; as framework) {
			<app-framework-form [framework]="framework" (save)="update(framework.id, $event)" />
		}
	`,
})
export class EditFrameworkPageComponent {
	framework$ = this.route.paramMap.pipe(
		map(params => Number(params.get("id"))),

		switchMap(id => this.frameworkService.readOne(id))
	);

	constructor(
		private frameworkService: FrameworkService,
		private route: ActivatedRoute,
		private router: Router,
		private topbarService: TopbarService
	) {
		this.topbarService.setHeader("Edit framework");
	}

	async update(id: number, dto: UpdateFrameworkDTO) {
		await this.frameworkService.update(id, dto);

		await this.router.navigate(["/app/frameworks"]);
	}
}
