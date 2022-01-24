import {Body, Controller, HttpCode, HttpStatus, Post} from '@nestjs/common';
import {GetWalletDto} from "./dto/get-wallet.dto";
import {WalletsService} from "./wallets.service";
import {GetTransactionsDto} from "./dto/get-transactions.dto";
import {catchError} from "rxjs";

@Controller('wallets')
export class WalletsController {

    constructor(
        private walletsService: WalletsService
    ) {
    }

    @Post('get')
    @HttpCode(HttpStatus.OK)
    getWalletInfo(@Body() walletDto: GetWalletDto){
        return this.walletsService.getTokens(walletDto)
            .pipe(
                catchError(err => {
                    return 'Произошла ошибка. Повторите попытку позже';
                })
            );
    }

    @Post('transactions')
    @HttpCode(HttpStatus.OK)
    getTransactions(@Body() getTransactionsDto: GetTransactionsDto){
        return this.walletsService.getTransactions(getTransactionsDto);
    }
}
