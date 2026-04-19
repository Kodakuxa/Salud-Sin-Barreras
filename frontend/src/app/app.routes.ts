import { Routes } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { PatientsComponent } from './components/patients/patients.component';
import { PatientsListComponent } from './components/patients-list/patients-list.component';
import { PatientRegisterComponent } from './components/patient-register/patient-register.component';
import { DoctorsComponent } from './components/doctors/doctors.component';
import { MedicalRecordsComponent } from './components/medical-records/medical-records.component';
import { AuthGuard } from './guards/auth.guard';

export const routes: Routes = [
    { path: 'login', component: LoginComponent },
    { 
      path: 'dashboard', 
      component: DashboardComponent, 
      canActivate: [AuthGuard],
      children: [
        { path: 'patients/register', component: PatientRegisterComponent },
        { path: 'patients/list', component: PatientsListComponent },
        { path: 'patients/data', component: PatientsComponent },
        { path: 'doctors', component: DoctorsComponent },
         { path: 'medical-records/:id', component: MedicalRecordsComponent },
        { path: '', redirectTo: 'patients/list', pathMatch: 'full' }
      ] 
    },
    { path: '', redirectTo: '/login', pathMatch: 'full' },
    { path: '**', redirectTo: '/login' }
];
