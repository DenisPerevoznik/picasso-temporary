import { Event } from "./entities/event.entity";
import { GetEventsDto } from "./dto/get-events.dto";
export declare class EventsService {
    private eventModel;
    constructor(eventModel: typeof Event);
    findAll(): Promise<Event[]>;
    findAllByYearAndMonth(getEventsDto: GetEventsDto): Promise<Event[]>;
    findAllByDate(date: Date): Promise<Event[]>;
    findOne(id: number): Promise<Event>;
}
