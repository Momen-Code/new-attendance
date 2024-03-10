import {
  Aggregate,
  Document,
  FilterQuery,
  Model,
  PipelineStage,
  ProjectionType,
  QueryOptions,
  UpdateQuery,
} from 'mongoose';
import * as _ from 'lodash';
import { FindAllQuery } from 'src/common/dto/findall-query.dto';

export abstract class AbstractRepository<T> {
  private repo: Model<T & Document>;

  constructor(private nModel: Model<T & Document>) {
    this.repo = nModel;
  }

  get model() {
    return this.repo;
  }

  private _buildQuery(func, params) {
    if (_.isNil(params)) return func;

    const { fields, lean, populate } = params;

    if (!_.isNil(fields)) func.select(fields);
    if (!_.isNil(lean)) func.lean();

    if (populate) {
      for (let i = 0; i < populate.length; i += 1) {
        if (_.isArray(populate[i])) {
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

  public async getAll(
    query: any,
    params: FindAllQuery = { limit: 25, skip: 0, paginate: true },
  ): Promise<{
    data: T[];
    currentPage: number;
    numberOfPages: number;
    numberOfRecords: number;
  }> {
    const { limit = 25, skip = 0, paginate = true, sort, order } = params || {};

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
      const count = _.isEmpty(query)
        ? await this.model.collection.countDocuments({})
        : await this.model.countDocuments(query);

      const pages = Math.ceil(count / limit) || 1;
      result = {
        data: result,
        currentPage: skip === 0 ? 1 : limit / skip + 1,
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
    return this.repo.findOne(query, params, options).lean();
  }

  public update(
    query: FilterQuery<T>,
    item: UpdateQuery<Document & T>,
    params: QueryOptions<T>,
  ) {
    return this.repo.findOneAndUpdate(query, item, params);
  }

  public async exists(query): Promise<boolean> {
    const exists = await this.model.findOne(query).lean().exec();
    return !_.isNil(exists);
  }

  public async aggregate(
    pipeline: PipelineStage[],
    params?: {
      limit: number;
      skip: number;
      paginate: boolean;
      sort: string;
      order: number;
    },
  ) {
    const { limit, skip, paginate, sort, order } = params;
    let count: number, pages: number, sortValue: any, result: any;

    if (paginate) {
      pipeline.push({ $count: 'count' });
      const [getRecords] = await this.model.aggregate(pipeline);
      count = getRecords?.count > 0 ? getRecords.count : 0;
      pages = Math.ceil(count / limit) || 1;

      pipeline.pop();

      if (sort && order) {
        sortValue = { [sort]: order };
      }

      pipeline.push({
        $facet: {
          [this.model.collection.name]: [
            { $skip: skip },
            { $limit: limit },
            { $sort: sortValue },
          ],
        },
      });
    }
    const [aggregation] = await this.model.aggregate(pipeline).exec();

    if (paginate) {
      result = {
        data: aggregation[this.model.collection.name],
        currentPage: skip === 0 ? 1 : limit / skip + 1,
        numberOfPages: pages,
        numberOfRecords: count,
      };
    } else {
      result = {
        data: aggregation[this.model.collection.name],
      };
    }

    return result;
  }
}
