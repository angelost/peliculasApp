import { Component, OnInit } from '@angular/core';
import { Actor } from '../../interfaces/actor.interface';
import { ActorService } from '../../services/actor.service';



@Component({
  selector: 'app-listado',
  templateUrl: './listado.component.html',
  styles: [
  ]
})
export class ListadoComponent implements OnInit {

  actores: Actor[] = [];

  constructor(private actorService: ActorService) { }

  ngOnInit(): void {
    this.actorService.getActores()
      .subscribe( actores => {
        this.actores = actores;
      } )
  }

  borrar(id: string) {

    if(id) {

      this.actorService.borrarActor( id )
            .subscribe( resp => {
              this.ngOnInit();
            });

    } 
  }

}
