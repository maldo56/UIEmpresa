import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ControllerService } from 'src/app/controller.service';

@Component({
  selector: 'app-mp-estados',
  templateUrl: './mp-estados.component.html',
  styleUrls: ['./mp-estados.component.css']
})
export class MpEstadosComponent implements OnInit {

  pest : number = 1;
  page: number = 0;
  pagesize : number = 10;

  siguiente : boolean = true;
  anterior : boolean = false;
  selected : boolean = false;

  estado = {
    Guid : '',
    Rut : '',
    Nombre : '',
    NuevoNombre : ''
  }

  AgregarEstadoMsg : number = 0;
  ModificarEstadoMsg : number = 0;

  estadosList : any;
  session : any;

  constructor(private router: Router, private app:ControllerService) { 
    if(sessionStorage.getItem('session')!=null){
      this.session = JSON.parse(sessionStorage.getItem('session'));

      this.estado.Rut = this.session.Rut;
    }else{
      this.router.navigateByUrl('/LogIn');
    }
  }

  ngOnInit() {
    this.setStyle(this.session.Tema);
  }

  agregarEstado(){
    this.app.agregarEstado(this.estado).subscribe(
      data => {
        if(data){
          this.AgregarEstadoMsg = 2;

          this.estado.Nombre = '';
          this.estado.NuevoNombre = '';
        }else{
          this.AgregarEstadoMsg = 1;
        }
      },
      error => {
        this.AgregarEstadoMsg = 3;
      }
    );
  }

  actualizarEstado(){
    console.log(this.estado);

    this.app.updateEstado(this.estado).subscribe(
      data => {
        if(data){
          this.ModificarEstadoMsg = 2;

          this.estado.Nombre = '';
          this.estado.NuevoNombre = '';
        }else{
          this.ModificarEstadoMsg = 1;
        }
      },
      error => {
        this.ModificarEstadoMsg = 3;
      }
    );
  }

  cargarUpdate(i){
    this.selected = true;
    this.estado.Guid = this.estadosList[i].Guid;
    this.estado.Nombre = this.estadosList[i].Nombre;
    this.estado.NuevoNombre = this.estadosList[i].Nombre;
  }

  pageSiguiente() {
    this.page ++;
    this.anterior = true;
    this.selected = false;
    this.app.listEstados(this.session.Rut, this.page*this.pagesize, this.pagesize).subscribe(
      data => {
        this.estadosList = data;

        if(this.estadosList.length<10){
          this.siguiente = false;
        }
      },
      error => {
        this.ModificarEstadoMsg = 3;
      }
    );
  }

  pageAnterior() {
    this.page --;
    this.siguiente = true;
    this.selected = false;
    if(this.page==0){
      this.anterior = false;
    }

    this.app.listEstados(this.session.Rut, this.page*this.pagesize, this.pagesize).subscribe(
      data => {
        this.estadosList = data;
      },
      error => {
        this.ModificarEstadoMsg = 3;
      }
    );
  }

  changeP(cod){
    this.AgregarEstadoMsg = 0;
    this.ModificarEstadoMsg = 0;
    this.selected = false;
    this.estado.Nombre = '';
    if(cod=='p1'){
      this.pest = 1;
    }else if(cod=='p2'){
      this.app.listEstados(this.session.Rut, this.page*this.pagesize, this.pagesize).subscribe(
        data => {
          console.log(data);
          this.estadosList = data;

          if(this.estadosList.length<10){
            this.siguiente = false;
          }
        },
        error => {
          this.ModificarEstadoMsg = 3;
        }
      );
      this.pest = 2;
    }
  }

  setStyle(style){
    document.getElementById('titulo').setAttribute('class', style+'Titulo');
    document.getElementById('pestañas').setAttribute('class', style+'Pestañas');
    document.getElementById('ContenedorForm').setAttribute('class', style+'Form');
  }
}
