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
    
  }

  agregarPaquete(){
    console.log(this.paquete);

    if(this.paquete.Tamanio<=0 || this.paquete.Peso<=0){
      this.PaqueteAgregarMsg = 4;
      setTimeout (() => {
        this.PaqueteAgregarMsg = 0;
      }, 5000);
    }else{
      this.app.agregarPaquete(this.paquete).subscribe(
        data => {
          if(data){
            this.PaqueteAgregarMsg = 2;
            setTimeout (() => {
              this.PaqueteAgregarMsg = 0;
            }, 5000);
  
            this.paquete.Tamanio = 0;
            this.paquete.Peso = 0;
          }else{
            this.PaqueteAgregarMsg = 1;
            setTimeout (() => {
              this.PaqueteAgregarMsg = 0;
            }, 5000);
          }
        },
        error => {
          this.PaqueteAgregarMsg = 3;
          setTimeout (() => {
            this.PaqueteAgregarMsg = 0;
          }, 5000);
        }
      );
    }
  }
}
