import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ControllerService } from 'src/app/controller.service';

@Component({
  selector: 'app-mp-paquetes',
  templateUrl: './mp-paquetes.component.html',
  styleUrls: ['./mp-paquetes.component.css']
})
export class MpPaquetesComponent implements OnInit {

  PaqueteAgregarMsg : number = 0;

  paquete = {
    Rut : '',
    Tamanio : 0,
    Peso: 0
  }

  session : any;

  constructor(private router: Router, private app:ControllerService) { 
    if(sessionStorage.getItem('session')!=null){
      this.session = JSON.parse(sessionStorage.getItem('session'));

      this.paquete.Rut = this.session.Rut;
    }else{
      this.router.navigateByUrl('/LogIn');
    }
  }

  ngOnInit() {
    this.setStyle(this.session.Tema);
  }

  agregarPaquete(){
    console.log(this.paquete);
    
    this.app.agregarPaquete(this.paquete).subscribe(
      data => {
        if(data){
          this.PaqueteAgregarMsg = 2;

          this.paquete.Tamanio = 0;
        }else{
          this.PaqueteAgregarMsg = 1;
        }
      },
      error => {
        this.PaqueteAgregarMsg = 3;
      }
    );
  }

  setStyle(style){
    document.getElementById('titulo').setAttribute('class', style+'Titulo');
    document.getElementById('pestañas').setAttribute('class', style+'Pestañas');
    document.getElementById('PaqueteAgregar').setAttribute('class', style+'Form');
  }
}
