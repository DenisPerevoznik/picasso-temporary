import {Injectable, OnDestroy} from '@angular/core';
import {Observable, Subject} from "rxjs";
import {HttpClient} from "@angular/common/http";
import {Router} from "@angular/router";
import {tap} from "rxjs/operators";
import {environment} from "../../../environments/environment";

const authStorageKey = 'auth-token-data';

@Injectable({
  providedIn: 'root'
})
export class AuthService implements OnDestroy{

  private serverApi = environment.serverApi;
  unsubscribe: Subject<void> = new Subject<void>();

  constructor(private http: HttpClient, private router: Router) {}

  ngOnDestroy(): void {
    this.unsubscribe.next();
    this.unsubscribe.complete();
  }

  get token() {
    const storage = localStorage.getItem(authStorageKey);
    if(!!storage){
      return JSON.parse(storage).token.trim();
    }
    return false;
  }

  login(email: string, password: string): Observable<any> {
    return this.http
      .post<string>(`${this.serverApi}/login`, { email, password }, { headers: { 'Content-Type': 'application/json' } })
      .pipe(tap(responseToken => {this.setToken(responseToken)}));
  }

  logout() {
    localStorage.removeItem(authStorageKey);
    this.router.navigate(['login']);
  }

  isAuthenticated() {
    return !!this.token;
  }

  setToken(token: string) {
    localStorage.setItem(authStorageKey, JSON.stringify(token));
    this.router.navigate(['']);
  }
}
