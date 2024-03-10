export class CreateResponse<T> {
  success: boolean;
  data: T;
}

export class CreateOrderResponse<R> extends CreateResponse<R> {
  payment?: any;
}

export class UpdateResponse<T> {
  success: boolean;
  data: T;
}

export class FindAllResponse<T> {
  success: boolean;
  data:
    | T[]
    | {
        data: T[];
        currentPage?: number;
        numberOfPages?: number;
        numberOfRecords?: number;
      };
  currentPage: number;
  numberOfPages: number;
  numberOfRecords: number;
}

export class FindOneResponse<T> {
  success: boolean;
  data: T;
}

export class RemoveResponse {
  success: boolean;
}
