import { Model } from "sequelize-typescript";
export declare class Claim extends Model {
    id: number;
    date: Date;
    source: string;
    token: string;
    chain: string;
    type: string;
    groupId: number;
    percentage: number;
}
