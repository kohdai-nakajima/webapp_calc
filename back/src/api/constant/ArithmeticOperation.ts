/**
 * 四則演算.
 */
export class ArithmeticOperation {
    public num: number;
    public displayName: string;

    constructor(num: number, displayName: string) {
        this.num = num;
        this.displayName = displayName;
    }
}

/**
 * 四則演算Map.
 */
export const ArithmeticOperationMap: Map<string, ArithmeticOperation> = new Map([
    ['plus', new ArithmeticOperation(0, '+')],
    ['minus', new ArithmeticOperation(1, '-')],
    ['multi', new ArithmeticOperation(2, '×')],
    ['divide', new ArithmeticOperation(3, '÷')],
]);

