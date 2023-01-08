import { Transaction } from './../../interfaces/api';
import { ApiService } from './../service/api.service';
import { Component } from '@angular/core';
import formatDistanceToNow from 'date-fns/formatDistanceToNow';

@Component({
  selector: 'app-transactions',
  templateUrl: './transactions.component.html',
  styleUrls: ['./transactions.component.css']
})
export class TransactionsComponent {
  public transactions: Array<any> = [];
  public isEmpty: boolean = false;
  public transaction!: Transaction;


  constructor(private api: ApiService) {
    this.refreshTransactions()
  }

  ngOnInit(): void {

    // add error handling for when transaction api is empty

    this.refreshTransactions()
  }

  createdDate(date: string) {
    return formatDistanceToNow(new Date(date), { addSuffix: true })
  }

  refreshTransactions() {
    this.api.getTransactions().subscribe(res => {
      this.transactions = res.data;
    })
  }

  deleteTransaction(id: String) {
    this.api.deleteTransaction(id).subscribe(res => {
      console.log(res)
      this.refreshTransactions()
    })
  }

}

// const data = {
//   sender: "Dadju",
//   receiver: "Aniita",
//   value: 100000,
//   confirmed: false,
//   timestamp: "2022-09-09 17:45:30"
// }
