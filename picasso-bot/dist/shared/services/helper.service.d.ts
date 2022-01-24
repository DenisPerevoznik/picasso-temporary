export declare class HelperService {
    trimAfterDecimal(value: number, countAfterDecimal?: number): number;
    getChainData(chainId: string | number): {
        name: string;
        image: string;
    };
    getFixedDateString(date: Date, withTime?: boolean): string;
    getTime(date: Date): string;
}
