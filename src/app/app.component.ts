import { Component, ViewChild, ElementRef, Renderer2 } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'UIEmpresa';

  EmpLog: any;

  @ViewChild("InfoCont") InfoCont: ElementRef;
  @ViewChild("Img") Img: ElementRef;
  @ViewChild("BtnLogOut") BtnLogOut: ElementRef;

  constructor(private router: Router, private renderer: Renderer2,){
    var value = sessionStorage.getItem("session");
    if(value!=null){
      this.EmpLog = value;
    }
  }

  ngOnInit() {
    if(sessionStorage.getItem('session')!=null){
      this.renderer.setStyle(this.BtnLogOut.nativeElement, 'display', 'block');
    }else{
      this.renderer.setStyle(this.BtnLogOut.nativeElement, 'display', 'none');
    }
  }

  LogOut(){
    sessionStorage.removeItem('session');

    // this.renderer.setStyle(this.InfoCont.nativeElement, 'display', 'none');
    // this.renderer.setAttribute(this.Img.nativeElement, 'src', '');

    this.router.navigateByUrl('/LogIn');
  }
}
