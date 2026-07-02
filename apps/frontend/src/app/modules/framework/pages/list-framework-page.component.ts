import { CommonModule } from "@angular/common";
import { Component } from "@angular/core";
import { ActivatedRoute, ParamMap, Router } from "@angular/router";
import {
	CodingLanguageService,
	FrameworkService,
	FrameworkTypeService,
	TopbarService,
} from "@nx-nestjs-angular-starter/frontend-shared";
import { FrameworkFilter } from "libs/frontend/src/models/framework-filter";
import { PaginatorModule, PaginatorState } from "primeng/paginator";
import { map, switchMap, tap } from "rxjs";
import { FrameworkCardComponent } from "../components/framework-card.component";
import { FrameworkFilterComponent } from "../components/framework-filter.component";

@Component({
	selector: "app-list-framework-page",
	standalone: true,
	imports: [CommonModule, FrameworkCardComponent, FrameworkFilterComponent, PaginatorModule],
	template: `
		<div class="grid grid-cols-1 lg:grid-cols-[280px_1fr] gap-6">
			<!-- Colonne gauche -->
			<div>
				<app-framework-filter
					[name]="(name$ | async) ?? ''"
					(nameChange)="onNameChange($event)"
					[frameworkTypes]="(frameworkTypes$ | async) ?? []"
					[selectedFrameworkTypeIds]="(frameworkTypeIds$ | async) ?? []"
					(frameworkTypeChange)="onFrameworkTypeChange($event)"
					[codingLanguages]="(codingLanguages$ | async) ?? []"
					[selectedCodingLanguageIds]="(codingLanguageIds$ | async) ?? []"
					(codingLanguageChange)="onCodingLanguageChange($event)"
					[releasedAt]="releasedAt$ | async"
					[createdAt]="createdAt$ | async"
					[updatedAt]="updatedAt$ | async"
					(releasedAtChange)="onReleasedAtChange($event)"
					(createdAtChange)="onCreatedAtChange($event)"
					(updatedAtChange)="onUpdatedAtChange($event)"
				/>
			</div>

			<div class="flex flex-col gap-4">
				<ng-container *ngIf="frameworks$ | async as response">
					@if (loading) {
						<div class="flex items-center justify-center py-16">
							<i class="bi bi-arrow-repeat animate-spin text-3xl text-slate-400"></i>
						</div>
					} @else if (response.data.length === 0) {
						<div class="flex flex-col items-center justify-center gap-2 py-16 text-slate-400">
							<i class="bi bi-box-seam text-4xl"></i>
							<p class="text-sm">Aucun framework trouvé.</p>
						</div>
					} @else {
						<div class="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
							@for (framework of response.data; track framework.id) {
								<app-framework-card [framework]="framework" />
							}
						</div>
					}
					<div class="mb-4">
						<p-paginator
							[rows]="response.pageSize"
							[totalRecords]="response.total"
							[first]="(response.page - 1) * response.pageSize"
							[rowsPerPageOptions]="[12, 24, 48]"
							(onPageChange)="onPageChange($event)"
						/>
					</div>
				</ng-container>
			</div>
			<div></div>
		</div>
	`,
})
export class ListFrameworkPageComponent {
	// frameworks$ = this.frameworkService.readAll().pipe(
	// 	tap(() => (this.loading = false)),
	// );
	// loading = true;

	frameworkTypes$ = this.frameworkTypeService.readAll();

	codingLanguages$ = this.codingLanguageService.readAll();

	queryParams$ = this.route.queryParamMap;

	frameworks$ = this.queryParams$.pipe(
		map(query => this.buildFrameworkFilter(query)),

		switchMap(filter => this.frameworkService.readPage(filter)),

		tap(() => (this.loading = false))
	);

	loading = true;

	readonly name$ = this.route.queryParamMap.pipe(map(params => params.get("name") ?? null));
	readonly frameworkTypeIds$ = this.route.queryParamMap.pipe(
		map(params => params.getAll("frameworkTypeId").map(Number))
	);
	readonly codingLanguageIds$ = this.route.queryParamMap.pipe(
		map(params => params.getAll("codingLanguageId").map(Number))
	);

	readonly releasedAt$ = this.route.queryParamMap.pipe(map(params => params.get("releasedAt")));

	readonly createdAt$ = this.route.queryParamMap.pipe(map(params => params.get("createdAt")));

	readonly updatedAt$ = this.route.queryParamMap.pipe(map(params => params.get("updatedAt")));

	constructor(
		private frameworkService: FrameworkService,
		private codingLanguageService: CodingLanguageService,
		private frameworkTypeService: FrameworkTypeService,
		private topbarService: TopbarService,
		private route: ActivatedRoute,
		private router: Router
	) {
		this.topbarService.setHeader("Frameworks");
	}

	onNameChange(name: string) {
		this.router.navigate([], {
			relativeTo: this.route,
			queryParams: {
				name: name || null,

				page: 1,
			},
			queryParamsHandling: "merge",
		});
	}

	onFrameworkTypeChange(ids: number[]) {
		this.router.navigate([], {
			relativeTo: this.route,

			queryParams: {
				frameworkTypeId: ids.length ? ids : null,

				page: 1,
			},

			queryParamsHandling: "merge",
		});
	}

	onCodingLanguageChange(ids: number[]) {
		this.router.navigate([], {
			relativeTo: this.route,

			queryParams: {
				codingLanguageId: ids.length ? ids : null,

				page: 1,
			},

			queryParamsHandling: "merge",
		});
	}

	onReleasedAtChange(date: string | null) {
		this.router.navigate([], {
			relativeTo: this.route,

			queryParams: {
				releasedAt: date,

				page: 1,
			},

			queryParamsHandling: "merge",
		});
	}

	onCreatedAtChange(date: string | null) {
		this.router.navigate([], {
			relativeTo: this.route,

			queryParams: {
				createdAt: date,

				page: 1,
			},

			queryParamsHandling: "merge",
		});
	}
	onUpdatedAtChange(date: string | null) {
		this.router.navigate([], {
			relativeTo: this.route,

			queryParams: {
				updatedAt: date,

				page: 1,
			},

			queryParamsHandling: "merge",
		});
	}

	onPageChange(event: PaginatorState) {
		this.router.navigate([], {
			relativeTo: this.route,

			queryParams: {
				page: (event.page ?? 0) + 1,

				pageSize: event.rows,
			},

			queryParamsHandling: "merge",
		});
	}

	private buildFrameworkFilter(query: ParamMap): FrameworkFilter {
		return {
			page: Number(query.get("page") ?? 1),

			pageSize: Number(query.get("pageSize") ?? 12),

			sort: (query.get("sort") as FrameworkFilter["sort"]) ?? "name",

			order: query.get("order") === "desc" ? "desc" : "asc",

			name: query.get("name"),

			frameworkTypeIds: query.getAll("frameworkTypeId").map(Number),

			codingLanguageIds: query.getAll("codingLanguageId").map(Number),

			releasedAt: query.get("releasedAt"),

			createdAt: query.get("createdAt"),

			updatedAt: query.get("updatedAt"),
		};
	}
}
