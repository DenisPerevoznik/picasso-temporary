import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {MainPageComponent} from "./pages/main-page/main-page.component";
import {CalendarPageComponent} from "./pages/calendar-page/calendar-page.component";
import {ClaimPageComponent} from "./pages/claim-page/claim-page.component";
import {AuthPageComponent} from "./pages/auth-page/auth-page.component";
import {AuthGuard} from "./shared/guards/auth.guard";

const routes: Routes = [
  // {path: 'login', component: AuthPageComponent},
  {path: '', component: MainPageComponent},
  {path: 'calendar', component: CalendarPageComponent},
  {path: 'claim', component: ClaimPageComponent},
  // {path: '**', redirectTo: '/'}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
