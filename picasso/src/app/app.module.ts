import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { MainPageComponent } from './pages/main-page/main-page.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import {SharedModule} from "./shared/shared.module";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import { CalendarPageComponent } from './pages/calendar-page/calendar-page.component';
import { EventItemComponent } from './pages/calendar-page/event-item/event-item.component';
import { FixColorChipPipe } from './pages/calendar-page/event-item/fix-color-chip.pipe';
import { PoolStickersPipe } from './pages/calendar-page/pool-stickers.pipe';
import { GetPoolsPipe } from './pages/calendar-page/get-pools.pipe';
import { ClaimPageComponent } from './pages/claim-page/claim-page.component';
import { FilterOldsPipe } from './pages/claim-page/filter-olds.pipe';
import { KeyValuePipe } from './pages/calendar-page/event-item/key-value.pipe';
import { AddEventPopupComponent } from './pages/calendar-page/add-event-popup/add-event-popup.component';
import { AuthPageComponent } from './pages/auth-page/auth-page.component';
import {HTTP_INTERCEPTORS} from "@angular/common/http";
import {MainInterceptor} from "./main.interceptor";

@NgModule({
  declarations: [
    AppComponent,
    MainPageComponent,
    CalendarPageComponent,
    EventItemComponent,
    FixColorChipPipe,
    PoolStickersPipe,
    GetPoolsPipe,
    ClaimPageComponent,
    FilterOldsPipe,
    KeyValuePipe,
    AddEventPopupComponent,
    AuthPageComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    NgbModule,
    SharedModule,
    FormsModule,
    ReactiveFormsModule
  ],
  // providers: [
  //   {
  //     provide: HTTP_INTERCEPTORS,
  //     useClass: MainInterceptor,
  //     multi: true
  //   }
  // ],
  bootstrap: [AppComponent]
})
export class AppModule { }
