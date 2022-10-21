import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Genero } from '../interfaces/genero.interface';

@Injectable({
  providedIn: 'root'
})
export class GeneroService {

  private baseUrl: string = environment.baseUrl + '/generos';

  constructor(private http: HttpClient) { }

  getGeneros(): Observable<Genero[]> {
    return this.http.get<Genero[]>(`${ this.baseUrl }`);     
  }

  getGeneroPorId( id: string ): Observable<Genero> {
    return this.http.get<Genero>(`${ this.baseUrl }/${ id }`);
  }

  agregarGenero( genero: Genero ): Observable<Genero> {     
    return this.http.post<Genero>(`${ this.baseUrl }`, genero);
  }

  actualizarGenero( genero: Genero ): Observable<Genero> {
    return this.http.put<Genero>(`${ this.baseUrl }/${ genero.id }`, genero);
  }

  borrarGenero( id: string ): Observable<any> {
    return this.http.delete<any>(`${ this.baseUrl }/${ id }`);
  }

}
