import { HttpService } from "@nestjs/axios";
import { Observable } from "rxjs";
import { Pool } from "../entities/pool.entity";
export declare class RedKiteService {
    private httpService;
    private readonly url;
    constructor(httpService: HttpService);
    getData(): Observable<Pool[]>;
}
