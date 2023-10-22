import express from "express"

export const createQuestion = (request: express.Request, response: express.Response): void => {

    const first: number = createRandomInteger(100);
    const second: number = createRandomInteger(100);
    const result: number = first + second;

    response.status(200).json(
        {
            question: `${first} + ${second} = ?`, 
            answer: result 
        }
    );
}

/**
 * ランダムな数値を生成.
 * @param max 最大値.
 * @returns 作成したランダムな数値.
 */
const createRandomInteger = (max: number): number => {
    return Math.floor(Math.random() * max);
}