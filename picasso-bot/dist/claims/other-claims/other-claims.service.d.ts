import { HttpService } from "@nestjs/axios";
import { GamefiService } from "../../events/pools/gamefi.service";
import { RedKiteService } from "../../events/pools/red-kite.service";
import { Observable } from "rxjs";
import { Claim } from "../entities/claim.entity";
export declare class OtherClaimsService {
    private httpService;
    private gameFiService;
    private redKiteService;
    constructor(httpService: HttpService, gameFiService: GamefiService, redKiteService: RedKiteService);
    getSfundData(): Observable<Claim[]>;
    getGameFiData(): Observable<Claim[]>;
    getRedKiteData(): Observable<Claim[]>;
    private getGameFiAndRedKiteClaims;
    getCompletedRedKiteClaim(): Observable<Claim[]>;
    getCompletedGameFiClaims(): Observable<Claim[]>;
    private gameFiAndRedKiteClaimFilterPredicate;
}
