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

      console.log(this.session);
    }else{
      this.router.navigateByUrl('/LogIn');
    }
  }

  ngOnInit() {
    this.renderer.setAttribute(this.Img.nativeElement, 'src', this.session.Logo);
    this.session = JSON.parse(sessionStorage.getItem('session'));
  }

  redirect(child){
    this.router.navigateByUrl('/mainPage/'+child);
  }
}
