import { HttpService } from "@nestjs/axios";
import { Observable } from "rxjs";
import { Pool } from "../entities/pool.entity";
import { HelperService } from "../../shared/services/helper.service";
import { PoolServiceInterface } from "./pool.interface";
export declare class BscLaunchService implements PoolServiceInterface {
    private httpService;
    private helper;
    private readonly url;
    constructor(httpService: HttpService, helper: HelperService);
    getData(): Observable<Pool[]>;
}
