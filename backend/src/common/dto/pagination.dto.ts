export class PaginationDto {
    page?: number = 1;
    limit?: number = 10;
}

export class PaginatedResponseDto<T> {
    data: T[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
    hasNext: boolean;
    hasPrev: boolean;

    constructor(data: T[], total: number, page: number, limit: number) {
        this.data = data;
        this.total = total;
        this.page = page;
        this.limit = limit;
        this.totalPages = Math.ceil(total / limit);
        this.hasNext = page < this.totalPages;
        this.hasPrev = page > 1;
    }

    // Ensure proper JSON serialization with correct types
    toJSON() {
        return {
            data: this.data,
            total: this.total,
            page: this.page,  // This will be serialized as a number
            limit: this.limit,  // This will be serialized as a number
            totalPages: this.totalPages,
            hasNext: this.hasNext,
            hasPrev: this.hasPrev
        };
    }
}