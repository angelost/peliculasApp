import { Component, OnInit } from '@angular/core';
import { Pelicula } from '../../interfaces/pelicula.interface';
import { PeliculaService } from '../../services/pelicula.service';

@Component({
  selector: 'app-listado',
  templateUrl: './listado.component.html',
  styles: [
  ]
})
export class ListadoComponent implements OnInit {

  peliculas: Pelicula[] = [];

  constructor(private peliculaService: PeliculaService) { }

  ngOnInit(): void {
    this.peliculaService.getPeliculas()
      .subscribe( peliculas => {
        this.peliculas = peliculas;
      } )
  }

}
