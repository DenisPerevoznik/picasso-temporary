import { Model } from "sequelize-typescript";
export declare class Event extends Model {
    id: number;
    title: string;
    icon: string;
    banner: string;
    tokenName: string;
    link: string;
    metadata: string;
    date: Date;
}
