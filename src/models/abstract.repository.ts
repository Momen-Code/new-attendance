import {
  Document,
  FilterQuery,
  Model,
  PipelineStage,
  PopulateOptions,
  ProjectionType,
  QueryOptions,
} from 'mongoose';
import { isNil, isArray, isEmpty } from 'lodash';
import { SortOrder } from '../common/constants/sorting.constant';
import { FindAllQuery } from 'src/common/dto/findall-query.dto';
import { FindAll } from 'src/common/type';

export abstract class AbstractRepository<T> {
  private repo: Model<T & Document>;

  constructor(private nModel: Model<T & Document>) {
    this.repo = nModel;
  }

  get model() {
    return this.repo;
  }

  private _buildQuery(func, params) {
    if (isNil(params)) return func;

    const { fields, lean, populate } = params;

    if (!isNil(fields)) func.select(fields);
    if (!isNil(lean)) func.lean();

    if (populate) {
      for (let i = 0; i < populate.length; i += 1) {
        if (isArray(populate[i])) {
          func.populate(...populate[i]);
        } else {
          func.populate(populate[i]);
        }
      }
    }

    return func;
  }

  public create(item: T): Promise<T> {
    const newDocument = new this.nModel(item);
    return newDocument.save();
  }
  async getAll(
    query: any,
    params: GetAll = { limit: 25, page: 1, paginate: true },
  ): Promise<FindAll<T>> {
    const { limit = 25, page = 1, paginate = true, sort, order } = params || {};

    const skip = limit * (page - 1);
    const nResult = this._buildQuery(this.repo.find(query || {}), params);

    if (paginate) {
      nResult.skip(skip);
      nResult.limit(limit);
    }

    if (sort) {
      nResult.sort({ [sort]: order });
    }

    let result = await nResult.exec();

    if (paginate) {
      const count = isEmpty(query)
        ? await this.repo.collection.countDocuments({})
        : await this.repo.countDocuments(query);

      const pages = Math.ceil(count / limit) || 1;
      result = {
        data: result,
        currentPage: skip === 0 ? 1 : Math.ceil(limit / skip + 1),
        numberOfPages: pages,
        numberOfRecords: count,
      };
    }

    return result;
  }

  public getOne(
    query: FilterQuery<T>,
    params?: ProjectionType<T>,
    options?: QueryOptions<T>,
  ) {
    return this.repo.findOne(query, params, options).lean().exec();
  }

  public update(query: FilterQuery<T>, item: any, params: QueryOptions) {
    return this.repo.findOneAndUpdate(query, item, params).lean();
  }

  public async exists(query): Promise<boolean> {
    const exists = await this.model.findOne(query).lean().exec();
    return !isNil(exists);
  }

  public async aggregate(
    pipeline: PipelineStage[],
    params?: {
      limit: number;
      page: number;
      paginate: boolean;
      sort: string;
      order: number;
    },
  ) {
    const { limit = 10, page = 1, paginate = true, sort, order } = params || {};
    const skip = limit * (page - 1);
    const sortValue: Record<string, any> = {};

    if (sort && order) {
      const pattern = /^[A-Z_]+$/;
      if (pattern.test(sort)) {
        const sortKeyArray = sort.toLowerCase().split('_');
        for (let i = 1; i < sortKeyArray.length; i++) {
          sortKeyArray[i] =
            sortKeyArray[i].charAt(0).toUpperCase() + sortKeyArray[i].slice(1);
        }
        const sortKey = sortKeyArray.join('');
        sortValue[sortKey] = order;
      }
    }

    if (paginate) {
      pipeline.push({ $skip: skip }, { $limit: limit });
    }

    const [a, b] = await Promise.all([
      this.repo
        .aggregate([
          {
            $sort: isEmpty(sortValue) ? { createdAt: -1 } : sortValue,
          },
          ...pipeline,
        ])
        .exec(),
      this.repo.aggregate([...pipeline, { $count: 'count' }]).exec(),
    ]);

    const data: T[] = a;
    const [countResult] = b;

    return {
      currentPage: skip === 0 ? 1 : Math.ceil(skip / limit + 1),
      data,
      numberOfPages: Math.ceil(countResult?.count / limit) || 1,
      numberOfRecords: countResult?.count || 0,
    };
  }
}

type GetAll = {
  limit?: number;
  page?: number;
  paginate?: boolean;
  sort?: string;
  order?: Order;
  fields?: string;
  lean?: boolean;
  populate?: PopulateOptions | (string | PopulateOptions)[];
};

enum Order {
  'ascending' = 1,
  'descending' = -1,
}
