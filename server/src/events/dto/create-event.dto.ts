export class CreateEventDto {
    readonly title: string;
    readonly icon: string;
    readonly banner: string;
    readonly tokenName: string;
    readonly link: string;
    readonly metadata: string;
    readonly date: Date;
}
