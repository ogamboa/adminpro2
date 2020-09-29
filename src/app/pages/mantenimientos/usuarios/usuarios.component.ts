import { Component, OnInit, OnDestroy } from '@angular/core';
import { UsuarioService } from 'src/app/services/usuario.service';
import { BusquedasService } from 'src/app/services/busquedas.service';

import { Usuario } from 'src/app/models/usuario.model';
import Swal from 'sweetalert2';
import { ModalImagenService } from 'src/app/services/modal-imagen.service';
import { delay } from 'rxjs/operators';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-usuarios',
  templateUrl: './usuarios.component.html',
  styles: [
  ]
})
export class UsuariosComponent implements OnInit, OnDestroy {

  public totalUsuarios: number=0;
  public usuarios: Usuario[]=[];
  public usuariosTemp: Usuario[]=[];
  public desde:number=0;
  public cargando: boolean = true;
  public imgSubs: Subscription;

  constructor( private usuarioService: UsuarioService,
              private busquedasService: BusquedasService,
              private modalImagenService: ModalImagenService) { }

  ngOnDestroy(): void {
    this.imgSubs.unsubscribe();
  }

  ngOnInit(): void {

    this.cargarUsuarios();

    this.imgSubs=this.modalImagenService.nuevaImagen
    .pipe (
      delay(100)
    )
    .subscribe(img => this.cargarUsuarios());
  }

  cargarUsuarios(){
    this.cargando=true;
    this.usuarioService.cargarUsuarios(this.desde)
      .subscribe( ({total,usuarios}) =>{
        this.totalUsuarios = total;
        this.usuarios = usuarios;
        this.cargando=false;
        this.usuariosTemp=usuarios;
      })
  }

  cambiarPagina(valor:number){
    this.desde += valor;

    if (this.desde<0){
      this.desde=0;
    }
    else if (this.desde > this.totalUsuarios){
      this.desde -=valor;
    }

    this.cargarUsuarios();
  }

  buscar(termino:string){

    if (termino.length===0){
      return this.usuarios = this.usuariosTemp;
    }

    this.busquedasService.buscar('usuarios',termino)
      .subscribe( resp => {
        this.usuarios=resp;

      });
  }

  eliminarUsuario (usuario:Usuario){

    if (usuario.uid===this.usuarioService.uid){
      return Swal.fire('Error', 'No puede borrar su propio usuario');
    }

    Swal.fire({
      title: '¿Borrar usuario?',
      text: `Esta a punto de borrar a ${usuario.nombre}`,
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Si, borrar!'
    }).then((result) => {
      if (result.isConfirmed) {
        this.usuarioService.eliminarUsuario(usuario)
          .subscribe(resp => {
            this.cargarUsuarios();
            Swal.fire('Usuario borrado',
            `${usuario.nombre} fue borrado correctamente`,
            'success'
            );
          });

      }
    })
  }

  cambiarRole(usuario:Usuario){
    this.usuarioService.guardarUsuario(usuario)
      .subscribe(resp =>{
        console.log(resp);
      })
  }

  abrirModal(usuario:Usuario){
    this.modalImagenService.abrirModal('usuarios',usuario.uid, usuario.img);
  }

}
