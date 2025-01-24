declare namespace GlobalInterface {
  interface IBaseEntity {
    id: string
    rowState?: number
    rowNo?: number
  }

  interface Dictionary<T> {
    [index: string]: T;
  }

  interface ICodeEntity {
    id: string
    configCode: string
    configName: string
    remark: string
    value: string
    label: string
  }
}

declare namespace Http {
  /**
   * 响应结果
   * */
  interface IResponseResult<T = any> {
    code?: string
    message?: string
    success?: boolean
    info?: T
  }

  interface IPageInfoRequest<T = any> {
    condition: T;
    currentPage: number;
    pageSize: number;
    sortType: string;
    sortBy: string;
  }

  interface IPageInfoResponse<T = any> {
    condition: T;
    currentPage: number;
    pageSize: number;
    recordEnd: number;
    records: T[];
    recordStart: number;
    recordStartPrev: number;
    sort?: any;
    sortBy: string;
    sortType: string;
    totalPage: number;
    totalRecord: number;
  }

  type TPageRes = Partial<IPageInfoResponse>

}

declare namespace CodeModule {
  type TCode = Partial<GlobalInterface.ICodeEntity>
  type TCodeArray = {
    [key in keyof typeof Code]: Array<Partial<TCode>>
  }
}
