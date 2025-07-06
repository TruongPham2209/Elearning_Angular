export interface Page<T> {
    contents: T[];
    totalPages: number;
    currentPage: number;
    pageSize: number;
}
