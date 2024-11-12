export enum TransactionStatus {
  PENDING = 'pending',
  SUCCCESS = 'success',
  FAILED = 'failed',
}

export enum TransactionType {
  DEPOSIT = 'deposit',
  WITHDRAWAL = 'withdrawal',
  TRANSFER_IN = 'transfer_in',
  TRANSFER_OUT = 'transfer_out',
}

export enum TransactionFlow {
  DEBIT = 'debit',
  CREDIT = 'credit',
}

export enum QuerySortOrder {
  ASC = 'ASC',
  DESC = 'DESC',
}

export interface IQueryParams {
  /**
   * The page number
   * @format int32
   * @example 1
   */
  page?: number;
  /**
   * The limit of the number of items to return
   * @format int32
   * @example 10
   */
  limit?: number;
  /**
   * The sort order
   * @example asc
   * @example desc
   * @format string
   */
  sort?: QuerySortOrder;
  /**
   * The field to sort by
   * To default field is createdAt in most cases
   * To order by a nested field, use the dot notation
   * For example, "user.firstName"
   * @example createdAt
   * @example updatedAt
   * @format string
   */
  orderBy?: string;
  /**
   * The search query
   * @format string
   */
  search?: string;
}

/**
 * The interface of a pagination object
 */
export interface IPagination {
  /**
   * The page number
   * @format int32
   * @example 1
   */
  page: number;
  /**
   * The limit of the number of items to return
   * @format int32
   * @example 10
   */
  limit: number;
  /**
   * The total number of items
   * @format int32
   * @example 40
   */
  total: number;
  /**
   * The total number of pages
   * @format int32
   * @example 4
   */
  pages: number;
  /**
   * The previous page number, null if there is no previous page
   * @format int32
   * @example 1
   * @example null
   */
  prevPage?: number | null;
  /**
   * The next page number, null if there is no next page
   * @format int32
   * @example 3
   * @example null
   */
  nextPage?: number | null;
}

export interface IPaginationData<T> {
  /**
   * The pagination object
   */
  pagination: IPagination;
  /**
   * The data array
   */
  data: T[];
}
