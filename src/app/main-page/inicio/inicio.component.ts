import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ControllerService } from 'src/app/controller.service';

@Component({
  selector: 'app-inicio',
  templateUrl: './inicio.component.html',
  styleUrls: ['./inicio.component.css']
})
export class InicioComponent implements OnInit {

  usuario : '';

  session : any;
  reportes : any;

  constructor(private router: Router, private app:ControllerService) { 
    if(sessionStorage.getItem('session')!=null){
      this.session = JSON.parse(sessionStorage.getItem('session'));

      if(sessionStorage.getItem('Inicio')=='1'){
        this.app.inicio(this.session.Rut, this.session.Usuario).subscribe(
          data => {
            console.log(data);
            this.reportes = data;
          },
          error => {
            console.log(error);
          }
        );
      }else{
        sessionStorage.setItem('Inicio', '1');
        this.reportes = this.session.reportes;
      }
        
      if(this.session.Usuario==null){
        this.usuario = this.session.User;
      }else{
        this.usuario = this.session.Usuario;
      }

    }else{
      this.router.navigateByUrl('/LogIn');
    }


  }

  ngOnInit() {
    
  }
}
