import { Observable } from "rxjs";
import { Pool } from "../entities/pool.entity";
import { HttpService } from "@nestjs/axios";
import { HelperService } from "../../shared/services/helper.service";
export declare class BscStationService {
    private helper;
    private httpService;
    private readonly url;
    constructor(helper: HelperService, httpService: HttpService);
    getData(): Observable<Pool[]>;
}
