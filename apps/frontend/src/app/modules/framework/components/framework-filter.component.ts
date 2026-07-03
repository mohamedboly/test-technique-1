import { CommonModule } from "@angular/common";
import { Component, EventEmitter, Input, Output } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { ReadOneCodingLanguage } from "@nx-nestjs-angular-starter/api/coding-language";
import { ReadOneFrameworkType } from "@nx-nestjs-angular-starter/api/framework-type";

@Component({
	selector: "app-framework-filter",
	standalone: true,
	imports: [CommonModule, FormsModule],
	template: `
		<div class="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
			<div class="mb-6 flex items-center justify-between border-b pb-3">
				<h2 class="text-lg font-semibold">Filters</h2>
			</div>

			<!-- Name -->

			<div class="mb-6">
				<label for="name" class="mb-2 block text-sm font-medium"> Name </label>

				<input
					id="name"
					type="text"
					class="w-full rounded-md border border-slate-300 px-3 py-2"
					[ngModel]="name"
					(ngModelChange)="onNameChange($event)"
					placeholder="Search..."
				/>
			</div>

			<!-- Framework Type -->

			<div class="mb-6">
				<h3 class="mb-3 font-semibold">Framework Type</h3>

				@for (type of frameworkTypes; track type.id) {
					<label class="mb-2 flex cursor-pointer items-center gap-2">
						<input
							type="checkbox"
							[checked]="selectedFrameworkTypeIds.includes(type.id)"
							(change)="onFrameworkTypeChecked(type.id, $event)"
						/>

						<span>{{ type.name }}</span>
					</label>
				}
			</div>

			<!-- Coding Language -->

			<div class="mb-6">
				<h3 class="mb-3 font-semibold">Coding Language</h3>

				@for (language of codingLanguages; track language.id) {
					<label class="mb-2 flex cursor-pointer items-center gap-2">
						<input
							type="checkbox"
							[checked]="selectedCodingLanguageIds.includes(language.id)"
							(change)="onCodingLanguageChecked(language.id, $event)"
						/>

						<span>{{ language.name }}</span>
					</label>
				}
			</div>
			<div class="mb-6">
				<label for="releasedAt" class="mb-2 block font-semibold"> Released At </label>

				<input
					id="releasedAt"
					type="date"
					class="w-full rounded-md border border-slate-300 px-3 py-2"
					[ngModel]="releasedAt"
					(ngModelChange)="onReleasedAtChange($event)"
				/>
			</div>

			<div class="mb-6">
				<label for="createdAt" class="mb-2 block font-semibold"> Created At </label>

				<input
					id="createdAt"
					type="date"
					class="w-full rounded-md border border-slate-300 px-3 py-2"
					[ngModel]="createdAt"
					(ngModelChange)="onCreatedAtChange($event)"
				/>
			</div>

			<div>
				<label for="updatedAt" class="mb-2 block font-semibold"> Updated At </label>

				<input
					id="updatedAt"
					type="date"
					class="w-full rounded-md border border-slate-300 px-3 py-2"
					[ngModel]="updatedAt"
					(ngModelChange)="onUpdatedAtChange($event)"
				/>
			</div>
		</div>
	`,
})
export class FrameworkFilterComponent {
	@Input()
	name = "";

	@Output()
	nameChange = new EventEmitter<string>();

	@Input()
	frameworkTypes: ReadOneFrameworkType[] = [];

	@Input()
	selectedFrameworkTypeIds: number[] = [];

	@Output()
	frameworkTypeChange = new EventEmitter<number[]>();

	@Input()
	codingLanguages: ReadOneCodingLanguage[] = [];

	@Input()
	selectedCodingLanguageIds: number[] = [];

	@Output()
	codingLanguageChange = new EventEmitter<number[]>();

	@Input()
	releasedAt: string | null = null;

	@Input()
	createdAt: string | null = null;

	@Input()
	updatedAt: string | null = null;

	@Output()
	releasedAtChange = new EventEmitter<string | null>();

	@Output()
	createdAtChange = new EventEmitter<string | null>();

	@Output()
	updatedAtChange = new EventEmitter<string | null>();

	onNameChange(value: string) {
		this.nameChange.emit(value);
	}

	onFrameworkTypeChecked(id: number, event: Event) {
		const checked = (event.target as HTMLInputElement).checked;

		let ids = [...this.selectedFrameworkTypeIds];

		if (checked) {
			if (!ids.includes(id)) {
				ids.push(id);
			}
		} else {
			ids = ids.filter(value => value !== id);
		}

		this.frameworkTypeChange.emit(ids);
	}

	onCodingLanguageChecked(id: number, event: Event) {
		const checked = (event.target as HTMLInputElement).checked;

		let ids = [...this.selectedCodingLanguageIds];

		if (checked) {
			if (!ids.includes(id)) {
				ids.push(id);
			}
		} else {
			ids = ids.filter(value => value !== id);
		}

		this.codingLanguageChange.emit(ids);
	}

	onReleasedAtChange(value: string) {
		this.releasedAtChange.emit(value || null);
	}

	onCreatedAtChange(value: string) {
		this.createdAtChange.emit(value || null);
	}

	onUpdatedAtChange(value: string) {
		this.updatedAtChange.emit(value || null);
	}
}
