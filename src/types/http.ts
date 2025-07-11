export interface IResponse<T> {
  message: string;
  status: string;
  data: T;
  elements: number;
  pages: number;
}
