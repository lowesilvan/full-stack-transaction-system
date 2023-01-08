import { ApiService } from './../service/api.service';
import { Component } from '@angular/core';
import { Transaction } from 'src/interfaces/api';

@Component({
  selector: 'app-transaction-form',
  templateUrl: './transaction-form.component.html',
  styleUrls: ['./transaction-form.component.css']
})
export class TransactionFormComponent {

  public transaction: Transaction = {
    sender: '',
    receiver: '',
    value: 0,
    timestamp: new Date().toLocaleDateString(),
    confirmed: false
  }

  constructor(private api: ApiService) {
    this.refreshTransactions()
  }

  ngOnInit(): void {
    console.log('on in it')
  }

  refreshTransactions() {
    this.api.getTransactions().subscribe(res => {
      console.log({refresh: res})
    })
  }

  submit() {
    // console.log(this.transaction)
    this.api.addTransaction(this.transaction).subscribe(res => {
      console.log({res})
      this.refreshTransactions()
    })
    // this.transaction = {
    //   sender: '',
    //   receiver: '',
    //   value: 0,
    //   timestamp: new Date().toLocaleDateString(),
    //   confirmed: false
    // }
  }
}
