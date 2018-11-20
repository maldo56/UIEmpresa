import { Component, OnInit, ViewChild, ElementRef, NgZone, HostListener } from '@angular/core';
import { Router } from '@angular/router';
import { ControllerService } from 'src/app/controller.service';

declare const google: any;
let zonas = [];

let zonasAux;

export class Punto{
  public Lat : string;
  public Lng : string;

  constructor(Lat : string, Lng : string){
    this.Lat = Lat;
    this.Lng = Lng;
  }
}

export class Zona{
  public puntos : Array<Punto>;

  constructor(){
    this.puntos = new Array<Punto>();
  }
}

@Component({
  selector: 'app-mp-zona-entrega',
  templateUrl: './mp-zona-entrega.component.html',
  styleUrls: ['./mp-zona-entrega.component.css']
})
export class MpZonaEntregaComponent implements OnInit {
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

  constructor(private router: Router, private app:ControllerService) { 
    if(sessionStorage.getItem('session')!=null){
      this.session = JSON.parse(sessionStorage.getItem('session'));

      this.zonasEntrega.Rut = this.session.Rut;

      this.ubicacion.Rut = this.session.Rut;
      this.ubicacion.lat = parseFloat(this.session.Latitud);
      this.ubicacion.lng = parseFloat(this.session.Longitud);
      this.ubicacion.Direccion = this.session.Direccion;
    }
  }
  
  ngOnInit() {
    this.setStyle(this.session.Tema);
  }

  ngAfterViewInit(): void {
    this.map = new google.maps.Map(document.getElementById('map'), {
      center: {lat: this.ubicacion.lat, lng: this.ubicacion.lng},
      zoom: 13,
      gestureHandling: 'greedy'
    });

    console.log(google);

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
      drawingMode: null,
      drawingControl: true,
      drawingControlOptions: {
        position: google.maps.ControlPosition.TOP_CENTER,
        drawingModes: ['polygon']
      },
      polygonOptions: {
        strokeWeight: 0,
        fillOpacity: 0.45,
        clickable: true,
        editable: false,
      }
    });
    drawingManager.setMap(this.map);

    google.maps.event.addListener(drawingManager, 'polygoncomplete', function(polygon) {
      console.log(polygon);

      let punto;

      let geometry = 'POLYGON((';
      punto = polygon.getPath().getAt(0);
      geometry = geometry+punto.lat()+' '+punto.lng();

      for(let x=1; x<polygon.getPath().getArray().length; x++){
        punto = polygon.getPath().getAt(x);
        geometry = geometry+', '+punto.lat()+' '+punto.lng();
      }

      punto = polygon.getPath().getAt(0);
      geometry = geometry+', '+punto.lat()+' '+punto.lng();

      geometry = geometry+'))';

      zonas.push(geometry);
    });

    this.obtenerZonas();
  }

  obtenerZonas(){
    this.app.listarZonasEntrega(this.session.Rut).subscribe(
      data => {

        var zonasEntrega = [];
        var total = [];
        var polygon;
        var allPolygons = [];

        zonasAux = data;

        for(let x=0; x<zonasAux.length; x++){
          zonasEntrega = zonasAux[x].puntos;

          for(let y=0; y<zonasEntrega.length; y++){
            total.push({ lat: +zonasEntrega[y].lat, lng: +zonasEntrega[y].lng});
          }

          allPolygons.push(polygon = new google.maps.Polygon({
            path: total
          }));
          // polygon.setMap(this.map);

          polygon = null;
          total = [];
        }

        for(let x=0; x<allPolygons.length; x++){
          allPolygons[x].setMap(this.map);
        }

      },
      error => {
        this.AgregarMsg = 3;
      }
    );
  }

  aceptarCambiosZona(){
    this.zonasEntrega.zonas = zonas;
    console.log(this.zonasEntrega);

    this.app.actualizarZonasEntrega(this.zonasEntrega).subscribe(
      data => {
        console.log(data);
        if(data){
          this.AgregarMsg = 2;
        }else{
          this.AgregarMsg = 1;
        }
      },
      error => {
        this.AgregarMsg = 3;
        console.log(error);
      }
    );
  }

  setStyle(style){
    document.getElementById('titulo').setAttribute('class', style+'Titulo');
    document.getElementById('pestañas').setAttribute('class', style+'Pestañas');
    document.getElementById('DivBtn').setAttribute('class', style+'Form');
  }
}
