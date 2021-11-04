import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomePage } from './home.page';
import { CertificacionesComponent } from '../certificaciones/certificaciones.component';
import { ExperienciaLaboralComponent } from '../experiencia-laboral/experiencia-laboral.component';
import { PerfilComponent } from '../perfil/perfil.component';

const routes: Routes = [
  {
    path: '',
    component: HomePage,
    children:[
      {
        path:'perfil',
        component: PerfilComponent
      },
      {
        path:'certificaciones',
        component: CertificacionesComponent
      },
      {
        path:'experiencias',
        component: ExperienciaLaboralComponent
      },
    ]
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class HomePageRoutingModule {}
