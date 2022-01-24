import {NgModule} from "@angular/core";
import {CommonModule} from "@angular/common";
import {HeaderComponent} from "./components/header/header.component";
import { FooterComponent } from './components/footer/footer.component';
import {HttpClientModule} from "@angular/common/http";
import { LoaderComponent } from './components/loader/loader.component';
import {NetworkInfoPipe} from './pipes/network-info.pipe';
import { FilterTokensPipe } from './pipes/filter-tokens.pipe';
import { PercentValueComponent } from './components/percent-value/percent-value.component';
import { SortTokensPipe } from './pipes/sort-tokens.pipe';
import {RouterModule} from "@angular/router";

@NgModule({
    imports: [CommonModule, HttpClientModule, RouterModule],
  declarations: [HeaderComponent, FooterComponent, LoaderComponent, NetworkInfoPipe, FilterTokensPipe, PercentValueComponent, SortTokensPipe],
  exports: [
    HeaderComponent,
    FooterComponent,
    LoaderComponent,
    NetworkInfoPipe,
    FilterTokensPipe,
    SortTokensPipe,
    PercentValueComponent]
})
export class SharedModule{}
