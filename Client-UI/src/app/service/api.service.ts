import { Api, Transaction } from './../../interfaces/api';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from "@angular/core"
import { map, Observable, retry } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class ApiService {

  constructor(private httpClient: HttpClient) {
  }

  getTransactions() {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' })
    return this.httpClient.get<Api>('http://localhost:5000/api', { headers, observe: 'body' })
      .pipe(map((res) => {
        return res
      }))
  }

  addTransaction(data: Transaction): Observable<unknown> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' })
    const body = JSON.stringify(data);
    return this.httpClient.post('http://localhost:5000/api', body, { headers, responseType: 'text', observe: 'response' })
  }

  deleteTransaction(id: String): Observable<unknown> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' })
    return this.httpClient.delete('http://localhost:5000/api/' + id, { headers, responseType: 'text', observe: 'response' })
  }

  updateTransaction() {}

}
