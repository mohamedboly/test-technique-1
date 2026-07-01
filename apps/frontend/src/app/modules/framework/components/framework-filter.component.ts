import { CommonModule } from "@angular/common";
import { Component, EventEmitter, Input, Output } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { ReadOneFrameworkType } from "@nx-nestjs-angular-starter/api/framework-type";

@Component({
	selector: "app-framework-filter",
	standalone: true,
	imports: [CommonModule, FormsModule],
	template: `
		<div class="rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
			<label class="mb-2 block text-sm font-medium text-slate-700"> Name </label>

			<input
				type="text"
				class="w-full rounded-md border border-slate-300 px-3 py-2"
				[ngModel]="name"
				(ngModelChange)="onNameChange($event)"
				placeholder="Rechercher..."
			/>
			<div class="mt-6">
				<h3 class="mb-3 text-sm font-semibold">Framework Type</h3>

				@for (type of frameworkTypes; track type.id) {
					<div class="mb-2 flex items-center gap-2">
						<input
							type="checkbox"
							[checked]="selectedFrameworkTypeIds.includes(type.id)"
							(change)="onFrameworkTypeChecked(type.id, $any($event.target).checked)"
						/>

						<span>
							{{ type.name }}
						</span>
					</div>
				}
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

	onNameChange(value: string) {
		this.nameChange.emit(value);
	}

	onFrameworkTypeChecked(id: number, checked: boolean) {
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
}
