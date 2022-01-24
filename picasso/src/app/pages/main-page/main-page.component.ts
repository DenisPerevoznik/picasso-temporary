import {Component, OnDestroy, OnInit} from '@angular/core';
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {ApisService} from "../../shared/services/apis.service";
import {FilterStateType, Networks, Token, ViewType, Wallet} from "../../shared/models";
import {Subject} from "rxjs";
import {finalize, takeUntil} from "rxjs/operators";
import {HelpService} from "../../shared/services/help.service";
import {NgbModal} from "@ng-bootstrap/ng-bootstrap";

@Component({
  selector: 'app-main-page',
  templateUrl: './main-page.component.html',
  styleUrls: ['./main-page.component.scss']
})
export class MainPageComponent implements OnInit, OnDestroy {

  public walletForm: FormGroup = new FormGroup({
    address: new FormControl(null, [Validators.required]),
  });
  public submitted = false;
  public viewMode: ViewType = 'list';
  public sortField: '24h' | '7d' | 'none' = 'none';
  public filterMode: 'up' | 'down' = 'down';
  public filterState: FilterStateType = {status: false, value: 0};
  public selectedNetwork: Networks = Networks.Binance;
  public tokens: Token[] = [
    // {
    //   balance: 10,
    //   sum: 11,
    //   contractAddress: "0x55d398326f99059ff775485246999027b3197955",
    //   currentPrice: 0.99,
    //   logoUrl: "https://assets.coingecko.com/coins/images/325/large/Tether-logo.png?1598003707",
    //   name: "Tether",
    //   pricePercentage7d: -0.65,
    //   pricePercentage24h: -0.45,
    //   symbol: "USDT",
    //   transactions: [
    //     {
    //       id: 'eded',
    //       date: new Date("2021-10-13T11:06:24.000Z"),
    //       description: "Sent 30 BUSD",
    //       from: "0x5162cfe2a0fe15f5abf47ac9417b8200ec67ca5a",
    //       status: "completed",
    //       to: "0xe9e7cea3dedca5984780bafc599bd69add087d56",
    //       type: "Send"
    //     }
    //   ]
    // }
  ];
  public savedWallets: Wallet[] = [];
  public currentWallet: Wallet = {name: '', address: ''};
  public loader = false;
  public modalLoader = true;
  public selectedToken: Token;
  private unsubscribe: Subject<void> = new Subject();

  constructor(
    private apisService: ApisService,
    private helpService: HelpService,
    private modalService: NgbModal,
  ) { }

  ngOnDestroy(): void {
        this.unsubscribe.next();
        this.unsubscribe.complete();
    }

  ngOnInit(): void {
    this.savedWallets = this.helpService.getSavedWallets();
    this.viewMode = this.helpService.getView();
    this.filterState = this.helpService.getFilterState();
  }

  changeView(selectedView: ViewType){
    this.helpService.setView(selectedView);
    this.viewMode = selectedView;
  }

  get networks(){
    return Object.keys(Networks)
      .filter(key => key !== 'Solana')
      .map(key => Networks[key]);
  }

  copyContractAddress(event: any){
    const inp = document.createElement('input');
    document.body.appendChild(inp);
    inp.value = this.selectedToken.contractAddress;
    inp.select();
    document.execCommand('copy',false);
    inp.remove();

    const btn = event.target;
    const iElement = btn.firstChild;
    btn.classList.remove('btn-outline-light');
    btn.classList.add('btn-success');
    iElement.classList.remove('bi-clipboard');
    iElement.classList.add('bi-check');

    setTimeout(() => {
      btn.classList.remove('btn-success');
      btn.classList.add('btn-outline-light');
      iElement.classList.remove('bi-check');
      iElement.classList.add('bi-clipboard');
    }, 2000);
  }

  removeSavedWallet(event: any, selectedWallet: Wallet){
    event.stopPropagation();

    if (!confirm(`Удалить кошелек ${selectedWallet.name} ?`)){
      return;
    }

    this.helpService.removeWallet(selectedWallet);
    this.savedWallets = this.savedWallets.filter(w => w.address !== selectedWallet.address);
  }

  changeFilterMode(field: '7d' | '24h'){

    if (this.sortField === 'none'){
      return;
    }

    if (field === '7d' && this.sortField === '7d'
        || field === '24h' && this.sortField === '24h'){

      this.filterMode = this.filterMode === 'up'
        ? 'down' : 'up';
    }
  }

  walletAddressSubmit(address: string | null = null){
    if(!address){
      this.submitted = true;
    }
    if(!address && (this.walletForm.invalid || this.loader)) return;

    const walletAddress = address ? address : this.walletForm.value.address;

    this.loader = true;

    this.goToTokensList();

    this.tokens = [];
    this.apisService.getTokensOfWallet(walletAddress, this.selectedNetwork)
      .pipe(takeUntil(this.unsubscribe), finalize(() => {
        this.loader = false;
        this.submitted = false;
      }))
      .subscribe(tokens => {
        this.walletForm.get('address')?.patchValue('');
        this.tokens = tokens;
        this.currentWallet = {name: '', address: walletAddress};
      }, error => {
        this.currentWallet = null;
      });
  }

  get walletAlreadySaved(): boolean{
    const found = this.savedWallets.find(w => w.address === this.currentWallet.address);
    if(!!found){
      this.currentWallet.name = found.name;
      return true;
    }
    return false;
  }

  filterStateChange(){
    this.helpService.setFilterState(this.filterState);
    if (this.currentWallet.address){
      this.goToTokensList();
    }
  }

  goToTokensList(){
    document.getElementById('loadedContent').scrollIntoView({
      behavior: 'smooth',
      block: 'start'
    });
  }

  saveWallet(){

    if(this.walletAlreadySaved || !this.currentWallet){
      return;
    }

    const name: string = <string>prompt('Введите название для кошелька');
    if(!name || (!name.trim())){
      alert('Имя кошелька не должно быть пустым');
      return;
    }
    this.currentWallet.name = name;
    this.savedWallets.push(this.currentWallet);
    this.helpService.saveWallet(this.currentWallet);
  }

  onNetworkChange(network: string){

    this.selectedNetwork = <Networks>network;
    if (this.currentWallet.address){
      this.walletAddressSubmit(this.currentWallet.address);
    }
  }

  openToken(contentTemplate: any, selectedToken: Token){
    this.selectedToken = selectedToken;
    this.apisService.getTransactionsOfToken(selectedToken.contractAddress,
      this.currentWallet.address, this.selectedNetwork)
      .pipe(takeUntil(this.unsubscribe), finalize(() => {this.modalLoader = false}))
      .subscribe(transactions => {
        this.selectedToken.transactions = transactions;
      });
    this.modalService.open(contentTemplate, {size: 'xl'});
  }
}
