export interface FrameworkFilter {
	page: number;
	pageSize: number;

	sort: SortField;
	order: SortOrder;

	name: string | null;

	frameworkTypeIds: number[];
	codingLanguageIds: number[];

	releasedAt: Date | null;
	createdAt: Date | null;
	updatedAt: Date | null;
}

export type SortOrder = "asc" | "desc";

export type SortField = "name" | "releasedAt" | "createdAt" | "updatedAt";
