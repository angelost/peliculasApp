import { Component, createPlatformFactory, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DomSanitizer } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
import { NgbDateAdapter, NgbDateParserFormatter } from '@ng-bootstrap/ng-bootstrap';
import { switchMap } from 'rxjs';
import { Actor } from '../../interfaces/actor.interface';
import { ActorService } from '../../services/actor.service';
import { CustomAdapter } from '../../services/CustomAdapter';
import { CustomDateParserFormatter } from '../../services/CustomDateParserFormatter';
import { compare } from 'fast-json-patch';

@Component({
  selector: 'app-agregar',
  templateUrl: './agregar.component.html',
  providers: [
		{ provide: NgbDateAdapter, useClass: CustomAdapter },
		{ provide: NgbDateParserFormatter, useClass: CustomDateParserFormatter },
	],
  styles: [
    `
    button.calendar, button.calendar:active {
      width: 2.75rem;
      background-image: url('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACIAAAAcCAYAAAAEN20fAAAABHNCSVQICAgIfAhkiAAAAAlwSFlzAAAOxAAADsQBlSsOGwAAABl0RVh0U29mdHdhcmUAd3d3Lmlua3NjYXBlLm9yZ5vuPBoAAAEUSURBVEiJ7ZQxToVAEIY/YCHGxN6XGOIpnpaEsBSeQC9ArZbm9TZ6ADyBNzAhQGGl8Riv4BLAWAgmkpBYkH1b8FWT2WK/zJ8ZJ4qiI6XUI3ANnGKWBnht2/ZBDRK3hgVGNsCd7/ui+JkEIrKtqurLpEWaphd933+IyI3LEIdpCYCiKD6HcuOa/nwOa0ScJEnk0BJg0UTUWJRl6RxCYEzEmomsIlPU3IPW+grIAbquy+q6fluy/28RIBeRMwDXdXMgXLj/B2uimRXpui4D9sBeRLKl+1N+L+t6RwbWrZliTTTr1oxYtzVWiTQAcRxvTX+eJMnlUDaO1vpZRO5NS0x48sIwfPc87xg4B04MCzQi8hIEwe4bl1DnFMCN2zsAAAAASUVORK5CYII=') !important;
      background-repeat: no-repeat;
      background-size: 23px;
      background-position: center;
    }
    
    `
  ]
})
export class AgregarComponent implements OnInit {

  public archivos:any = [];
  public previsualizacion!: string;
  public loading!: boolean;
  
  model!: Actor;
  original!: Actor;

  miFormulario: FormGroup = this.fb.group({
    nombre: [ , [Validators.required, Validators.minLength(3)] ],
    fechaNacimiento: [ , [Validators.required]],
    foto: [ , ]
  })

  actor: Actor = {
    nombre: ''
  };

  constructor( private fb: FormBuilder,
               private actorService: ActorService,
               private router: Router,
               private activatedRoute: ActivatedRoute,
               private sanitizer: DomSanitizer) { }

  ngOnInit(): void {       
    

    this.miFormulario.reset({
      nombre: '',
      fechaNacimiento: ''
      
    });

    if( !this.router.url.includes('editar')) {      
      return;
    }

    this.activatedRoute.params
      .pipe(
        switchMap( ({ id }) => this.actorService.getActorPorId( id ))
      )
      .subscribe( actor => {        

        this.actor = actor;
        this.previsualizacion = actor.foto!;
        this.original = actor;
        this.miFormulario.reset({
          nombre: this.actor.nombre,
          fechaNacimiento: this.actor.fechaFormateada,
          foto: this.actor.foto
        });
      });
  }

  campoEsValido(campo: string) {
    return this.miFormulario.controls[campo].errors
           && this.miFormulario.controls[campo].touched;
  }
  
  capturarFile(event: any):any {

    const archivoCapturado = event.target.files[0];
    this.extraerBase64(archivoCapturado).then((imagen: any) => {
      this.previsualizacion = imagen.base;
      // console.log( imagen);
    })
    this.archivos.push(archivoCapturado);
  }

  extraerBase64 = async ($event: any) => new Promise((resolve, reject) => {
    try {
      const unsafeImg = window.URL.createObjectURL($event);
      const image = this.sanitizer.bypassSecurityTrustUrl(unsafeImg);
      const reader = new FileReader();
      reader.readAsDataURL($event);
      reader.onload = () => {
        resolve({
          base: reader.result
        });
      };
      reader.onerror = error => {
        resolve({
          base: null
        });
      };

    } catch (e) {
      return null;
    }
    return null;
  })  

  guardar() {   

    try {
      // this.loading = true;

      // Si el formulario es invalido, marcar como tocadas
      if ( this.miFormulario.invalid) {
        this.miFormulario.markAllAsTouched();
        return;
      }

      // Validar que el formulario tiene algun valor
      const { nombre, fechaNacimiento } = this.miFormulario.value;      
      if( nombre.trim().length === 0) {       
        return;
      }
      
      // Si la entidad tiene id
      if ( this.actor.id ) {

        // Actualizar
        this.actualizarActor( nombre, fechaNacimiento);

      } else {

        // Crear
        this.agregarActor( nombre, fechaNacimiento);

      }   
      
    } catch (error) {

      this.loading = false;
      console.log('ERROR', error);      
    }    
  }

  agregarActor(nombre: string, fechaNacimiento: string) {

    // Crea el FormData
    const formularioDeDatos = new FormData();
    formularioDeDatos.append('Nombre', nombre);
    formularioDeDatos.append('FechaNacimiento', fechaNacimiento!);

    this.archivos.forEach((archivo:any) => {
      formularioDeDatos.append('Foto', archivo)
    });

    this.actorService.agregarActor( formularioDeDatos )
      .subscribe( actor => {
        this.loading = false;
        this.router.navigate(['/actor/listado' ]);
      });
  }

  actualizarActor(nombre: string, fechaNacimiento: string) {

    // generar el patch
    this.original.fechaNacimiento = this.original.fechaFormateada;        
    this.model = this.miFormulario.value;
    this.model.id = this.original.id;
    this.model.fechaFormateada = this.original.fechaFormateada;
    this.model.fechaNacimiento = fechaNacimiento;
    this.model.foto = this.original.foto;

    // console.log('original', this.original);
    // console.log('model', this.model);          

    const patch = compare(this.original, this.model);
    // console.log('patch', patch);

    this.actorService.actualizarActor( this.actor.id!, patch )
      .subscribe( actor => {
        this.loading = false;
        
        this.router.navigate(['/actor/listado' ]);
      });
  }

}


