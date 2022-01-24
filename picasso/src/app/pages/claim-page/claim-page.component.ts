import {Component, OnDestroy, OnInit} from '@angular/core';
import {ApisService} from "../../shared/services/apis.service";
import {ClaimConfig, Networks} from "../../shared/models";
import {finalize, takeUntil} from "rxjs/operators";
import {forkJoin, Observable, of, Subject} from "rxjs";
import {PoolsService} from "../../shared/services/pools.service";
import {FormArray, FormControl, FormGroup, Validators} from "@angular/forms";
import {NgbModal, NgbModalRef} from "@ng-bootstrap/ng-bootstrap";

@Component({
  selector: 'app-claim-page',
  templateUrl: './claim-page.component.html',
  styleUrls: ['./claim-page.component.scss']
})
export class ClaimPageComponent implements OnInit, OnDestroy {

  claimData: ClaimConfig[] = [];
  unsubscribe: Subject<void> = new Subject();
  loader = true;
  notShowOld = true;
  addClaimForm = new FormGroup({
    token: new FormControl(null, [Validators.required]),
    source: new FormControl(null, [Validators.required]),
    chain: new FormControl(null, [Validators.required]),
    type: new FormControl(null),
    percentage: new FormControl(null, [Validators.required]),
    dateMap: new FormArray([])
  });
  isEdit = false;
  editingClaim: ClaimConfig = null;
  Networks = Networks;
  submitted = false;
  createClaimModalRef: NgbModalRef = null;
  claimItemRemoveIndex = -1;
  constructor(
    private apisService: ApisService,
    private poolsService: PoolsService,
    private modalService: NgbModal,
  ) { }

  ngOnInit(): void {
    this.loader = true;
    forkJoin({
      allClaimData: this.apisService.getTokensCollection(),
      // krystalGoData: <Observable<ClaimConfig[]>>this.poolsService.getKrystalGoData(true)
    })
      .pipe(takeUntil(this.unsubscribe), finalize(() => {this.loader = false}))
      .subscribe(({allClaimData}) => {
        // this.claimData = [...allClaimData, ...krystalGoData];
        this.claimData = allClaimData;
        this.sortClaims();
      });

    const dateString = this.convertDateToString(new Date());
    (<FormArray>this.addClaimForm.controls['dateMap'])
      .push(new FormControl(dateString, [Validators.required]));
  }

  private convertDateToString(date: Date){
    const fixedMonth = date.getMonth() + 1;
    const month = fixedMonth < 10 ? ('0' + fixedMonth) : fixedMonth;
    const hours = date.getHours() < 10 ? ('0' + date.getHours()) : date.getHours();
    const minutes = date.getMinutes() < 10 ? ('0' + date.getMinutes()) : date.getMinutes();
    return `${date.getFullYear()}-${month}-${date.getDate()}T${hours}:${minutes}`;
  }

  private convertStringToDate(dateString: string){
    return new Date(dateString);
  }

  get dateMapControls(): FormControl[]{
    return <FormControl[]>(this.addClaimForm.controls['dateMap']['controls']);
  }

  editClaim(selectedClaim: ClaimConfig, modalTemplate: any){
    this.isEdit = true;
    this.editingClaim = selectedClaim;
    this.openCreateClaimModal(modalTemplate);
  }

  removeClaimItem(removeIndex: any){
    if (this.claimItemRemoveIndex !== -1) return;

    this.claimItemRemoveIndex = removeIndex;
    this.apisService.removeClaimItem(this.editingClaim.id)
      .pipe(takeUntil(this.unsubscribe), finalize(() => {this.claimItemRemoveIndex = -1}))
      .subscribe(() => {
        const controls = <FormControl[]>(this.addClaimForm.controls['dateMap']['controls'])

      })
  }

  removeClaimGroup(){

  }

  createClaimSubmit(){
    this.submitted = true;
    if (this.addClaimForm.invalid) return;

    this.loader = true;
    const dataArray: ClaimConfig[] = [];
    const groupId = this.generateClaimGroupId();
    this.dateMapControls.forEach((control) => {

      const readyItem = {
        chain: this.addClaimForm.value.chain,
        token: this.addClaimForm.value.token,
        type: this.addClaimForm.value.type,
        source: this.addClaimForm.value.source,
        percentage: this.addClaimForm.value.percentage,
        date: this.convertStringToDate(control.value),
        groupId
      };
      dataArray.push(readyItem);
    });

    this.apisService.createClaims(dataArray)
      .pipe(takeUntil(this.unsubscribe), finalize(() => {this.loader = false}))
      .subscribe(({message}) => {
        this.createClaimModalRef.close();
        this.clearCreateClaimForm();
        this.claimData.push(...dataArray);
        this.sortClaims();
      });
  }

  private generateClaimGroupId(){
    const arr = this.claimData.filter(it => it.groupId).map(it => it.groupId);
    return arr.length ? (Math.max(...arr) + 1) : 1;
  }

  private sortClaims(){
    this.claimData = [...this.claimData]// @ts-ignore
      .sort((a,b) => new Date(a.date) - new Date(b.date));
  }

  private clearCreateClaimForm(){
    this.addClaimForm.reset();
    const dateString = this.convertDateToString(new Date());
    (<FormArray>this.addClaimForm.controls['dateMap']).controls = [
      new FormControl(dateString, [Validators.required])
    ];
  }

  openCreateClaimModal(contentTemplate: any){
    this.createClaimModalRef = this.modalService.open(contentTemplate, {size: 'md', backdrop: 'static', keyboard: false});
    this.createClaimModalRef.closed
      .pipe(takeUntil(this.unsubscribe))
      .subscribe(() => {
      this.clearCreateClaimForm();
      this.isEdit = false;
    });
  }

  newEventDateField(){
    const controls = (<FormArray>this.addClaimForm.controls['dateMap']).controls;
    const previousDate = this.convertStringToDate(controls[controls.length - 1].value);
    const newMonth = previousDate.getMonth() === 11 ? 0 : previousDate.getMonth() + 1;
    const newDate = new Date(previousDate.getFullYear(), newMonth, previousDate.getDate(),
      previousDate.getHours(), previousDate.getMinutes());
    (<FormArray>this.addClaimForm.controls['dateMap'])
      .push(new FormControl(this.convertDateToString(newDate), [Validators.required]));
  }

  ngOnDestroy(): void {
    this.unsubscribe.next();
    this.unsubscribe.complete();
  }
}
