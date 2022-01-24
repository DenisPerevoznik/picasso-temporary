import {Component, Input, OnInit} from '@angular/core';
import {CalendarDate, Event, PlatformIcons, MetadataEvent} from "../../../shared/models";
import {FormArray, FormControl, FormGroup, Validators} from "@angular/forms";
import {ApisService} from "../../../shared/services/apis.service";
import {finalize} from "rxjs/operators";
import * as moment from 'moment';

@Component({
  selector: 'app-add-event-popup',
  templateUrl: './add-event-popup.component.html',
  styleUrls: ['./add-event-popup.component.scss']
})
export class AddEventPopupComponent implements OnInit {

  @Input() selectedDay: CalendarDate = null;
  @Input() editId: string | number = null;
  @Input() modal: any = null;
  public newEventForm: FormGroup = new FormGroup({
    title: new FormControl(null, [Validators.required]),
    tokenName: new FormControl(null, [Validators.required]),
    icon: new FormControl(PlatformIcons.Picasso),
    banner: new FormControl(null),
    link: new FormControl(null),
    metadata: new FormArray([])
  });
  public submitted = false;
  public platformIcons = PlatformIcons;
  public loader = false;
  public isEdit = false;
  constructor(
    private apiService: ApisService
  ) { }

  ngOnInit(): void {

    this.isEdit = !!this.editId;
    if (this.isEdit) {
      this.newEventForm.patchValue(this.editingEvent);
      if (this.editingEvent.metadata.length) {
        this.editingEvent.metadata.forEach(item => {
          const itemFormGroup = new FormGroup({
            title: new FormControl(item.title),
            value: new FormControl(item.value)
          });
          (<FormArray>this.newEventForm.controls['metadata']).push(itemFormGroup);
        });
        return;
      }
      this.newEventForm.controls['metadata']['controls'] = [];
      return;
    }

    (<FormArray>this.newEventForm.controls['metadata']).push(new FormGroup({
      title: new FormControl(null),
      value: new FormControl(null)
    }));
  }

  get editingEvent(){
    return <Event>this.selectedDay.events.find(event => event.id === this.editId);
  }

  public createEventSubmit(){
    if (this.newEventForm.invalid) {
      this.submitted = true;
      return;
    }

    this.loader = true;
    const metadata: MetadataEvent[] = this.formGroupsMetadata
      .map(formGroup => ({title: formGroup.value.title, value: formGroup.value.value}));

    const date = moment(this.selectedDay.mDate).format('YYYY-MM-DD');
    let link = this.newEventForm.value.link;
    if (link && !link.startsWith('http')){
      link = `https://${link}`;
    }
    const data = {
      title: this.newEventForm.value.title,
      tokenName: this.newEventForm.value.tokenName,
      icon: this.newEventForm.value.icon,
      banner: this.newEventForm.value.banner,
      link,
      date,
      metadata
    };

    if (this.isEdit) {
      this.apiService.updateEvent({id: this.editId, ...data})
        .pipe(finalize(() => {this.loader = false; this.submitted = false}))
        .subscribe(response => {
          const editedIndex = this.selectedDay.events.findIndex(event => event.id === this.editId);
          this.selectedDay.events[editedIndex] = {id: this.editId, ...data};
          this.modal.close();
        });
      return;
    }

    this.apiService.createEvent(data)
      .pipe(finalize(() => {this.loader = false; this.submitted = false}))
      .subscribe(response => {
        this.selectedDay.events.push(data);
        this.modal.close();
      });
  }

  newEventAddMetadataField(){
    (<FormArray>this.newEventForm.controls['metadata']).push(new FormGroup({
      title: new FormControl(null, [Validators.required]),
      value: new FormControl(null, [Validators.required]),
    }));
  }

  removeMetadataItem(index: number) {
    this.newEventForm.controls['metadata']['controls'].splice(index, 1);
  }

  get formGroupsMetadata(): FormGroup[]{
    return <FormGroup[]>(this.newEventForm.controls['metadata']['controls']);
  }
}
