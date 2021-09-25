import { AfterViewInit, Component, OnInit } from '@angular/core';
import { Router, NavigationExtras } from '@angular/router';
import { ToastController } from '@ionic/angular';
import { Usuario } from 'model/Usuario';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit{

  public usuario: Usuario;

  constructor(private router: Router, private toastController: ToastController) {
    this.usuario= new Usuario();
    this.usuario.nombreUsuario='';
    this.usuario.password='';
  }

  public ngOnInit(): void {
    //this.usuario.nombreUsuario = 'rsalazar';
    //this.usuario.password = '1234';
    //this.ingresar();
  }

  public ingresar(): void {
    if(!this.validarUsuario(this.usuario)) {
      return;
    }
    const navigationExtras: NavigationExtras = {
      state: {
        usuario: this.usuario
      }
    };
    this.router.navigate(['/home'], navigationExtras);
  }

  public validarUsuario(usuario: Usuario): boolean {
    const mensajeError = usuario.validarUsuario();

    if (mensajeError) {
      this.mostrarMensaje(mensajeError);
      return false;
    }
    return true;
  }

  /**
   * @param mensaje Mensaje a presentar al usuario
  * @param duracion Duración el toast, este es opcional
   */
  
   async mostrarMensaje(mensaje: string, duracion?: number) {
    const toast = await this.toastController.create({
        message: mensaje,
        duration: duracion? duracion: 2000
      });
    toast.present();
  }
  

}
