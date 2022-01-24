
export interface Transaction {
    id: string | number;
    from: string;
    to: string;
    date: Date,
    status: string;
    type: string;
    description: string;
}
