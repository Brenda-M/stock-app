import { Component, OnInit, } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Chart } from 'chart.js';
import { environment } from 'src/environments/environment';
import { DataList } from '../models/GraphData';
import { AppService } from '../services/app-service.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {

  searchform: FormGroup;
  filterForm: FormGroup;
  range: FormGroup;
  data: DataList[]
  columns = [
    "Date",
    "Open",
    "High",
    "Low",
    "Close",
    "Volume",
    "Ex-Dividend",
    "Split Ratio",
    "Adj. Open",
    "Adj. High",
    "Adj. Low",
    "Adj. Close",
    "Adj. Volume",
  ]
  displayData = []
  isLoading: boolean
  chart: Chart
  lable: String

  constructor(private service: AppService, private formBuilder: FormBuilder) {
    this.searchform = this.formBuilder.group({
      searchTerm: ['', Validators.required],
    });

    this.filterForm = this.formBuilder.group({
      filter: ['', Validators.required],
    });

    this.range = new FormGroup({
      start: new FormControl(),
      end: new FormControl(),
    });
  }


  ngOnInit(): void {
    this.getData("Close")
  }

  getData(value: string) {
    this.service.makeGetRequest(environment.base_url).subscribe(data => {
      this.lable = value
      for (let i = 0; i < data.dataset_data.data.length; i++) {
        this.getSpecificField(this.columns.indexOf(value), data.dataset_data.data[i])
      }
      console.log(this.columns)
      this.createChart()
    })
  }

  changeFilter() {
    this.service.makeGetRequest(environment.base_url).subscribe(data => {
      this.lable = this.filterForm.get('filter').value
      for (let i = 0; i < data.dataset_data.data.length; i++) {
        this.getSpecificField(this.columns
          .indexOf(this.filterForm.get('filter').value),
          data.dataset_data.data[i])
      }
      // console.log(this.displayData)
      this.createChart()
    })
  }

  getSpecificField(fieldIndex: number, dataList: []) {
    this.displayData.push(dataList[fieldIndex])
  }

  search() {

  }

  createChart() {
    const chart = new Chart("chart", {
      type: 'line',
      data: {
        labels: [this.lable],
        datasets: [{
          label: this.lable,
          fill: false,
          data: this.displayData,
          borderWidth: 1
        }]
      },
    });
  }
}
