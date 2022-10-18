import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';


const routes: Routes = [
  {
    path: 'genero',
    loadChildren: () => import('./genero/genero.module').then( m => m.GeneroModule )
  },
  {
    path: 'actor',
    loadChildren: () => import('./actor/actor.module').then( m => m.ActorModule )
  },
  {
    path: 'pelicula',
    loadChildren: () => import('./pelicula/pelicula.module').then( m => m.PeliculaModule )
  },
  {
    path: '**',
    redirectTo: 'peliculas'
  }
];


@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
