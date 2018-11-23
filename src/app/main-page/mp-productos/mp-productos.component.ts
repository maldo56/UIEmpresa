import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ControllerService } from 'src/app/controller.service';

export class OpcionalAtributte{
  public key : string;
  public value : string;

  constructor(key : string, value :  string){
    this.key = key;
    this.value = value;
  }
}

@Component({
  selector: 'app-mp-productos',
  templateUrl: './mp-productos.component.html',
  styleUrls: ['./mp-productos.component.css']
})
export class MpProductosComponent implements OnInit {

  page : number = 0;
  pest : number = 1;
  AgregarMsg : number = 0;
  siguiente : boolean = true;
  anterior : boolean = false;
  selected : boolean = false;

  ImgActual : string = 'https://res.cloudinary.com/dnieertcs/image/upload/v1541794651/Empresa-Default.jpg';

  auxKey : '';
  auxValue : '';

  updateauxKey : '';
  updateauxValue : '';
  updateObjectId : '';

  producto = {
    Rut : '',
    Nombre : '',
    Precio : 0,
    Moneda : 1,
    Volumen : 0,
    Peso : 0,
    Descripcion : '',
    Categorias : new Array<OpcionalAtributte>(),
    Opcionales : new Array<OpcionalAtributte>(),
    Imagenes: new Array<string>()
  }

  auxAgregarCategorias : any;

  productosList : any;
  auxAttObligatorios : any;
  auxAttOpcionales : any;

  session : any;

  constructor(private router: Router, private app:ControllerService) { 
    if(sessionStorage.getItem('session')!=null){
      this.session = JSON.parse(sessionStorage.getItem('session'));
      
      this.producto.Rut = this.session.Rut;

      this.app.listCategoria(this.session.Rut,this.page*3,3).subscribe(
        data => {
          console.log(data);
          this.auxAgregarCategorias = data;

          if(this.auxAgregarCategorias.length<3){
            this.siguiente = false;
          }
        },
        error => {
          console.log(error);
        }
      );
    }else{
      this.router.navigateByUrl('/LogIn');
    }
  }

  ngOnInit() {
    this.setStyle(this.session.Tema);
  }

  agregarProducto() {
    console.log(this.producto);

    if(this.producto.Nombre==''){
      this.AgregarMsg = 4;
      setTimeout (() => {
        this.AgregarMsg = 0;
      }, 5000);
    }else if(this.producto.Precio<=0 || this.producto.Volumen<=0 || this.producto.Peso<=0){
      this.AgregarMsg = 5;
      setTimeout (() => {
        this.AgregarMsg = 0;
      }, 5000);
    }else if(this.producto.Categorias.length==0){
      this.AgregarMsg = 6;
      setTimeout (() => {
        this.AgregarMsg = 0;
      }, 5000);
    }else{
      this.producto.Rut = this.session.Rut;

      this.app.agregarProducto(this.producto).subscribe(
        data => {
          if(data){
            this.AgregarMsg = 2;
            
            this.ObjProductoInicializar();

            setTimeout (() => {
              this.AgregarMsg = 0;
            }, 5000);
          }else{
            this.AgregarMsg = 1;
            setTimeout (() => {
              this.AgregarMsg = 0;
            }, 5000);
          }
        },
        error => {
          this.AgregarMsg = 3;
          setTimeout (() => {
            this.AgregarMsg = 0;
          }, 5000);
        }
      );
    }
  }

  addOpcionalAtributteRow(){

    this.producto.Opcionales.push(new OpcionalAtributte(this.auxKey, this.auxValue));

    this.auxKey = '';
    this.auxValue = '';
  }

  agregarImgBuffer(){
    this.producto.Imagenes.push(this.ImgActual);
    this.ImgActual = 'https://res.cloudinary.com/dnieertcs/image/upload/v1541794651/Empresa-Default.jpg';
  }

  pageSiguiente() {
    this.page ++;
    this.anterior = true;
    this.selected = false;
    this.app.listCategoria(this.session.Rut, this.page*3, 3).subscribe(
      data => {
        this.auxAgregarCategorias = data;

        if(this.auxAgregarCategorias.length<4){
          this.siguiente = false;
        }
      },
      error => {
        this.AgregarMsg = 3;
        setTimeout (() => {
          this.AgregarMsg = 0;
        }, 5000);
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

    this.app.listCategoria(this.session.Rut, this.page*3, 3).subscribe(
      data => {
        this.auxAgregarCategorias = data;
      },
      error => {
        this.AgregarMsg = 3;
        setTimeout (() => {
          this.AgregarMsg = 0;
        }, 5000);
      }
    );
  }

  addCategoriaAProducto(index){
    var aux = this.auxAgregarCategorias[index];

    console.log(index);
    console.log(this.auxAgregarCategorias);
    console.log(aux);

    this.producto.Categorias.push(new OpcionalAtributte(index.Guid, index.Nombre));

    console.log(this.producto.Categorias);
  }

  selectImg(event){
    const reader = new FileReader();
    if(event.target.files && event.target.files.length > 0){
      const file = event.target.files[0];
      reader.readAsDataURL(file);
      reader.onload = () => {
        let imagen = reader.result;
        this.ImgActual = imagen.toString();
      }
    }
  }

  changeP(cod){
    this.AgregarMsg = 0;
    this.ObjProductoInicializar();
    if(cod=='p1'){
      this.app.listCategoria(this.session.Rut,this.page*3,3).subscribe(
        data => {
          console.log(data);
          this.auxAgregarCategorias = data;
        },
        error => {
          console.log(error);
        }
      );

      this.pest = 1;
    }else if(cod=='p2'){
      this.app.listarProductos(this.session.Rut).subscribe(
        data => {
          console.log(data);
          this.productosList = data;
        },
        error => {
          console.log(error);
        }
      );

      this.pest = 2;
    }
  }

  ObjProductoInicializar(){
    this.producto.Rut = '';
    this.producto.Nombre = '';
    this.producto.Precio = 0;
    this.producto.Moneda = 1;
    this.producto.Volumen = 0;
    this.producto.Peso = 0;
    this.producto.Descripcion = '';
    this.producto.Categorias = new Array<OpcionalAtributte>();
    this.producto.Opcionales = new Array<OpcionalAtributte>();
    this.producto.Imagenes = new Array<string>();
  }

  cargarUpdate(i){
    this.auxAttOpcionales =  new Array<OpcionalAtributte>();
    this.auxAttObligatorios = new Array<OpcionalAtributte>();

    var keys = Object.keys(this.productosList[i].PropProducto);
    this.updateObjectId = this.productosList[i].ObjectId;

    console.log(this.updateObjectId);

    for(let x=0; x<5; x++){
      this.auxAttObligatorios.push(new OpcionalAtributte(keys[x], this.productosList[i].PropProducto[keys[x]]));
    }

    for(let x=5; x<keys.length; x++){
      this.auxAttOpcionales.push(new OpcionalAtributte(keys[x], this.productosList[i].PropProducto[keys[x]]));
    }

    this.selected = true;
  }

  updateAddAtributte(){
    if(this.updateauxKey!='' && this.updateauxValue!=''){
      this.auxAttOpcionales.push(new OpcionalAtributte(this.updateauxKey, this.updateauxValue));

      this.updateauxKey = '';
      this.updateauxValue = '';
    }
  }

  actualizarProducto() {
    if(this.updateauxKey!='' && this.updateauxValue!='') {
      this.auxAttOpcionales.push(new OpcionalAtributte(this.updateauxKey, this.updateauxValue));

      this.updateauxKey='';
      this.updateauxValue='';
    }
    console.log('UPDATE: ------------------');

    var productoUp = { 
      ObjectId : this.updateObjectId,
      Rut : this.session.Rut,
      Nombre : this.auxAttObligatorios[0].value,
      Precio : this.auxAttObligatorios[1].value,
      Moneda : 0,
      Volumen : this.auxAttObligatorios[2].value,
      Peso : this.auxAttObligatorios[3].value,
      Descripcion : this.auxAttObligatorios[4].value,
      Categorias : new Array<OpcionalAtributte>(),
      Opcionales : this.auxAttOpcionales,
      Imagenes: new Array<string>()
    }

    console.log(productoUp);

    this.app.agregarProducto(productoUp).subscribe(
      data => {
        console.log(data);
      },
      error => {
        console.log(error);
      }
    );
  }

  setStyle(style){
    document.getElementById('titulo').setAttribute('class', style+'Titulo');
    document.getElementById('pestañas').setAttribute('class', style+'Pestañas');
    document.getElementById('ContenedorForm').setAttribute('class', style+'Form');
  }
}