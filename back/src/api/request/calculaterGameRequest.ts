export interface CalcularerGameRequestParams {}

export interface CalcularerGameResponseBody {}

export interface CalcularerGameRequestBody {}

export interface CalcularerGameQuery {
  
    /** 計算に使える最大数値. */
    maxNum: string,

    /** 有効な四則演算記号. */
    validOparation: string,
}
