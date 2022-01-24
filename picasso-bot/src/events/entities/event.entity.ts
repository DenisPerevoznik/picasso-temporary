import {AutoIncrement, Column, Model, PrimaryKey, Table, DataType, AllowNull} from "sequelize-typescript";

@Table
export class Event extends Model{

    @AutoIncrement
    @PrimaryKey
    @AllowNull(false)
    @Column
    id: number;

    @AllowNull(false)
    @Column
    title: string;

    @Column
    icon: string;

    @Column
    banner: string;

    @AllowNull(false)
    @Column
    tokenName: string;

    @Column
    link: string;

    @Column
    metadata: string;

    @AllowNull(false)
    @Column(DataType.DATEONLY)
    date: Date;
}
