import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ControllerService } from 'src/app/controller.service';

@Component({
  selector: 'app-mp-categorias',
  templateUrl: './mp-categorias.component.html',
  styleUrls: ['./mp-categorias.component.css']
})
export class MpCategoriasComponent implements OnInit {

  pest: number = 1;
  page: number = 0;
  pagesize : number = 10;
  CatAgregarEstadoMsg: number = 0;
  CatModificarEstadoMsg: number = 0;

  siguiente : boolean = true;
  anterior : boolean = false;
  selected : boolean = false;

  categoria = {
    Guid : '',
    Rut : '',
    Nombre : '',
    NuevoNombre : ''
  }

  catList : any;
  session : any;

  constructor(private router: Router, private app:ControllerService) { 
    if(sessionStorage.getItem('session')!=null){
      this.session = JSON.parse(sessionStorage.getItem('session'));

      this.categoria.Rut = this.session.Rut;
    }else{
      this.router.navigateByUrl('/LogIn');
    }
  }

  ngOnInit() {
    this.setStyle(this.session.Tema);
  }

  agregarCat(){
    console.log(this.categoria);

    this.app.agregarCategoria(this.categoria).subscribe(
      data => {
        if(data){
          this.CatAgregarEstadoMsg = 2;

          this.categoria.Nombre = '';
          this.categoria.NuevoNombre = '';
        }else{
          this.CatAgregarEstadoMsg = 1;
        }
      },
      error => {
        this.CatAgregarEstadoMsg = 3;
      }
    );
  }

  actualizarCat(){
    console.log(this.categoria);

    this.app.updateCategoria(this.categoria).subscribe(
      data => {
        console.log(data);
        if(data){
          this.CatModificarEstadoMsg = 2;
        }else{
          this.CatModificarEstadoMsg = 1;
        }
      },
      error => {
        this.CatModificarEstadoMsg = 3;
      }
    );
  }

  cargarUpdate(i){
    this.selected = true;
    this.categoria.Guid = this.catList[i].Guid;
    this.categoria.Nombre = this.catList[i].Nombre;
    this.categoria.NuevoNombre = this.catList[i].Nombre;
  }

  pageSiguiente() {
    this.page ++;
    this.anterior = true;
    this.selected = false;
    this.app.listCategoria(this.session.Rut, this.page*this.pagesize, this.pagesize).subscribe(
      data => {
        this.catList = data;

        if(this.catList.length<10){
          this.siguiente = false;
        }
      },
      error => {
        this.CatModificarEstadoMsg = 3;
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

    this.app.listCategoria(this.session.Rut, this.page*this.pagesize, this.pagesize).subscribe(
      data => {
        this.catList = data;
      },
      error => {
        this.CatModificarEstadoMsg = 3;
      }
    );
  }

  changeP(cod){
    this.CatAgregarEstadoMsg = 0;
    this.CatModificarEstadoMsg = 0;
    this.categoria.Nombre = '';
    this.categoria.NuevoNombre = '';
    this.selected = false;
    if(cod=='p1'){
      this.pest = 1;
    }else if(cod=='p2'){
      this.app.listCategoria(this.session.Rut, this.page*this.pagesize, this.pagesize).subscribe(
        data => {
          this.catList = data;
          
          console.log(this.catList);

          if(this.catList.length<10){
            this.siguiente = false;
          }
        },
        error => {
          this.CatModificarEstadoMsg = 3;
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
