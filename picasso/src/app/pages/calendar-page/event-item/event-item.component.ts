import {Component, EventEmitter, Input, OnDestroy, OnInit, Output, ViewChild} from '@angular/core';
import {HelpService} from "../../../shared/services/help.service";
import {Event, PlatformIcons, PoolData, Token} from "../../../shared/models";
import {NgbModal, NgbModalRef} from "@ng-bootstrap/ng-bootstrap";
import {ApisService} from "../../../shared/services/apis.service";
import {finalize, takeUntil} from "rxjs/operators";
import {Subject} from "rxjs";

@Component({
  selector: 'app-event-item',
  templateUrl: './event-item.component.html',
  styleUrls: ['./event-item.component.scss']
})
export class EventItemComponent implements OnInit, OnDestroy {

  @Input() set event(eventData: Event){
    if (this.pool){
      return;
    }
    this._event = eventData;
  };
  get event(){
    return this._event;
  }

  @Input() pool: PoolData = null;
  private _event: Event = null;

  @Output() editEventClick = new EventEmitter<string | number>();
  @Output() eventRemoved = new EventEmitter<string | number>();

  loader = false;
  unsubscribe: Subject<void> = new Subject();
  removeModalInstance: NgbModalRef = null;
  removeError = '';
  platformIcons = PlatformIcons;
  constructor(
    private helper: HelpService,
    private modalService: NgbModal,
    private apiService: ApisService
  ) { }

  ngOnInit(): void {
  }

  ngOnDestroy(): void {
      this.unsubscribe.next();
      this.unsubscribe.complete();
  }

  editEvent() {
    this.editEventClick.emit(this.event.id);
  }

  removeEventClick(contentTemplate: any){
    this.removeModalInstance = this.modalService.open(contentTemplate, {size: 'md'});
  }

  removeEventSubmit(){
    this.loader = true;
    this.apiService.removeEvent(this.event.id)
      .pipe(takeUntil(this.unsubscribe), finalize(() => {this.loader = false}))
      .subscribe(data => {
        this.removeModalInstance.close();
        this.removeError = '';
        this.eventRemoved.emit(this.event.id);
      }, error => {
        this.removeError = error.message;
      });
  }
}
