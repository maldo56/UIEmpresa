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

  constructor(private router: Router, private renderer: Renderer2,){
    var value = sessionStorage.getItem("session");
    if(value!=null){
      this.EmpLog = value;
    }
  }

  ngOnInit() {

  }

  LogOut(){
    sessionStorage.removeItem('session');

    document.getElementById('btnCerrarSession').style.display = 'none';

    this.router.navigateByUrl('/LogIn');
  }
}
