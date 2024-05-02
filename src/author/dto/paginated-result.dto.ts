export class PaginatedResult {
  data: any[];
  meta: {
    page: number;
    rows: number;
    total: number;
  };
}
