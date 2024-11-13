import {
  FindManyOptions,
  ILike,
  ObjectLiteral,
  EntityManager,
  EntityTarget,
  Equal,
} from 'typeorm';
import { str, object } from 'dot-object';
import {
  IQueryParams,
  IPagination,
  IPaginationData,
} from '../entities/interfaces';
import { QuerySortOrder } from '../entities/interfaces';
import { validateUUID } from './uuid';

export interface IGetDocumentOptions<T> {
  query?: IQueryParams;
  options?: FindManyOptions<T>;
  limits?: {
    limit: number;
    searchFields?: string[];
    searchIdFields?: string[];
  };
}

export const getDocuments = async function <T extends ObjectLiteral>(
  manager: EntityManager,
  entity: EntityTarget<T>,
  options: IGetDocumentOptions<T> = {},
): Promise<IPaginationData<T>> {
  const { query, options: findOptions, limits } = options;
  const { page = 1, limit = 20, search } = query || {};
  const maxLimit = limits?.limit || 100;
  const take = Math.min(limit, maxLimit);
  const skip = (page - 1) * take;
  const searchWhere = [];
  const addExtraWhere = findOptions?.where || {};
  if (search && limits?.searchFields) {
    for (const field of limits.searchFields) {
      const obj = {
        ...addExtraWhere,
      };
      str(field, ILike(`%${search}%`), obj);
      searchWhere.push(obj);
    }
  }
  if (search && limits?.searchIdFields) {
    if (validateUUID(search)) {
      for (const field of limits.searchIdFields) {
        const obj = {
          ...addExtraWhere,
        };
        str(field, Equal(search), obj);
        searchWhere.push(obj);
      }
    }
  } else {
    if (search && validateUUID(search)) {
      searchWhere.push({ ...addExtraWhere, id: Equal(search) });
    }
  }
  const order: any = query?.orderBy
    ? { [query.orderBy]: query.sort || QuerySortOrder.DESC }
    : {};
  object(order);
  const [data, total] = await manager.findAndCount(entity, {
    skip,
    take,
    ...findOptions,
    where: searchWhere.length ? searchWhere : addExtraWhere,
    order: {
      ...order,
      ...findOptions?.order,
    },
  });
  return {
    data,
    pagination: calcPaginationDataRaw(total, page, take),
  };
};

export const calcPaginationDataRaw = (
  total: number,
  page: number,
  limit: number,
): IPagination => {
  const pages = Math.ceil(total / limit);
  const nextPage = page < pages ? page + 1 : null;
  const prevPage = page > 1 ? page - 1 : null;
  return {
    page,
    limit,
    total,
    pages,
    nextPage,
    prevPage,
  };
};
