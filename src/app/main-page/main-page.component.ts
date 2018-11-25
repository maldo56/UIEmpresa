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
    this.setStyle(this.session.Tema);
  }

  redirect(child){
    this.router.navigateByUrl('/mainPage/'+child);
  }

  setStyle(style){
    document.getElementsByTagName('body')[0].setAttribute('class', style+'body');
    document.getElementById('barracontainer').setAttribute('class', style+'SupBar');
    document.getElementById('divImg').setAttribute('class', style+'Img');
    document.getElementById('Menu').setAttribute('class', style+'Menu');
    document.getElementById('contenedor').setAttribute('class', style+'contenedor');
  }
}
