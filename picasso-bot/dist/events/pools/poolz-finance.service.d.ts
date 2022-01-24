import { HttpService } from "@nestjs/axios";
import { Observable } from "rxjs";
import { Pool } from "../entities/pool.entity";
import { HelperService } from "../../shared/services/helper.service";
export declare class PoolzFinanceService {
    private httpService;
    private helper;
    private readonly url;
    constructor(httpService: HttpService, helper: HelperService);
    getData(): Observable<Pool[]>;
}
