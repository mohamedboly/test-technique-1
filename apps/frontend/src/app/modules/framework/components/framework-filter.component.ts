import { CommonModule } from "@angular/common";
import { Component, EventEmitter, Input, Output } from "@angular/core";
import { FormsModule } from "@angular/forms";

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
		</div>
	`,
})
export class FrameworkFilterComponent {
	@Input()
	name = "";

	@Output()
	nameChange = new EventEmitter<string>();

	onNameChange(value: string) {
		this.nameChange.emit(value);
	}
}
