import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Pelicula } from '../interfaces/pelicula.interface';

@Injectable({
  providedIn: 'root'
})
export class PeliculaService {

  private baseUrl: string = environment.baseUrl;

  constructor(private http: HttpClient) { }

  getPeliculas(): Observable<Pelicula[]> {
    return this.http.get<Pelicula[]>(`${ this.baseUrl }/peliculas/filtro`);     
  }
}
