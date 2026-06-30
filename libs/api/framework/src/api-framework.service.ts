import { Injectable } from "@nestjs/common";
import { LoggerService, PrismaService } from "@nx-nestjs-angular-starter/connectit-shared-api";
import { Prisma, type Framework } from "@prisma/client";
import { type CreateFrameworkDTO } from "./dto/create-framework.dto";
import { type UpdateFrameworkDTO } from "./dto/update-framework.dto";

const where = {
	deletedAt: null,
} satisfies Prisma.FrameworkWhereInput;

const include = {
	codingLanguage: true,
	frameworkType: true,
} satisfies Prisma.FrameworkInclude;

export type ReadOneFramework = Prisma.FrameworkGetPayload<{ include: typeof include }>;

@Injectable()
export class ApiFrameworkService {
	constructor(
		private prismaService: PrismaService,
		private logger: LoggerService
	) {
		this.logger.setContext(ApiFrameworkService.name);
	}

	private readonly sortableFields = [
	"name",
	"releasedAt",
	"createdAt",
	"updatedAt",
] as const;

	create(data: CreateFrameworkDTO) {
		return this.prismaService.framework.create({ data, include });
	}

	readOne(id: Framework["id"]) {
		return this.prismaService.framework.findUnique({
			where: { ...where, id },
			include,
		});
	}

	// readAll() {
	// 	return this.prismaService.framework.findMany({ where, include });
	// }

	async readAll(
	query: Record<string, string | string[] | undefined>,
) {

	const where = this.buildWhere(query);

	const orderBy = this.buildOrderBy(query);

	const { skip, take, page, pageSize } =
		this.buildPagination(query);

	const [data, total] =
		await Promise.all([

			this.prismaService.framework.findMany({

				where,

				include,

				orderBy,

				skip,

				take,

			}),

			this.prismaService.framework.count({

				where,

			}),

		]);

	return {

		data,

		total,

		page,

		pageSize,

	};

}

	update(id: Framework["id"], data: UpdateFrameworkDTO) {
		return this.prismaService.framework.update({
			where: { ...where, id },
			data,
			include,
		});
	}

	delete(id: Framework["id"]) {
		return this.prismaService.framework.update({
			where: { ...where, id },
			include,
			data: { deletedAt: new Date() },
		});
	}

	private toNumber(
	value: string | string[] | undefined,
	defaultValue: number,
): number {

	if (Array.isArray(value)) {
		value = value[0];
	}

	const number = Number(value);

	return Number.isNaN(number) ? defaultValue : number;
}

private buildPagination(
	query: Record<string, string | string[] | undefined>,
) {

	const page = Math.max(
		1,
		this.toNumber(query['page'], 1),
	);

	const pageSize = Math.max(
		1,
		this.toNumber(query['pageSize'], 12),
	);

	return {

		page,

		pageSize,

		skip: (page - 1) * pageSize,

		take: pageSize,

	};

}

private buildOrderBy(
	query: Record<string, string | string[] | undefined>,
): Prisma.FrameworkOrderByWithRelationInput {

	const sort = Array.isArray(query['sort'])
		? query['sort'][0]
		: query['sort'];

	const order = Array.isArray(query['order'])
		? query['order'][0]
		: query['order'];

	if (
		!sort ||
		!this.sortableFields.includes(
			sort as (typeof this.sortableFields)[number],
		)
	) {
		return {
			name: "asc",
		};
	}

	return {
		[sort]: order === "desc" ? "desc" : "asc",
	};
}

private frameworkFilter(
    query: Record<string, string | string[] | undefined>,
): FrameworkFilter {

    return {

        page: this.pageFilter(query),

        pageSize: this.pageSizeFilter(query),

        sort: this.sortFilter(query),

        order: this.orderFilter(query),

        name: this.nameFilter(query),

        frameworkTypeIds: this.frameworkTypeFilter(query),

        codingLanguageIds: this.codingLanguageFilter(query),

        releasedAt: this.releasedAtFilter(query),

        createdAt: this.createdAtFilter(query),

        updatedAt: this.updatedAtFilter(query),

    };

}	

	private buildWhere(
    filter: FrameworkFilter,
): Prisma.FrameworkWhereInput {

    const where: Prisma.FrameworkWhereInput = {
        deletedAt: null,
    };

    if (filter.name) {

        where.name = {
            contains: filter.name,
        
        };

    }

    if (filter.frameworkTypeIds) {

        where.frameworkTypeId = {
            in: filter.frameworkTypeIds,
        };

    }

    if (filter.codingLanguageIds) {

        where.codingLanguageId = {
            in: filter.codingLanguageIds,
        };

    }

    if (filter.releasedAt) {

        where.releasedAt = filter.releasedAt;

    }

    if (filter.createdAt) {

        where.createdAt = filter.createdAt;

    }

    if (filter.updatedAt) {

        where.updatedAt = filter.updatedAt;

    }

    return where;

}

private nameFilter(
	query: Record<string, string | string[] | undefined>,
): string | null {

	if (!query['name'] || typeof query['name'] !== "string") {
		return null;
	}

	return query['name'].trim() || null;
}

private frameworkTypeFilter(
	query: Record<string, string | string[] | undefined>,
): number[] | null {

	const value = query['frameworkTypeId'];

	if (!value) {
		return null;
	}

	const values = Array.isArray(value)
		? value
		: [value];

	const ids = values
		.map(Number)
		.filter((id) => !Number.isNaN(id));

	return ids.length ? ids : null;
}

private codingLanguageFilter(
	query: Record<string, string | string[] | undefined>,
): number[] | null {

	const value = query['codingLanguageId'];

	if (!value) {
		return null;
	}

	const values = Array.isArray(value)
		? value
		: [value];

	const ids = values
		.map(Number)
		.filter((id) => !Number.isNaN(id));

	return ids.length ? ids : null;
}

private pageFilter(
	query: Record<string, string | string[] | undefined>,
): number {

	const value = query['page'];

	const page = Number( value,
);

	return Number.isNaN(page) || page < 1
		? 1
		: page;
}

private pageSizeFilter(
	query: Record<string, string | string[] | undefined>,
): number {

	const value = query['pageSize'];

	const pageSize = Number(value
	);

	return Number.isNaN(pageSize) || pageSize < 1
		? 12
		: pageSize;
}



private sortFilter(
	query: Record<string, string | string[] | undefined>,
): Prisma.FrameworkScalarFieldEnum {

	const value = query['sort'];

	if (
		value &&
		this.sortableFields.includes(
			value as (typeof this.sortableFields)[number],
		)
	) {
		return value as Prisma.FrameworkScalarFieldEnum;
	}

	return Prisma.FrameworkScalarFieldEnum.name;
}

private orderFilter(
	query: Record<string, string | string[] | undefined>,
): Prisma.SortOrder {

	const value = 
		 query['order'];

	return value === "desc"
		? Prisma.SortOrder.desc
		: Prisma.SortOrder.asc;
}

private releasedAtFilter(
	query: Record<string, string | string[] | undefined>,
): Prisma.DateTimeFilter | null {

	const value = query['releasedAt'];

	if (!value) {
		return null;
	}

	const date = new Date(
		Array.isArray(value)
			? value[0]
			: value,
	);

	if (Number.isNaN(date.getTime())) {
		return null;
	}

	const start = new Date(date);
	start.setHours(0, 0, 0, 0);

	const end = new Date(date);
	end.setHours(23, 59, 59, 999);

	return {
		gte: start,
		lte: end,
	};
}
private updatedAtFilter(
	query: Record<string, string | string[] | undefined>,
): Prisma.DateTimeFilter | null {

	const value = query['updatedAt'];

	if (!value) {
		return null;
	}

	const date = new Date(
		Array.isArray(value)
			? value[0]
			: value,
	);

	if (Number.isNaN(date.getTime())) {
		return null;
	}

	const start = new Date(date);
	start.setHours(0, 0, 0, 0);

	const end = new Date(date);
	end.setHours(23, 59, 59, 999);

	return {
		gte: start,
		lte: end,
	};
}

private createdAtFilter(
	query: Record<string, string | string[] | undefined>,
): Prisma.DateTimeFilter | null {

	const value = query['createdAt'];

	if (!value) {
		return null;
	}

	const date = new Date(
		Array.isArray(value)
			? value[0]
			: value,
	);

	if (Number.isNaN(date.getTime())) {
		return null;
	}

	const start = new Date(date);
	start.setHours(0, 0, 0, 0);

	const end = new Date(date);
	end.setHours(23, 59, 59, 999);

	return {
		gte: start,
		lte: end,
	};
}
}

interface FrameworkFilter {

    page: number;

    pageSize: number;

    sort: Prisma.FrameworkScalarFieldEnum;

    order: Prisma.SortOrder;

    name: string | null;

    frameworkTypeIds: number[] | null;

    codingLanguageIds: number[] | null;

    releasedAt: Prisma.DateTimeFilter | null;

    createdAt: Prisma.DateTimeFilter | null;

    updatedAt: Prisma.DateTimeFilter | null;

}