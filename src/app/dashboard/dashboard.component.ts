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
    this.columns = []
    this.displayData = []
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

  search() { }

  dateFilter() {
    const startDate = new Date(this.range.get('start').value)
    const endDate = new Date(this.range.get('end').value)

    const paramStart = `${startDate.getFullYear()}-${startDate.getMonth()}-${startDate.getDate()}`
    const paramEnd = `${endDate.getFullYear()}-${endDate.getMonth()}-${endDate.getDate()}`

    this.service.makeGetRequest(this.getFullDateUrl(startDate, endDate)).subscribe(data => {
      console.log(data);

      this.lable = `${paramStart} - ${paramEnd}`
      if (data.dataset_data != undefined) {
        if (data.dataset_data.data.length > 0) {
          this.columns = []
          this.displayData = []
          console.log(data.dataset_data.data);

          for (let i = 0; i < data.dataset_data.data.length; i++) {
            this.getSpecificField(0, data.dataset_data.data[i])
          }
        }
      }
      console.log(this.displayData)
      this.createChart()
    })
  }

  createChart() {
    const chart = new Chart("chart", {
      type: 'line',
      data: {
        labels: [this.lable],
        borderColor: "#000000",
        datasets: [{
          label: this.lable,
          fill: false,
          data: this.displayData,
          borderWidth: 1,
        }]
      },
    });
  }

  getFullDateUrl(start, end) {
    return "https://data.nasdaq.com/api/v3/datasets/WIKI/FB.json?column_index=4&start_date=" + start
      + "&end_date=" + end + "&api_key=yitiMVJsyFcsFoR-tkp1"
  }
}
