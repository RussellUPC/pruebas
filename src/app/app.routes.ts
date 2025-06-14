import { Routes } from '@angular/router';
import { AuthComponent } from './components/auth/auth.component';
import { SearchConsultantsComponent } from './components/search-consultants/search-consultants.component';
import { ProfessionalProfileComponent } from './components/professional-profile/professional-profile.component';
import { UserProfileComponent } from './components/user-profile/user-profile.component';
import { NotificationsComponent } from './components/notifications/notifications.component';

export const routes: Routes = [
  { path: '', redirectTo: '/auth', pathMatch: 'full' },
  { path: 'auth', component: AuthComponent },
  { path: 'search-consultants', component: SearchConsultantsComponent },
  { path: 'professional-profile/:id', component: ProfessionalProfileComponent },
  { path: 'user-profile', component: UserProfileComponent },
  { path: 'notifications', component: NotificationsComponent },
  // Rutas para las acciones de notificaciones
  { path: 'session-booking', component: SearchConsultantsComponent }, // Temporalmente redirigimos a SearchConsultants
  { path: 'messages', component: SearchConsultantsComponent }, // Temporalmente redirigimos a SearchConsultants
  { path: 'payments', component: SearchConsultantsComponent }, // Temporalmente redirigimos a SearchConsultants
  { path: 'calendar', component: SearchConsultantsComponent }, // Temporalmente redirigimos a SearchConsultants
  { path: '**', redirectTo: '/auth' }
];
