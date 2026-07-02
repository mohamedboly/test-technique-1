import { CommonModule } from "@angular/common";
import { Component, EventEmitter, Input, OnInit, Output } from "@angular/core";
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from "@angular/forms";

import { CreateFrameworkDTO, ReadOneFramework } from "@nx-nestjs-angular-starter/api/framework";

import { CodingLanguageService, FrameworkTypeService } from "@nx-nestjs-angular-starter/frontend-shared";

@Component({
	selector: "app-framework-form",
	standalone: true,
	imports: [CommonModule, ReactiveFormsModule],
	template: `
		<form
			[formGroup]="form"
			(ngSubmit)="onSubmit()"
			class="mx-auto flex max-w-2xl flex-col gap-6 rounded-xl border border-slate-200 bg-white p-6 shadow-sm"
		>
			<h2 class="text-xl font-semibold">
				{{ framework ? "Edit framework" : "New framework" }}
			</h2>

			<div>
				<label class="mb-1 block"> Name </label>

				<input type="text" formControlName="name" class="w-full rounded border border-slate-300 px-3 py-2" />
			</div>

			<div>
				<label class="mb-1 block"> Image URL </label>

				<input type="text" formControlName="img" class="w-full rounded border border-slate-300 px-3 py-2" />
			</div>

			<div>
				<label class="mb-1 block"> Coding language </label>

				<select formControlName="codingLanguageId" class="w-full rounded border border-slate-300 px-3 py-2">
					<option [value]="null">Choose...</option>

					@if (codingLanguages$ | async; as codingLanguages) {
						@for (language of codingLanguages; track language.id) {
							<option [value]="language.id">
								{{ language.name }}
							</option>
						}
					}
				</select>
			</div>

			<div>
				<label class="mb-1 block"> Framework type </label>

				<select formControlName="frameworkTypeId" class="w-full rounded border border-slate-300 px-3 py-2">
					<option [value]="null">Choose...</option>

					@if (frameworkTypes$ | async; as frameworkTypes) {
						@for (type of frameworkTypes; track type.id) {
							<option [value]="type.id">
								{{ type.name }}
							</option>
						}
					}
				</select>
			</div>

			<div>
				<label class="mb-1 block"> Released at </label>

				<input
					type="date"
					formControlName="releasedAt"
					class="w-full rounded border border-slate-300 px-3 py-2"
				/>
			</div>

			<div class="flex justify-end">
				<button type="submit" class="rounded bg-blue-600 px-5 py-2 text-white hover:bg-blue-700">Save</button>
			</div>
		</form>
	`,
})
export class FrameworkFormComponent implements OnInit {
	@Input()
	framework?: ReadOneFramework;

	@Output()
	save = new EventEmitter<CreateFrameworkDTO>();

	form!: FormGroup;

	frameworkTypes$ = this.frameworkTypeService.readAll();

	codingLanguages$ = this.codingLanguageService.readAll();

	constructor(
		private fb: FormBuilder,
		private frameworkTypeService: FrameworkTypeService,
		private codingLanguageService: CodingLanguageService
	) {}

	ngOnInit(): void {
		this.form = this.fb.group({
			name: [this.framework?.name ?? "", Validators.required],

			img: [this.framework?.img ?? "", Validators.required],

			codingLanguageId: [this.framework?.codingLanguage.id ?? null, Validators.required],

			frameworkTypeId: [this.framework?.frameworkType.id ?? null, Validators.required],

			releasedAt: [this.toDateInputValue(this.framework?.releasedAt), Validators.required],
		});
	}

	onSubmit() {
		if (this.form.invalid) {
			this.form.markAllAsTouched();

			return;
		}

		const formValue = this.form.getRawValue();

		this.save.emit({
			...formValue,
			codingLanguageId: Number(formValue.codingLanguageId),
			frameworkTypeId: Number(formValue.frameworkTypeId),
			releasedAt: new Date(formValue.releasedAt),
		});

		// this.save.emit(this.form.getRawValue());
	}

	private toDateInputValue(date?: Date): string {
		if (!date) {
			return "";
		}

		return new Date(date).toISOString().substring(0, 10);
	}
}
