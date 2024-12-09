import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { Observable} from 'rxjs';
import { AuthResponse } from '../interfaces/auth-response';
import { HttpClient } from '@angular/common/http';
import { Book } from '../interfaces/book';
import { BookResponse } from '../interfaces/book-response';
import { BookDetail } from '../interfaces/bookDetail';

@Injectable({
  providedIn: 'root',
})
export class BookService {
  apiUrl: string = environment.apiUrl;
  private tokenKey = 'token';

  constructor(private http: HttpClient) {}


  addBook(data: Book): Observable<BookResponse> {
    return this.http
      .post<BookResponse>(`${this.apiUrl}books`, data)
  }

  getBooks = ():Observable<BookDetail[]> =>
    this.http.get<BookDetail[]>(`${this.apiUrl}books`)

  getBook = (id:string):Observable<Book> =>
    this.http.get<Book>(`${this.apiUrl}books/${id}`)

  putBook = (data:Book, id:string): Observable<BookResponse> => {
    return this.http.put<BookResponse>(`${this.apiUrl}books/${id}`, data)
  }

  deleteBook = (data: string): Observable<any> => {
    return this.http.delete(`${this.apiUrl}books/${data}`);
  }
  }
