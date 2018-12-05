import { Component, OnInit, ElementRef, ViewChild, Renderer2 } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-main-page',
  templateUrl: './main-page.component.html',
  styleUrls: ['./main-page.component.css']
})
export class MainPageComponent implements OnInit {

  session : any;

  constructor(private router: Router) {
    if(sessionStorage.getItem('session')!=null){
      this.session = JSON.parse(sessionStorage.getItem('session'));

      console.log("session: ", this.session);

      if(sessionStorage.getItem('control')==null){
        sessionStorage.setItem('control', '1');
        this.router.navigateByUrl('/mainPage/Inicio');
      }
    }else{
      this.router.navigateByUrl('/LogIn');
    }
  }

  ngOnInit() {
    document.getElementById('mainPageImg').setAttribute('src', this.session.Logo);
    this.session = JSON.parse(sessionStorage.getItem('session'));
    this.setStyle();
  }

  redirect(child){
    this.router.navigateByUrl('/mainPage/'+child);
  }

  LogOut(){
    sessionStorage.removeItem('session');
    sessionStorage.removeItem('control');
    sessionStorage.removeItem('Inicio');

    this.router.navigateByUrl('/LogIn');
  }

  setStyle(){
    if(this.session.Tema=='default'){
      document.getElementsByTagName('body')[0].setAttribute('class', 'defaultbody');
      document.getElementById('barracontainer').setAttribute('class', 'defaultSupBar');
      document.getElementById('divImg').setAttribute('class', 'defaultImg');
      document.getElementById('Menu').setAttribute('class', 'defaultMenu');
      document.getElementById('contenedor').setAttribute('class', 'defaultcontenedor');
    }else{
      document.getElementsByTagName('body')[0].style.fontFamily = this.session.style.letra;
      document.getElementsByTagName('body')[0].style.backgroundImage = 'url('+this.session.style.fondo+')';
      document.getElementById('contenedor').style.backgroundColor = this.session.style.color1;
      document.getElementById('contNav').style.backgroundColor = this.session.style.color2;
      document.getElementById('pestañas').style.backgroundColor = this.session.style.color2;
      document.getElementById('barracontainer').style.backgroundColor = this.session.style.color3;
      document.getElementsByTagName('body')[0].style.color = this.session.style.colorTexto1;

      var div = document.getElementById('pestañas');

      var a = div.getElementsByTagName('a');

      for(let x=0; x<a.length; x++){
        a[x].style.color = this.session.style.colorTexto2;
      }

      var div2 = document.getElementById('Menu');

      var a2 = div2.getElementsByTagName('a');

      for(let x=0; x<a2.length; x++){
        a2[x].style.color = this.session.style.colorTexto2;
      }

    }
    
  }
}
