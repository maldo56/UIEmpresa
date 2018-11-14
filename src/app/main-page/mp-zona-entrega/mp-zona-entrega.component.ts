import { Component, OnInit, ViewChild, ElementRef, NgZone, HostListener } from '@angular/core';
import { Router } from '@angular/router';
import { MapsAPILoader, AgmMap } from '@agm/core';
import { ControllerService } from 'src/app/controller.service';

declare const google: any;

@Component({
  selector: 'app-mp-zona-entrega',
  templateUrl: './mp-zona-entrega.component.html',
  styleUrls: ['./mp-zona-entrega.component.css']
})
export class MpZonaEntregaComponent implements OnInit {

  pest: number = 1;

  auxLat : number = 0;
  auxLng : number = 0;
  auxRadio : number = 300;

  AgregarMsg : number = 0;

  ubicacion = {
    Rut : '',
    lat : 0,
    lng : 0,
    Direccion : ''
  }

  zonasEntrega = {
    Rut : '',
    zonas : Array<any>()
  }

  session : any;
  
  map : any;

  constructor(private router: Router, private mapsAPILoader: MapsAPILoader, private ngZone: NgZone, private app:ControllerService) { 
    if(sessionStorage.getItem('session')!=null){
      this.session = JSON.parse(sessionStorage.getItem('session'));

      this.zonasEntrega.Rut = this.session.Rut;

      this.ubicacion.Rut = this.session.Rut;
      this.ubicacion.lat = parseFloat(this.session.Latitud);
      this.ubicacion.lng = parseFloat(this.session.Longitud);
      this.ubicacion.Direccion = this.session.Direccion;

      this.app.listarZonasEntrega(this.session.Rut).subscribe(
        data => {
          var aux : any;
          aux = data;
          var cir;
          
          // for(var x=0; x<aux.length; x++){
          //   cir = new Circulo(parseFloat(aux[x].Lat), parseFloat(aux[x].Lng), parseFloat(aux[x].Radio));
          //   this.zonas.push(cir);
          //   console.log(this.zonas.length);
          // }
        },
        error => {
          this.AgregarMsg = 3;
        }
      );
    }else{
      this.router.navigateByUrl('/LogIn');
    }
  }

  ngOnInit() {
    
  }

  ngAfterViewInit(): void {
    this.map = new google.maps.Map(document.getElementById('map'), {
      center: {lat: this.ubicacion.lat, lng: this.ubicacion.lng},
      zoom: 13
    });

    var ubicLatLng = {lat: this.ubicacion.lat, lng: this.ubicacion.lng};

    var marker = new google.maps.Marker({
      position: ubicLatLng,
      map: this.map,
      title: this.session.Rut
    });

    var contentString = '<div>'+this.ubicacion.Direccion+'</div>';

    var infowindow = new google.maps.InfoWindow({
      content: contentString
    });

    marker.addListener('click', function(){
      infowindow.open(this.map, marker);
    });

    var drawingManager = new google.maps.drawing.DrawingManager({
      drawingMode: null,//google.maps.drawing.OverlayType.POLYGON,
      drawingControl: true,
      drawingControlOptions: {
        position: google.maps.ControlPosition.TOP_CENTER,
        drawingModes: ['polygon']
      },
      polygonOptions: {
        strokeWeight: 0,
        fillOpacity: 0.45,
        clickable: false,
        editable: false,
      }
    });
    drawingManager.setMap(this.map);

    google.maps.event.addListener(drawingManager, 'polygoncomplete', function(polygon) {
      console.log(polygon.getPath().getArray());

      this.zonasEntrega.zona.push(polygon.getPath().getArray());
    })
  }

  aceptarCambiosZona(){
    console.log(this.zonasEntrega);

    this.app.actualizarZonasEntrega(this.zonasEntrega).subscribe(
      data => {
        if(data){
          this.AgregarMsg = 2;
        }else{
          this.AgregarMsg = 1;
        }
      },
      error => {
        this.AgregarMsg = 3;
      }
    );
  }
}
