import { HttpClient, HttpParams } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { CreateFrameworkDTO, ReadOneFramework, UpdateFrameworkDTO } from "@nx-nestjs-angular-starter/api/framework";
import { BaseService } from "@nx-nestjs-angular-starter/connectit-shared-frontend";
import { environment } from "../environments/environment";
import { FrameworkFilter } from "../models/framework-filter";
import { ReadAllFrameworkResponse } from "../models/readAll-framework-response ";

@Injectable({
	providedIn: "root",
})
export class FrameworkService extends BaseService<ReadOneFramework, CreateFrameworkDTO, UpdateFrameworkDTO, never> {
	constructor(httpClient: HttpClient) {
		super(`${environment.apiURL}/framework`, httpClient);
	}

	public readPage(filter: FrameworkFilter) {
		const params = this.buildHttpParams(filter);

		return this.httpClient.get<ReadAllFrameworkResponse>(this.baseUrl, {
			params,
		});
	}

	private buildHttpParams(filter: FrameworkFilter): HttpParams {
		let params = new HttpParams()
			.set("page", filter.page)
			.set("pageSize", filter.pageSize)
			.set("sort", filter.sort)
			.set("order", filter.order);

		if (filter.name) {
			params = params.set("name", filter.name);
		}

		filter.frameworkTypeIds.forEach(id => {
			params = params.append("frameworkTypeId", id);
		});

		filter.codingLanguageIds.forEach(id => {
			params = params.append("codingLanguageId", id);
		});

		if (filter.releasedAt) {
			params = params.set("releasedAt", filter.releasedAt);
		}

		if (filter.createdAt) {
			params = params.set("createdAt", filter.createdAt);
		}

		if (filter.updatedAt) {
			params = params.set("updatedAt", filter.updatedAt);
		}

		return params;
	}

	// Example of a request that does not exist in BaseService
	// public exampleRequest(employeeId: Employee["id"], data: ExampleRequestDataDTO) {
	// 	return firstValueFrom(
	// 		this.httpClient
	// 			.patch<ReadOneEmployee | null>(`${this.baseUrl}/${employeeId}/example-request`, data)
	// 			.pipe(tap(employee => employee && this.saveToCache(employee)))
	// 	);
	// }
}
