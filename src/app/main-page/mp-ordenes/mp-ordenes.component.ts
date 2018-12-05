import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ControllerService } from 'src/app/controller.service';

@Component({
  selector: 'app-mp-ordenes',
  templateUrl: './mp-ordenes.component.html',
  styleUrls: ['./mp-ordenes.component.css']
})
export class MpOrdenesComponent implements OnInit {

  pageOrden: number = 0;
  pageEstado: number = 0;
  pagesize : number = 10;

  session : any;
  ordenes : any;
  estados : any;

  ordenSelect : any;
  productosOrden : any;
  estadoActual = {
    Nombre : '',
    Guid : ''
  }

  estadoAnterior : boolean = false;
  estadoSiguiente : boolean = true;

  ordenAnterior : boolean = false;
  ordenSiguiente : boolean = true;

  ModificarEstadoMsg : number = 0;

  constructor(private router: Router, private app:ControllerService) { 
    if(sessionStorage.getItem('session')!=null){
    this.session = JSON.parse(sessionStorage.getItem('session'));

    this.app.listarOrdenes(this.session.Rut, this.pageOrden*this.pagesize, this.pagesize).subscribe(
      data => {
        this.ordenes = data;

        console.log(this.ordenes);
      },
      error => {
        console.log(error);
      }
    );
  }else{
    this.router.navigateByUrl('/LogIn');
  }}

  ngOnInit() {
    
  }

  cargarOrden(i) {
    console.log(this.ordenes[i]);

    this.app.listEstados(this.session.Rut, this.pageEstado*5, 5).subscribe(
      data => {
        console.log(data);

        this.estados = data;
      },
      error => {
        console.log(error);
      }
    );

    document.getElementById('Panel').style.display = 'block';

    this.ordenSelect = this.ordenes[i];
    this.productosOrden = this.ordenSelect.Productos;

    if(this.ordenes[i].NombreEstado=='NULL'){
      this.estadoActual.Nombre = 'No asignado';
    }else{
      this.estadoActual.Nombre = this.ordenes[i].NombreEstado;
      this.estadoActual.Guid = this.ordenes[i].Guid;
    }
  }

  pageestadoSiguiente() {
    this.pageEstado ++;
    this.estadoAnterior = true;
    this.app.listEstados(this.session.Rut, this.pageEstado*5, 5).subscribe(
      data => {
        this.estados = data;

        if(this.estados.length<5){
          this.estadoSiguiente = false;
        }
      },
      error => {
        console.log(error);
      }
    );
  }

  pageestadoAnterior() {
    this.pageEstado --;
    this.estadoSiguiente = true;
    if(this.pageEstado==0){
      this.estadoAnterior = false;
    }

    this.app.listEstados(this.session.Rut, this.pageEstado*5, 5).subscribe(
      data => {
        this.estados = data;
      },
      error => {
        console.log(error);
      }
    );
  }

  pageordenSiguiente() {
    this.pageOrden ++;
    this.ordenAnterior = true;
    this.app.listarOrdenes(this.session.Rut, this.pageOrden*this.pagesize, this.pagesize).subscribe(
      data => {
        this.ordenes = data;

        if(this.ordenes.length<this.pagesize){
          this.ordenSiguiente = false;
        }
      },
      error => {
        console.log(error);
      }
    );
  }

  pageordenAnterior() {
    this.pageOrden --;
    this.ordenSiguiente = true;
    if(this.pageOrden==0){
      this.ordenAnterior = false;
    }

    this.app.listarOrdenes(this.session.Rut, this.pageOrden*this.pagesize, this.pagesize).subscribe(
      data => {
        this.ordenes = data;
      },
      error => {
        console.log(error);
      }
    );
  }

  seleccionarEstado(i){
    this.estadoActual.Nombre = this.estados[i].Nombre;
    this.estadoActual.Guid = this.estados[i].Guid;

    console.log(this.estadoActual);
  }

  submit(){
    console.log("Orden: ",this.ordenSelect.Guid);
    console.log("Estado: ",this.estadoActual.Guid);

    this.app.cambiarEstado(this.ordenSelect.Guid, this.estadoActual.Guid).subscribe(
      data => {
        if(data){
          this.ModificarEstadoMsg = 1;
          document.getElementById('Panel').style.display = 'none';
        }else{
          this.ModificarEstadoMsg = 2;
        }
      },
      error => {
        console.log(error);
        this.ModificarEstadoMsg = 2;
      }
    );
  }
}
