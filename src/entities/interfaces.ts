import { ApiProperty } from '@nestjs/swagger';

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

export class QueryParams implements IQueryParams {
  @ApiProperty({
    description: 'The page number',
    example: 1,
    type: Number,
    required: false,
  })
  page?: number;

  @ApiProperty({
    description: 'The limit of the number of items to return',
    example: 10,
    type: Number,
    required: false,
  })
  limit?: number;

  @ApiProperty({
    description: 'The sort order',
    example: 'asc',
    type: String,
    required: false,
  })
  sort?: QuerySortOrder;

  @ApiProperty({
    description: 'The field to sort by',
    example: 'createdAt',
    type: String,
    required: false,
  })
  orderBy?: string;

  @ApiProperty({
    description: 'The search query',
    example: 'John',
    type: String,
    required: false,
  })
  search?: string;
}

export class Pagination implements IPagination {
  @ApiProperty({
    description: 'The page number',
    example: 1,
    type: Number,
  })
  page: number;
  @ApiProperty({
    description: 'The limit of the number of items to return',
    example: 10,
    type: Number,
  })
  limit: number;
  @ApiProperty({
    description: 'The total number of items',
    example: 40,
    type: Number,
  })
  total: number;
  @ApiProperty({
    description: 'The total number of pages',
    example: 4,
    type: Number,
  })
  pages: number;
  @ApiProperty({
    description: 'The previous page number, null if there is no previous page',
    example: 1,
    type: Number || null,
  })
  prevPage?: number | null;
  @ApiProperty({
    description: 'The next page number, null if there is no next page',
    example: 3,
    type: Number || null,
  })
  nextPage?: number | null;
}

export class PaginationData<T> implements IPaginationData<T> {
  pagination: Pagination;
  data: T[];
}
