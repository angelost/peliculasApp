import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Genero } from '../../interfaces/genero.interface';
import { GeneroService } from '../../services/genero.service';

@Component({
  selector: 'app-listado',
  templateUrl: './listado.component.html',
  styles: [
  ]
})
export class ListadoComponent implements OnInit {

  generos: Genero[] = [];

  constructor(private generoService: GeneroService,
              private router: Router) { }

  ngOnInit(): void {

    this.generoService.getGeneros()
      .subscribe( generos => {
        this.generos = generos;
      } )
  }

  borrar(id: number) {

    if( id > 0) {

      this.generoService.borrarGenero( id.toString() )
            .subscribe( resp => {
              this.ngOnInit();
            });

    } 
  }

}
