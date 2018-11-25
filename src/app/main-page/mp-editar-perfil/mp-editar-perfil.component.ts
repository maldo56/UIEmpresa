import { Component, OnInit, ElementRef, ViewChild, Renderer2, NgZone, EventEmitter } from '@angular/core';
import { Router } from '@angular/router';
import { ControllerService } from 'src/app/controller.service';
import { AgmMap, MapsAPILoader } from '@agm/core';

declare var google;
let autocomplete = null;

@Component({
  selector: 'app-mp-editar-perfil',
  templateUrl: './mp-editar-perfil.component.html',
  styleUrls: ['./mp-editar-perfil.component.css']
})
export class MpEditarPerfilComponent implements OnInit {
  
  general = {
    Rut : '',
    Nombre : '',
    URLocator : '',
    NombreRubro : '',
    Direccion : '',
    Descripcion : '',
    UserName : '',
    User : '',
    Pass : '',
    Logo: '',
    Tema: ''
  }

  usuario = {
    Rut : '',
    Email : '',
    NombreAdmin : '',
    Usuario : '',
    Clave : ''
  }

  ubicacion = {
    Rut : '',
    lat : 0,
    lng : 0,
    Direccion : ''
  }

  usuarioAuxUsuario : '';
  usuarioAuxPass : '';
  usuarioAuxNewPass : '';
  usuarioVerifPass : '';
  usuarioSubDiv : boolean = true;

  pest: number = 1;
  session: any;
  rubros: any;
  map : any;

  UsuarioErrorMsg: number = 0;
  msgUpPerfilGeneral : number = 0;

  UsuarioErrorPassIguales : Boolean = false;
  UsuarioErrorPassIgualesActual : Boolean = false;

  UbicacionError : number = 0;

  @ViewChild("ImgTag") ImgTag: ElementRef;

  constructor(private router: Router, private renderer: Renderer2, private app:ControllerService) {
      
    if(sessionStorage.getItem('session')!=null){
      var aux = sessionStorage.getItem('session');
      this.session = JSON.parse(aux);

      this.general.Descripcion = this.session.Descripcion;
      this.general.Direccion = this.session.Direccion;
      this.general.Nombre = this.session.Nombre;
      this.general.NombreRubro = this.session.NombreRubro;
      this.general.Rut = this.session.Rut;
      this.general.URLocator = this.session.URLocator;
      this.general.Tema = this.session.Tema;

      this.usuario.NombreAdmin = this.session.NombreAdmin;
      this.usuario.Email = this.session.Email;
      this.usuario.Usuario = this.session.Usuario;

      this.ubicacion.Rut = this.session.Rut;
      this.ubicacion.lat = parseFloat(this.session.Latitud);
      this.ubicacion.lng = parseFloat(this.session.Longitud);
      this.ubicacion.Direccion = this.session.Direccion;

      this.app.getAllRubros().subscribe(
        (res: Response) => {

          this.rubros = res;
        }
      );
    }else{
      this.router.navigateByUrl('/LogIn');
    }
  }

  ngOnInit() {
    this.setStyle(this.session.Tema);
  }

  ngAfterViewInit(): void {
    this.map = new google.maps.Map(document.getElementById('Mapa'), {
      center: {lat: this.ubicacion.lat, lng: this.ubicacion.lng},
      zoom: 13,
      gestureHandling: 'greedy'
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

    var input = document.getElementById('inpDir');
    var options = {
      types: ['address'],
      componentRestrictions: {country: 'uy'}
    };

    autocomplete = new google.maps.places.Autocomplete(input, options);

    autocomplete.addListener('place_changed', function() {
      var place = autocomplete.getPlace();
      this.ubicacion.Direccion = place.formatted_address;
      this.ubicacion.lat = place.geometry.location.lat().toString();
      this.ubicacion.lng = place.geometry.location.lng().toString();

      this.map.setCenter({lat: place.geometry.location.lat(), lng: place.geometry.location.lng()});
    });
  }

  acceptUpdateUbicacion(){
    this.UbicacionError = 0;

    console.log('Aceptar update');
    console.log(this.ubicacion);

    this.app.updateUbicacionEmpresa(this.ubicacion).subscribe(
      data => {
        console.log(data);

        if(data==true){
          this.UbicacionError = 3;
          setTimeout (() => {
            this.UbicacionError = 0;
          }, 5000);

          this.session.Latitud = this.ubicacion.lat;
          this.session.Longitud = this.ubicacion.lng;
          this.session.Direccion = this.ubicacion.Direccion;

          sessionStorage.setItem('session', JSON.stringify(this.session));          
        }else{
          this.UbicacionError = 2;
          setTimeout (() => {
            this.UbicacionError = 0;
          }, 5000);
        }
      },
      error => {
        this.UbicacionError = 1;
        setTimeout (() => {
          this.UbicacionError = 0;
        }, 5000);
      }
    );
  }
 
  acceptUpdateUsuario(){
    console.log('Update Admin');
    if(this.usuarioSubDiv){
      if(this.usuario.NombreAdmin==''){
        this.UsuarioErrorMsg = 4;
        setTimeout (() => {
          this.UsuarioErrorMsg = 0;
        }, 5000);
      }else{
        this.usuario.Rut = this.session.Rut;
      
        this.app.updateAdminEmpresa(this.usuario).subscribe(
          data => {
            console.log(data);
            if(data){
              this.session.NombreAdmin = this.usuario.NombreAdmin;
              this.session.Email = this.usuario.Email;
              sessionStorage.setItem('session', JSON.stringify(this.session));
              this.router.navigateByUrl('/mainPage/Inicio');
            }else{
              this.UsuarioErrorMsg = 3;
              setTimeout (() => {
                this.UsuarioErrorMsg = 0;
              }, 5000);
            }
          },
          error => {
            this.UsuarioErrorMsg = 3;
            setTimeout (() => {
              this.UsuarioErrorMsg = 0;
            }, 5000);
          }
        );
      }
    }else{
      if(this.UsuarioPassVerificacion()){

        this.usuario.Rut = this.session.Rut;
        this.usuario.Usuario = this.usuarioAuxUsuario;
        this.usuario.Clave = this.SHA256(this.usuarioAuxPass);
        this.usuario.NombreAdmin = this.SHA256(this.usuarioAuxNewPass);

        const options = {
          headers: {
            'Content-Type': 'application/json'
          }
        }
  
        this.app.updatePassAdminEmpresa(this.usuario).subscribe(
        data => {
          console.log(data);
          if(data){
            this.router.navigateByUrl('/mainPage');
          }else{
            this.UsuarioErrorMsg = 3;
            setTimeout (() => {
              this.UsuarioErrorMsg = 0;
            }, 5000);
          }
          this.usuario.NombreAdmin = this.session.NombreAdmin;
        },
        error => {
          this.UsuarioErrorMsg = 1;
          setTimeout (() => {
            this.UsuarioErrorMsg = 0;
          }, 5000);
        }
      );
    }

      console.log(this.UsuarioErrorPassIguales);
      }
    
  }

  acceptUpdateGeneral(){

    if(this.general.URLocator==''){
      this.msgUpPerfilGeneral = 1;
      setTimeout (() => {
        this.msgUpPerfilGeneral = 0;
      }, 5000);
    }else{

      if(this.session.NombreRubro!=this.general.NombreRubro || this.session.URLocator!=this.general.URLocator || this.session.Descripcion!=this.general.Descripcion || this.session.Logo!=this.general.Logo){
        console.log('Distintos');

        const options = {
          headers: {
            'Content-Type': 'application/json'
          }
        }

        console.log(this.general);

        this.app.updateEmpresa(this.general).subscribe(
          data => {
            console.log(data);
            if(data!='false'){

              this.general.Logo = this.session.Logo;
              if(data.toString()!=""){
                console.log("entraaaaaa");
                this.general.Logo = data.toString();
                document.getElementById('mainPageImg').setAttribute('src', this.session.Logo);
                this.renderer.setAttribute(this.ImgTag.nativeElement, 'src', this.session.Logo);
              }

              this.session = this.general;
              console.log('------------new session-----------');
              console.log(this.session);
              sessionStorage.setItem('session', JSON.stringify(this.session));
              
              document.getElementById('mainPageImg').setAttribute('src', this.session.Logo);

              this.router.navigateByUrl('/mainPage/Inicio');
            }else{
              this.msgUpPerfilGeneral = 2;
              setTimeout (() => {
                this.msgUpPerfilGeneral = 0;
              }, 5000);
            }
          },
          error => {
            this.msgUpPerfilGeneral = 3;
            setTimeout (() => {
              this.msgUpPerfilGeneral = 0;
            }, 5000);
          }
        );

      }else{
        console.log('Iguales');
      }
    }
  }

  changeP(cod){
    this.UsuarioErrorMsg = 0;
    if(cod=='p1'){
      this.pest = 1;
    }else if(cod=='p2'){
      this.pest = 2;
      this.UbicacionError = 0;
    }else if(cod=='p3'){
      this.usuarioSubDiv = true;
      this.pest = 3;
    }
  }

  changeusuarioSubDiv(){
    this.usuarioSubDiv = !this.usuarioSubDiv;

    this.UsuarioErrorMsg = 0;
  }

  selectImg(event){
    const reader = new FileReader();
    if(event.target.files && event.target.files.length > 0){
      const file = event.target.files[0];
      reader.readAsDataURL(file);
      reader.onload = () => {
        let imagen = reader.result;
        this.general.Logo = imagen.toString();

        this.renderer.setAttribute(this.ImgTag.nativeElement, 'src', imagen.toString());
      }
    }
  }

  UsuarioPassVerificacion(){
    console.log('Verificando datos...');
    var retorno = true;
    if(this.usuarioAuxNewPass != this.usuarioVerifPass){
      this.UsuarioErrorPassIguales = true;
      retorno = false;
    }else{
      this.UsuarioErrorPassIguales = false;
    }
    if(this.usuarioAuxNewPass == this.usuarioAuxPass){
      this.UsuarioErrorPassIgualesActual = true;
      retorno = false;
    }else{
      this.UsuarioErrorPassIgualesActual = false;
    }
    if(this.usuarioAuxUsuario==''){
      this.UsuarioErrorMsg = 2;
      return false;
    }

    return retorno;
  }

  SHA256(s){
    var chrsz  = 8;
    var hexcase = 0;
    function safe_add (x, y) {
    var lsw = (x & 0xFFFF) + (y & 0xFFFF);
    var msw = (x >> 16) + (y >> 16) + (lsw >> 16);
    return (msw << 16) | (lsw & 0xFFFF);
    }
    function S (X, n) { return ( X >>> n ) | (X << (32 - n)); }
    function R (X, n) { return ( X >>> n ); }
    function Ch(x, y, z) { return ((x & y) ^ ((~x) & z)); }
    function Maj(x, y, z) { return ((x & y) ^ (x & z) ^ (y & z)); }
    function Sigma0256(x) { return (S(x, 2) ^ S(x, 13) ^ S(x, 22)); }
    function Sigma1256(x) { return (S(x, 6) ^ S(x, 11) ^ S(x, 25)); }
    function Gamma0256(x) { return (S(x, 7) ^ S(x, 18) ^ R(x, 3)); }
    function Gamma1256(x) { return (S(x, 17) ^ S(x, 19) ^ R(x, 10)); }
    function core_sha256 (m, l) {
    var K = new Array(0x428A2F98, 0x71374491, 0xB5C0FBCF, 0xE9B5DBA5, 0x3956C25B, 0x59F111F1, 0x923F82A4, 0xAB1C5ED5, 0xD807AA98, 0x12835B01, 0x243185BE, 0x550C7DC3, 0x72BE5D74, 0x80DEB1FE, 0x9BDC06A7, 0xC19BF174, 0xE49B69C1, 0xEFBE4786, 0xFC19DC6, 0x240CA1CC, 0x2DE92C6F, 0x4A7484AA, 0x5CB0A9DC, 0x76F988DA, 0x983E5152, 0xA831C66D, 0xB00327C8, 0xBF597FC7, 0xC6E00BF3, 0xD5A79147, 0x6CA6351, 0x14292967, 0x27B70A85, 0x2E1B2138, 0x4D2C6DFC, 0x53380D13, 0x650A7354, 0x766A0ABB, 0x81C2C92E, 0x92722C85, 0xA2BFE8A1, 0xA81A664B, 0xC24B8B70, 0xC76C51A3, 0xD192E819, 0xD6990624, 0xF40E3585, 0x106AA070, 0x19A4C116, 0x1E376C08, 0x2748774C, 0x34B0BCB5, 0x391C0CB3, 0x4ED8AA4A, 0x5B9CCA4F, 0x682E6FF3, 0x748F82EE, 0x78A5636F, 0x84C87814, 0x8CC70208, 0x90BEFFFA, 0xA4506CEB, 0xBEF9A3F7, 0xC67178F2);
    var HASH = new Array(0x6A09E667, 0xBB67AE85, 0x3C6EF372, 0xA54FF53A, 0x510E527F, 0x9B05688C, 0x1F83D9AB, 0x5BE0CD19);
    var W = new Array(64);
    var a, b, c, d, e, f, g, h;
    var T1, T2;
    m[l >> 5] |= 0x80 << (24 - l % 32);
    m[((l + 64 >> 9) << 4) + 15] = l;
    for ( var i = 0; i<m.length; i+=16 ) {
    a = HASH[0];
    b = HASH[1];
    c = HASH[2];
    d = HASH[3];
    e = HASH[4];
    f = HASH[5];
    g = HASH[6];
    h = HASH[7];
    for ( var j = 0; j<64; j++) {
    if (j < 16) W[j] = m[j + i];
    else W[j] = safe_add(safe_add(safe_add(Gamma1256(W[j - 2]), W[j - 7]), Gamma0256(W[j - 15])), W[j - 16]);
    T1 = safe_add(safe_add(safe_add(safe_add(h, Sigma1256(e)), Ch(e, f, g)), K[j]), W[j]);
    T2 = safe_add(Sigma0256(a), Maj(a, b, c));
    h = g;
    g = f;
    f = e;
    e = safe_add(d, T1);
    d = c;
    c = b;
    b = a;
    a = safe_add(T1, T2);
    }
    HASH[0] = safe_add(a, HASH[0]);
    HASH[1] = safe_add(b, HASH[1]);
    HASH[2] = safe_add(c, HASH[2]);
    HASH[3] = safe_add(d, HASH[3]);
    HASH[4] = safe_add(e, HASH[4]);
    HASH[5] = safe_add(f, HASH[5]);
    HASH[6] = safe_add(g, HASH[6]);
    HASH[7] = safe_add(h, HASH[7]);
    }
    return HASH;
    }
    function str2binb (str) {
    var bin = Array();
    var mask = (1 << chrsz) - 1;
    for(var i = 0; i < str.length * chrsz; i += chrsz) {
    bin[i>>5] |= (str.charCodeAt(i / chrsz) & mask) << (24 - i%32);
    }
    return bin;
    }
    function Utf8Encode(string) {
    string = string.replace(/\r\n/g,"\n");
    var utftext = "";
    for (var n = 0; n < string.length; n++) {
    var c = string.charCodeAt(n);
    if (c < 128) {
    utftext += String.fromCharCode(c);
    }
    else if((c > 127) && (c < 2048)) {
    utftext += String.fromCharCode((c >> 6) | 192);
    utftext += String.fromCharCode((c & 63) | 128);
    }
    else {
    utftext += String.fromCharCode((c >> 12) | 224);
    utftext += String.fromCharCode(((c >> 6) & 63) | 128);
    utftext += String.fromCharCode((c & 63) | 128);
    }
    }
    return utftext;
    }
    function binb2hex (binarray) {
    var hex_tab = hexcase ? "0123456789ABCDEF" : "0123456789abcdef";
    var str = "";
    for(var i = 0; i < binarray.length * 4; i++) {
    str += hex_tab.charAt((binarray[i>>2] >> ((3 - i%4)*8+4)) & 0xF) +
    hex_tab.charAt((binarray[i>>2] >> ((3 - i%4)*8 )) & 0xF);
    }
    return str;
    }
    s = Utf8Encode(s);
    return binb2hex(core_sha256(str2binb(s), s.length * chrsz));
   }

  verTema(){
    var style = this.general.Tema;
    console.log(style);
    document.getElementsByTagName('body')[0].setAttribute('class', style+'body');
    document.getElementById('barracontainer').setAttribute('class', style+'SupBar');
    document.getElementById('divImg').setAttribute('class', style+'Img');
    document.getElementById('Menu').setAttribute('class', style+'Menu');
    document.getElementById('contenedor').setAttribute('class', style+'contenedor');
    document.getElementById('titulo').setAttribute('class', style+'Titulo');
    document.getElementById('pestañas').setAttribute('class', style+'Pestañas');
    document.getElementById('ContenedorForm').setAttribute('class', style+'Form');
  }

   setStyle(style){
    document.getElementById('titulo').setAttribute('class', style+'Titulo');
    document.getElementById('pestañas').setAttribute('class', style+'Pestañas');
    document.getElementById('ContenedorForm').setAttribute('class', style+'Form');
  }
}
