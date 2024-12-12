import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { Observable} from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { Quote } from '../interfaces/quote';

@Injectable({
  providedIn: 'root',
})
export class QuoteService {
  apiUrl: string = environment.apiUrl;

  constructor(private http: HttpClient) {}


  addQuote(data: Quote): Observable<any> {
    return this.http
      .post(`${this.apiUrl}citats/`, data)
  }

  getQuotes = ():Observable<Quote[]> =>
    this.http.get<Quote[]>(`${this.apiUrl}citats`)


  deleteQuote = (data: string): Observable<any> => {
    return this.http.delete(`${this.apiUrl}citats/${data}`);
  }
  }
