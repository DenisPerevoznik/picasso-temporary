import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor, HttpHeaders
} from '@angular/common/http';
import { Observable } from 'rxjs';
import {tap} from "rxjs/operators";
import {AuthService} from "./shared/services/auth.service";
import {Router} from "@angular/router";
import {InterceptorSkip} from "./shared/services/apis.service";

@Injectable()
export class MainInterceptor implements HttpInterceptor {

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {

    if (req.headers && req.headers.has(InterceptorSkip)) {
      const headers = req.headers.delete(InterceptorSkip);
      return next.handle(req.clone({ headers }));
    }
    const headers = new HttpHeaders({
      Authorization: `Bearer ${this.authService.token}`,
      'Content-Type': 'application/json'
    });
    let request = req.clone({headers});

    return next.handle(request)
      .pipe(tap(()=>{}, response => {
        if(response.status === 401){
          this.authService.logout();
          this.router.navigate(['login']);
        }
      }));
  }
}
