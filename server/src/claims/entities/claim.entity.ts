import {AllowNull, AutoIncrement, Column, DataType, Model, PrimaryKey, Table} from "sequelize-typescript";

@Table
export class Claim extends Model{
    @AutoIncrement
    @PrimaryKey
    @AllowNull(false)
    @Column
    id: number;

    @AllowNull(false)
    @Column(DataType.DATE)
    date: Date;

    @AllowNull(false)
    @Column
    source: string;

    @AllowNull(false)
    @Column
    token: string;

    @AllowNull(false)
    @Column
    chain: string;

    @Column
    type: string;

    @AllowNull(false)
    @Column
    groupId: number;

    @AllowNull(false)
    @Column
    percentage: number;
}
