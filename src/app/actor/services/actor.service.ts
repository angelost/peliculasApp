import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Actor } from '../interfaces/actor.interface';

@Injectable({
  providedIn: 'root'
})
export class ActorService {

  private baseUrl: string = environment.baseUrl;

  constructor( private http: HttpClient ) { }

  getActores(): Observable<Actor[]> {
    return this.http.get<Actor[]>(`${ this.baseUrl }/actores`);     
  }
}
