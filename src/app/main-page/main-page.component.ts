import { Component, OnInit, ElementRef, ViewChild, Renderer2 } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-main-page',
  templateUrl: './main-page.component.html',
  styleUrls: ['./main-page.component.css']
})
export class MainPageComponent implements OnInit {

  session : any;

  @ViewChild("Img") Img: ElementRef;

  constructor(private router: Router, private renderer: Renderer2) {
    if(sessionStorage.getItem('session')!=null){
      this.session = JSON.parse(sessionStorage.getItem('session'));

    }else{
      this.router.navigateByUrl('/LogIn');
    }
  }

  ngOnInit() {
    this.renderer.setAttribute(this.Img.nativeElement, 'src', this.session.Logo);
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
