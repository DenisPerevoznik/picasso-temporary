import { Observable } from "rxjs";
import { Pool } from "../entities/pool.entity";
export interface PoolServiceInterface {
    getData(): Observable<Pool[]>;
}
