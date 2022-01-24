import {Component, HostListener, OnDestroy, OnInit} from '@angular/core';
import * as moment from 'moment';
import {CalendarDate, Event, PoolData} from "../../shared/models";
import {HelpService} from "../../shared/services/help.service";
import {ApisService} from "../../shared/services/apis.service";
import {finalize, takeUntil} from "rxjs/operators";
import {forkJoin, Observable, Subject} from "rxjs";
import {DeviceDetectorService} from "ngx-device-detector";
import {ActivatedRoute} from "@angular/router";
import {PoolsService} from "../../shared/services/pools.service";
import {NgbModal} from "@ng-bootstrap/ng-bootstrap";

@Component({
  selector: 'app-calendar-page',
  templateUrl: './calendar-page.component.html',
  styleUrls: ['./calendar-page.component.scss']
})
export class CalendarPageComponent implements OnInit, OnDestroy {

  constructor(
    private helpService: HelpService,
    private apisService: ApisService,
    private deviceDetector: DeviceDetectorService,
    private route: ActivatedRoute,
    private poolsService: PoolsService,
    private modalService: NgbModal,
  ) { }

  public currentDate: moment.Moment;
  public namesOfDays = ['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс'];
  public weeks: Array<CalendarDate[]> = [];
  public selectedMonthAndYear: string = moment().locale('ru').format('MMMM YYYY');
  public nextMonth: string = moment().add(1, 'months').locale('ru').format('MMMM');
  public previousMonth: string = moment().add(-1, 'months').locale('ru').format('MMMM');
  public events: Event[] = [];
  public mobileDates: CalendarDate[] = [];
  private unsubscribe: Subject<void> = new Subject<void>();
  public loader = false;
  public isMobile = false;
  public selectedDay: CalendarDate = null;
  public addEventSelectedDay: CalendarDate = null;
  public selectedEditId: string | number = null;

  ngOnInit() {
    this.route.queryParams
      .pipe(takeUntil(this.unsubscribe))
      .subscribe(params => {

        this.currentDate = !!params.month && !!params.year
          ? moment(`01.${params.month}.${params.year}`, 'DD.MM.YYYY')
          : moment();
        this.generateCalendar();
      });
    this.isMobile = this.deviceDetector.isMobile();
  }

  @HostListener('window:resize', ['$event'])
  onResize() {
    this.isMobile = window.innerWidth >= 320 && window.innerWidth <= 768;
  }

  private generateCalendar(): void {
    const dates = this.fillDates(this.currentDate);
    const weeks = [];
    while (dates.length > 0) {
      weeks.push(dates.splice(0, 7));
    }

    this.defineWeekends(weeks);
    this.defineNotCurrentMonthDays(weeks);
    this.weeks = weeks;
    this.getEvents();
    this.updateMonthsButtons();
    this.setCurrentDateLabel();
  }

  getEvents(){
    this.loader = true;
    const dateSplitted = this.currentDate.format('YYYY-MM').split('-');
    forkJoin({
      events: this.apisService.getEvents(dateSplitted[0], dateSplitted[1]),
      pools: this.apisService.getOtherPools(),
      krystalgo: <Observable<PoolData[]>>this.poolsService.getKrystalGoData(),
    })
      .pipe(takeUntil(this.unsubscribe), finalize(() => {this.loader = false}))
      .subscribe(({events, pools, krystalgo}) => {

        const parsedPools = {...pools, krystalgo};
        this.events = events;
        this.distributeEvents(events);
        this.distributeOtherPoolEvents(parsedPools);
        this.fillMobileDates();
    });
  }

  editEvent(id: string | number, contentTemplate: any) {
    this.addEventSelectedDay = this.selectedDay;
    this.selectedEditId = id;
    const createEventModal = this.modalService.open(contentTemplate, {size: 'md', backdrop: 'static', keyboard: false});
    createEventModal.closed
      .pipe(takeUntil(this.unsubscribe))
      .subscribe(() => {
        this.selectedEditId = null;
      });
  }

  private distributeEvents(events: Event[]){

    const checkFormat = 'YYYY-MM-DD';
    this.weeks.forEach(week => {
      week.forEach(day => {
        const date = moment(day.mDate).format(checkFormat);
        day.events = events.filter(event => event.date === date);
      });
    });
  }

  eventRemoved(removedId: string | number) {
    const foundIndex = this.selectedDay.events.findIndex(event => event.id === removedId);
    if (foundIndex > -1) {
      this.selectedDay.events.splice(foundIndex, 1);
    }
  }

  private distributeOtherPoolEvents(pools: {[key: string]: PoolData[]}){
    const format = 'YYYY-MM-DD';
    this.weeks.forEach(week => {
      week.forEach(day => {
        const date = moment(day.mDate).format(format);
        Object.keys(pools).forEach(platformKey => {
          day.otherPools[platformKey] = pools[platformKey].filter(poolEvent =>
            moment(poolEvent.calendarDateTime).format(format) === date);
        });
      });
    });
    this.weeks = [...this.weeks];
  }

  get isCurrentMonth(){
    return moment(this.currentDate).format('MM.YYYY') === moment().format('MM.YYYY');
  }

  cellEnter(event: any){
    const addEventBtn = event.target.querySelector('#addEventBtn');
    addEventBtn.classList.add('show');
  }

  cellLeave(event: any){
    const addEventBtn = event.target.querySelector('#addEventBtn');
    addEventBtn.classList.remove('show');
  }

  addEventClick(event: any, day: CalendarDate, contentTemplate: any){
    event.stopPropagation();
    this.addEventSelectedDay = day;
    this.modalService.open(contentTemplate, {size: 'md', backdrop: 'static', keyboard: false});
  }

  showCurrentMonth(){
    this.currentDate = moment();
    this.generateCalendar();
  }

  private fillDates(currentMoment: moment.Moment): CalendarDate[] {
    const firstOfMonth = moment(currentMoment).startOf('month').day();
    const lastOfMonth = moment(currentMoment).endOf('month').day();

    const firstDayOfGrid = moment(currentMoment)
      .startOf('month')
      .subtract(firstOfMonth, 'days');

    const lastDayOfGrid = moment(currentMoment)
      .endOf('month')
      .subtract(lastOfMonth, 'days')
      .add(7, 'days');
    const startCalendar = firstDayOfGrid.date() + 1;

    return this.helpService.range(
      startCalendar,
      startCalendar + lastDayOfGrid.diff(firstDayOfGrid, 'days')
    ).map((date: any) => {
      const newDate = moment(firstDayOfGrid).date(date);
      return {
        today: this.isToday(newDate),
        isNotCurrentMonth: false,
        isWeekend: false,
        mDate: newDate,
        dateString: moment(newDate).format('DD.MM.YYYY'),
        events: [],
        otherPools: {}
      };
    });
  }

  private fillMobileDates(){
    this.mobileDates = [];
    this.weeks.forEach(week => {
      week.forEach((day, index) => {
        if (!day.isNotCurrentMonth)
          this.mobileDates.push({...day, dayName: this.namesOfDays[index]});
      });
    });
  }

  nextMonthClick(){
    this.currentDate = this.currentDate.add(1, 'months');
    this.generateCalendar();
    this.updateMonthsButtons();
    this.setCurrentDateLabel();
  }

  previousMonthClick(){
    this.currentDate = this.currentDate.add(-1, 'months');
    this.generateCalendar();
    this.updateMonthsButtons();
    this.setCurrentDateLabel();
  }

  private updateMonthsButtons(){
    this.nextMonth = moment(this.currentDate).add(1, 'months').locale('ru').format('MMMM');
    this.previousMonth = moment(this.currentDate).add(-1, 'months').locale('ru').format('MMMM');
  }

  private setCurrentDateLabel(){
    this.selectedMonthAndYear = this.currentDate.locale('ru').format('MMMM YYYY');
  }

  private defineWeekends(weeks: Array<CalendarDate[]>){
    for (const week of weeks) {
      const sundayIndex = week.length - 1;
      const saturdayIndex = week.length - 2;
      week[sundayIndex].isWeekend = true;
      week[saturdayIndex].isWeekend = true;
    }
  }

  private defineNotCurrentMonthDays(weeks: Array<CalendarDate[]>){

    const firstWeek = weeks[0];
    const lastWeek = weeks[weeks.length - 1];

    for (const day of firstWeek) {

      const date = new Date(day.mDate.toString()).getDate();
      if (date === 1){
        break;
      }
      day.isNotCurrentMonth = date > 1;
    }

    for (const day of lastWeek) {
      const date = new Date(day.mDate.toString()).getDate();
      day.isNotCurrentMonth = date < 20;
    }
  }

  private isToday(date: moment.Moment): boolean {
    return moment().isSame(moment(date), 'day');
  }

  exitDetails(){
    this.selectedDay = null;
  }

  ngOnDestroy(): void {
    this.unsubscribe.next();
    this.unsubscribe.complete();
  }
}
