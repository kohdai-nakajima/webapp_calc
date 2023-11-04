import express from "express"
import { ArithmeticOperation, ArithmeticOperationMap } from "../../constant/ArithmeticOperation";
import {CalcularerGameRequestParams, CalcularerGameResponseBody, CalcularerGameRequestBody, CalcularerGameQuery} from "../../request/calculaterGameRequest";

export const createQuestion = (
    request: express.Request<
            CalcularerGameRequestParams,
            CalcularerGameResponseBody,
            CalcularerGameRequestBody,
            CalcularerGameQuery
        >, 
    response: express.Response): void => {

    const { query } = request;
    const maxNum: string = query.maxNum;
    const operationList: Array<string> = query.validOparation.split(',');

    // 四則演算の取得
    const operationArray: Array<ArithmeticOperation | undefined> = operationList.map((operation) => ArithmeticOperationMap.get(operation));
    let operation: ArithmeticOperation;
    while(true) {
        // ランダムに0〜3の数値を作成し、それに見合った四則演算記号を付与する
        const random: number = createRandomInteger("3");
        const existance: ArithmeticOperation | undefined = operationArray.find((operation) => random == operation?.num);
        if(existance){
            operation = existance;
            break;
        }
    }

    // 数値と計算結果の取得
    let first: number;
    let second: number;
    let result: number;
    switch(operation.num) {
        case 0:
            first = createRandomInteger(maxNum);
            second = createRandomInteger(maxNum);        
            result = first + second;
            break;

        case 1:
            // 引き算の場合はマイナスにならないものだけ表示する
            while(true) {
                first = createRandomInteger(maxNum);
                second = createRandomInteger(maxNum);        
                result = first - second;
                if(result >= 0) {
                    break;
                }
            }
            break;

        case 2:
            first = createRandomInteger(maxNum);
            second = createRandomInteger(maxNum);        
            result = first * second;
            break;

        case 3:
            // 割り算は割り切れるものだけ表示する
            while(true) {
                first = createRandomInteger(maxNum);
                second = createRandomInteger(maxNum);        
                if(first % second == 0) {
                    result = first / second;
                    break;
                }
                
            }
            break;

        default:
            first = 0;
            second = 0;
            result = 0;
            operation = new ArithmeticOperation(-1, '');
    }

    response.status(200).json(
        {
            question: `${first} ${operation.displayName} ${second}`, 
            answer: result 
        }
    );
}

/**
 * ランダムな数値を生成.
 * @param max 最大値.
 * @returns 作成したランダムな数値.
 */
const createRandomInteger = (max: string): number => {
    return Math.floor(Math.random() * (Number(max) + 1));
}