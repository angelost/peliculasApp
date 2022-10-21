import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Operation } from 'fast-json-patch';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Actor } from '../interfaces/actor.interface';

@Injectable({
  providedIn: 'root'
})
export class ActorService {

  private baseUrl: string = environment.baseUrl + '/actores';

  constructor( private http: HttpClient ) { }

  getActores(): Observable<Actor[]> {
    return this.http.get<Actor[]>(`${ this.baseUrl }`);     
  }

  getActorPorId( id: string ): Observable<Actor> {
    return this.http.get<Actor>(`${ this.baseUrl }/${ id }`);
  } 

  agregarActor( formData: FormData ): Observable<Actor> {     
    return this.http.post<Actor>(`${ this.baseUrl }`, formData);
  }

  actualizarActor( id: string, patch: Operation[] ): Observable<any>{
    return this.http.patch<any>(`${ this.baseUrl }/${ id }`, patch);
  }

  borrarActor( id: string ): Observable<any> {
    return this.http.delete<any>(`${ this.baseUrl }/${ id }`);
  }
}
