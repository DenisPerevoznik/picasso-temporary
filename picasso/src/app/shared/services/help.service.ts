import { Injectable } from '@angular/core';
import {FilterStateType, ViewType, Wallet} from "../models";

@Injectable({
  providedIn: 'root'
})
export class HelpService {

  private walletsKey = 'my-wallets';
  private viewKey = 'selected-view-key';
  private filterStateKey = 'filter-state-key';
  constructor() { }

  getSavedWallets(): Wallet[]{
    const wallets = this.getFromLocalStorage(this.walletsKey);
    return wallets ? wallets : [];
  }

  saveWallet(wallet: Wallet){
    const wallets = this.getSavedWallets();
    wallets.push(wallet);
    this.saveToLocalStorage(wallets, this.walletsKey);
  }

  removeWallet(wallet: Wallet){

    const wallets = this.getSavedWallets();
    this.saveToLocalStorage(wallets.filter(w => w.address !== wallet.address), this.walletsKey)
  }

  setView(selectedView: ViewType){
    this.saveToLocalStorage(selectedView, this.viewKey);
  }

  getView(): ViewType{
    const view = this.getFromLocalStorage(this.viewKey);
    return !!view ? view : 'list';
  }

  setFilterState(filterState: FilterStateType){
    this.saveToLocalStorage(filterState, this.filterStateKey);
  }

  getFilterState(): FilterStateType{
    const state = this.getFromLocalStorage(this.filterStateKey);
    return !!state ? state : {status: true, value: 0.5};
  }

  private saveToLocalStorage(data: any, key: string){
    localStorage.setItem(key, JSON.stringify(data));
  }

  private getFromLocalStorage(key: string){
    const data = localStorage.getItem(key);
    if(!data || (!!data && !data.trim())){
      return null;
    }
    return JSON.parse(data);
  }

  public random(min: number, max: number, includeMax = false){
    return Math.floor(Math.random() * ((includeMax ? max + 1 : max) - min)) + min;
  }

  public range(number1: number, number2: number){

    const rangeArray = [];
    for (let i = number1; i < number2; i++){
      rangeArray.push(i);
    }
    return rangeArray;
  }

  public trimAfterDecimalPoint(value: string | number, countAfterDecimal = 2){

    if(!value){
      return value;
    }

    const str = value.toString();

    if(str.indexOf('.') === -1){
      return value;
    }
    const split = str.split('.');
    return +(`${split[0]}.${split[1].substr(0, countAfterDecimal)}`);
  }
}
