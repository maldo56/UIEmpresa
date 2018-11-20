import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { LogInComponent } from './log-in/log-in.component';
import { MpEditarPerfilComponent } from './main-page/mp-editar-perfil/mp-editar-perfil.component';
import { RegisterComponent } from './register/register.component';
import { MainPageComponent } from './main-page/main-page.component';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';

import { RouterModule, Routes } from '@angular/router';
import { FileSelectDirective } from 'ng2-file-upload';

import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { AgmCoreModule, GoogleMapsAPIWrapper } from '@agm/core';
import { GooglePlaceModule } from "ngx-google-places-autocomplete";
import { MpCategoriasComponent } from './main-page/mp-categorias/mp-categorias.component';
import { ControllerService } from './controller.service';
import { MpEstadosComponent } from './main-page/mp-estados/mp-estados.component';
import { MpZonaEntregaComponent } from './main-page/mp-zona-entrega/mp-zona-entrega.component';
import { MpPaquetesComponent } from './main-page/mp-paquetes/mp-paquetes.component';
import { MpProductosComponent } from './main-page/mp-productos/mp-productos.component';
import { MpOrdenesComponent } from './main-page/mp-ordenes/mp-ordenes.component';

const appRoutes: Routes = [
  { path: '', redirectTo: '/LogIn', pathMatch: 'full' },
  { path: 'LogIn', component: LogInComponent },
  { path: 'Register', component: RegisterComponent },
  { path: 'mainPage', component: MainPageComponent, 
    children: [
      { path: '', redirectTo: '', pathMatch: 'full' },
      { path: 'Ordenes', component: MpOrdenesComponent},
      { path: 'EditarPerfil', component: MpEditarPerfilComponent },
      { path: 'Categorias', component: MpCategoriasComponent},
      { path: 'Estados', component: MpEstadosComponent},
      { path: 'Paquetes', component: MpPaquetesComponent },
      { path: 'Productos', component: MpProductosComponent },
      { path: 'ZonasEntrega', component: MpZonaEntregaComponent }
    ] 
  }
];

@NgModule({
  declarations: [
    AppComponent,
    LogInComponent,
    RegisterComponent,
    FileSelectDirective,
    MainPageComponent,
    MpEditarPerfilComponent,
    MpCategoriasComponent,
    MpEstadosComponent,
    MpZonaEntregaComponent,
    MpPaquetesComponent,
    MpProductosComponent,
    MpOrdenesComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpClientModule,
    ReactiveFormsModule,
    RouterModule.forRoot(appRoutes),
    AgmCoreModule.forRoot({
      apiKey: 'AIzaSyBVDtECwHSMjwOqjX9NG9x0sLN2mKe0Pak',//'AIzaSyBlvoOmIRaXO_mgZvhdJigdG0lXm6STVfo',
      libraries: ["places"]
    }),
    GooglePlaceModule,
    NgbModule.forRoot()
  ],
  providers: [
    GoogleMapsAPIWrapper,
    ControllerService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
