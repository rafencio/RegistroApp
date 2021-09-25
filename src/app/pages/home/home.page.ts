import { getAllLifecycleHooks } from '@angular/compiler/src/lifecycle_reflector';
import { AfterViewInit, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AlertController } from '@ionic/angular';
import { Usuario } from 'model/Usuario';
import { Asignatura } from 'model/Asignatura';
import { Persona } from 'model/Persona';
import { Animation } from '@ionic/core';
import { AnimationController } from '@ionic/angular';

import { ToastController, LoadingController, Platform } from '@ionic/angular';
import jsQR from 'jsqr';
 

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})

export class HomePage implements OnInit, AfterViewInit {
  @ViewChild("title", {read: ElementRef, static: true}) title: ElementRef;
  //PARA ESCANEAR QR
  @ViewChild('video', { static: false }) video: ElementRef;
  @ViewChild('canvas', { static: false }) canvas: ElementRef;
  @ViewChild('fileinput', { static: false }) fileinput: ElementRef;

  //CODIGO QR
  canvasElement: any;
  videoElement: any;
  canvasContext: any;
  scanActive = false;
  scanResult = null;
  loading: HTMLIonLoadingElement = null;

  public usuario: Usuario;

  public Asignaturas: Asignatura[] = [
    {id: 1, nombre: 'Aplicaciones Moviles'},
    {id: 2, nombre: 'Calidad De Software'},
    {id: 3, nombre: 'Arquitectura'},  
  ];

  public persona: Persona = new Persona();
  
  constructor(     
     private animationCtrl: AnimationController, 
      private activeroute: ActivatedRoute
    , private router: Router
    , private alertController: AlertController
    // Mensajes Toast
    , private toastCtrl: ToastController
    , private loadingCtrl: LoadingController
    , private plt: Platform)     
    {
      const isInStandaloneMode = () =>
      'standalone' in window.navigator && window.navigator['standalone'];
    if (this.plt.is('ios') && isInStandaloneMode()) {
      console.log('I am a an iOS PWA!');
      // E.g. hide the scan functionality!
    }

    
   this.activeroute.queryParams.subscribe(params =>{
      if (this.router.getCurrentNavigation().extras.state) {
      this.usuario = this.router.getCurrentNavigation().extras.state.usuario;
    } else {
      this.router.navigate(['/login']);
    }

  });
}

public ngOnInit() {
  this.persona.nombre = 'Rafael';
  this.persona.apellido = 'Salazar';
  this.persona.Asignatura.id = 1;

}

ngAfterViewInit() {
    //Inicio
    this.canvasElement = this.canvas.nativeElement;
    this.canvasContext = this.canvasElement.getContext('2d');
    this.videoElement = this.video.nativeElement;
    //FIN
  const animation = this.animationCtrl.create()
    .addElement(this.title.nativeElement)
    .duration(2000)
    .iterations(Infinity)
    .fromTo("transform", "translateX(0px)", "translateX(100px)")
    .fromTo("opacity", 1, 0.2);
  animation.play() 
  
}

// Helper functions
async showQrToast() {
  const toast = await this.toastCtrl.create({
    message: `${this.scanResult}?`,
    position: 'top',
    duration: 4000,
    buttons: [
      {
        text: '',
        handler: () => {
          window.open(this.scanResult, '_system', 'location=yes');
        }
      }
    ]
  });
  toast.present();
}

reset() {
  this.scanResult = null;
}

stopScan() {
  this.scanActive = false;


}

async startScan() {
  // Not working on iOS standalone mode!
  const stream = await navigator.mediaDevices.getUserMedia({
    video: { facingMode: 'environment' }
  });
 
  this.videoElement.srcObject = stream;
  // Required for Safari
  this.videoElement.setAttribute('playsinline', true);
 
  this.loading = await this.loadingCtrl.create({});
  await this.loading.present();
 
  this.videoElement.play();
  requestAnimationFrame(this.scan.bind(this));
}
 
async scan() {
  if (this.videoElement.readyState === this.videoElement.HAVE_ENOUGH_DATA) {
    if (this.loading) {
      await this.loading.dismiss();
      this.loading = null;
      this.scanActive = true;
    }
 
    this.canvasElement.height = this.videoElement.videoHeight;
    this.canvasElement.width = this.videoElement.videoWidth;
 
    this.canvasContext.drawImage(
      this.videoElement,
      0,
      0,
      this.canvasElement.width,
      this.canvasElement.height
    );
    const imageData = this.canvasContext.getImageData(
      0,
      0,
      this.canvasElement.width,
      this.canvasElement.height
    );
    const code = jsQR(imageData.data, imageData.width, imageData.height, {
      inversionAttempts: 'dontInvert'
    });
 
    if (code) {
      this.scanActive = false;
      this.scanResult = code.data;
      this.showQrToast();
    } else {
      if (this.scanActive) {
        requestAnimationFrame(this.scan.bind(this));
      }
    }
  } else {
    requestAnimationFrame(this.scan.bind(this));
  }
}

captureImage() {
  this.fileinput.nativeElement.click();
}
 
handleFile(files: FileList) {
  const file = files.item(0);
 
  var img = new Image();
  img.onload = () => {
    this.canvasContext.drawImage(img, 0, 0, this.canvasElement.width, this.canvasElement.height);
    const imageData = this.canvasContext.getImageData(
      0,
      0,
      this.canvasElement.width,
      this.canvasElement.height
    );
    const code = jsQR(imageData.data, imageData.width, imageData.height, {
      inversionAttempts: 'dontInvert'
    });
 
    if (code) {
      this.scanResult = code.data;
      this.showQrToast();
    }
  };
  img.src = URL.createObjectURL(file);
}

} 






