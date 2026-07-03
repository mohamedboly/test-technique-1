export interface FrameworkFilter {
	page: number;
	pageSize: number;

	name: string | null;

	frameworkTypeIds: number[];
	codingLanguageIds: number[];

	releasedAt: string | null;
	createdAt: string | null;
	updatedAt: string | null;
}

export type SortOrder = "asc" | "desc";

export type SortField = "name" | "releasedAt" | "createdAt" | "updatedAt";
