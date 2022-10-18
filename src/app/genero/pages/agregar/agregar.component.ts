import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { GeneroService } from '../../services/genero.service';
import { Genero } from '../../interfaces/genero.interface';
import { ActivatedRoute, Router } from '@angular/router';
import { switchMap } from 'rxjs';

@Component({
  selector: 'app-agregar',
  templateUrl: './agregar.component.html',
  styles: [
  ]
})
export class AgregarComponent implements OnInit {

  miFormulario: FormGroup = this.fb.group({
    nombre: [ , [Validators.required, Validators.minLength(3)] ]  
  })

  genero: Genero = {
    nombre: ''
  };

  constructor( private fb: FormBuilder,
               private generoSevice: GeneroService,
               private router: Router,
               private activatedRoute: ActivatedRoute) { }

  ngOnInit(): void {

    this.miFormulario.reset({
      nombre: ''
    });

    if( !this.router.url.includes('editar')) {      
      return;
    }

    this.activatedRoute.params
      .pipe(
        switchMap( ({ id }) => this.generoSevice.getGeneroPorId( id ))
      )
      .subscribe( genero => {

        this.genero = genero;
        this.miFormulario.reset({
          nombre: this.genero.nombre
        });

      });     
      
  }

  campoEsValido(campo: string) {
    return this.miFormulario.controls[campo].errors
           && this.miFormulario.controls[campo].touched;
  }

  guardar() {

    //Si el formulario es invalido, marcar como tocadas
    if ( this.miFormulario.invalid) {
      this.miFormulario.markAllAsTouched();
      return;
    }
    
    //Asigno el nombre del formulario a la entidad genero
    this.genero.nombre = this.miFormulario.controls['nombre'].value;

    //Si el genero tiene algun valor
    if( this.genero.nombre.trim().length === 0) {
      return;
    }

    //Si el genero tiene id
    if ( this.genero.id ) {
      //Actualizar
      this.generoSevice.actualizarGenero( this.genero )
        .subscribe( resp => {
          this.router.navigate(['/genero/listado' ]); 
        });
    } else {
      //Crear
      this.generoSevice.agregarGenero( this.genero )
        .subscribe( genero => {
          this.router.navigate(['/genero/listado' ]);
        });
    }    
  }

}
