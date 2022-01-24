import {Component, Input, OnInit} from '@angular/core';

@Component({
  selector: 'app-percent-value',
  templateUrl: './percent-value.component.html',
  styleUrls: ['./percent-value.component.scss']
})
export class PercentValueComponent implements OnInit {

  @Input() value;
  constructor() { }

  ngOnInit(): void {
  }

}
