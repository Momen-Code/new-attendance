export type FindAll<T> = {
  data: T[];
  currentPage: number;
  numberOfPages: number;
  numberOfRecords: number;
};
