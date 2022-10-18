import { Component } from '@angular/core';

interface MenuItem {
  texto: string;
  ruta: string;
}

@Component({
  selector: 'app-sidemenu',
  templateUrl: './sidemenu.component.html',
  styles: [
    `
      li {
        cursor: pointer;
      }
    `
    ]
})
export class SidemenuComponent {

  constructor() { }

  peliculaMenu: MenuItem[] = [
    {
      texto: 'Genero',
      ruta: './genero/listado'
    },
    {
      texto: 'Actor',
      ruta: './actor/listado'
    },
    {
      texto: 'Pelicula',
      ruta: './pelicula/listado'
    }
  ];


}
