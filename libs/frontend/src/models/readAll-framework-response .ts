import { ReadOneFramework } from "@nx-nestjs-angular-starter/api/framework";

export interface ReadAllFrameworkResponse {

	data: ReadOneFramework[];

	total: number;

	page: number;

	pageSize: number;

}