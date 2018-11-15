import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class ControllerService {

  options = {
    headers: {
      'Content-Type': 'application/json'
    }
  }

  host : string = 'localhost:51532';
  // host : string = '192.168.1.43';
  
  constructor(private http:HttpClient) { }

  LogIn(body:any){
    return this.http.post('http://'+this.host+'/api/Empresa/LogIn', body, this.options);
  }

  getAllRubros(){
    return this.http.get('http://'+this.host+'/api/Empresa/getRubros');
  }

  RegistrarEmpresa(body:any){
    return this.http.post('http://'+this.host+'/api/Empresa/altaEmpresa', body, this.options);
  }

  updateAdminEmpresa(body:any){
    return this.http.put('http://'+this.host+'/api/Empresa/updateAdminEmpresa', body, this.options);
  }

  updatePassAdminEmpresa(body:any){
    return this.http.put('http://'+this.host+'/api/Empresa/updatePassAdminEmpresa', body, this.options);
  }

  updateUbicacionEmpresa(body:any){
    return this.http.put('http://'+this.host+'/api/Empresa/updateUbicacionEmpresa', body, this.options);
  }

  updateEmpresa(body:any){
    return this.http.put('http://'+this.host+'/api/Empresa/updateEmpresa', body, this.options);
  }

  agregarCategoria(body:any){
    return this.http.post('http://'+this.host+'/api/Empresa/agregarCategoria', body, this.options);
  }

  updateCategoria(body:any){
    return this.http.put('http://'+this.host+'/api/Empresa/updateCategoria', body, this.options);
  }

  listCategoria(rut, skip, pagesize){
    return this.http.get('http://'+this.host+'/api/Empresa/ListarCategorias?rut='+rut+'&skip='+skip+'&take='+pagesize);
  }

  agregarEstado(body:any){
    return this.http.post('http://'+this.host+'/api/Empresa/AgregarEstado', body, this.options);
  }

  updateEstado(body:any){
    return this.http.put('http://'+this.host+'/api/Empresa/updateEstado', body, this.options);
  }

  listEstados(rut, skip, pagesize){
    return this.http.get('http://'+this.host+'/api/Empresa/ListarEstados?rut='+rut+'&skip='+skip+'&take='+pagesize);
  }

  agregarPaquete(body:any){
    return this.http.post('http://'+this.host+'/api/Empresa/agregarPaquete', body, this.options);
  }

  agregarProducto(body : any){
    return this.http.post('http://'+this.host+'/api/Empresa/agregarProducto', body, this.options);
  }

  listarProductos(){
    return this.http.get('http://'+this.host+'/api/Empresa/listarProductos');
  }

  actualizarZonasEntrega(body:any){
    return this.http.post('http://'+this.host+'/api/Empresa/actualizarZonasEntrega', body, this.options);
  }

  listarZonasEntrega(rut : string){
    return this.http.get('http://'+this.host+'/api/Empresa/listarZonasEntrega?rut='+rut);
  }
}
