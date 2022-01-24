
export interface Pool {
    id: string | number;
    acceptCurrency: string;
    banner: string;
    createdAt: Date;
    description: string;
    network: string;
    infoTitle: string;
    calendarDateTime: Date;
    displayTime: Date;
    symbol: string;
    title: string;
    tokenImage: string;
    projectWebsite: string;
    url: string;
    type: string;
    platformImage: string;
    sourceName: string;
    claimConfig?: any[],
    fields: {[key: string]: string}[]
}
