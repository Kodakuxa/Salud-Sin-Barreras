import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule, ReactiveFormsModule],
  template: `
    <div class="dashboard-layout">
      <aside class="sidebar">
        <div class="sidebar-header">
          <img src="logo.jpg" alt="Salud Sin Barreras" class="brand-logo">
          <div class="brand-text">
            <h3>Salud Sin Barreras</h3>
            <p>Telemedicina</p>
          </div>
        </div>

        <button class="user-profile" type="button" (click)="openProfileModal()">
          <div class="avatar-small" *ngIf="profilePhoto; else initialsAvatar">
            <img [src]="profilePhoto" alt="Foto de perfil" class="avatar-image">
          </div>
          <ng-template #initialsAvatar>
            <div class="avatar-small avatar-fallback">{{ getInitials(currentUser?.username) }}</div>
          </ng-template>
          <div class="user-meta">
            <span class="user-name">{{ currentUser?.username || 'Usuario' }}</span>
            <small>{{ currentUser?.email || 'Sin correo' }}</small>
          </div>
          <i class="fas fa-chevron-right ml-auto"></i>
        </button>

        <div class="nav-section">
          <h6 class="nav-heading">Indicadores</h6>

          <ul class="nav flex-column">
            <li class="nav-item has-submenu open">
              <a class="nav-link" routerLink="./patients/list" routerLinkActive="active">
                <i class="fas fa-wheelchair menu-icon active-icon"></i>
                <span class="active-text">Pacientes</span>
                <i class="fas fa-chevron-right ml-auto arrow-icon active-icon"></i>
              </a>
              <ul class="submenu">
                <li><a class="nav-link sub-link" routerLink="./patients/register" routerLinkActive="active">Registrar Paciente</a></li>
                <li><a class="nav-link sub-link" routerLink="./patients/list" routerLinkActive="active">Lista de Pacientes</a></li>
                <li><a class="nav-link sub-link" routerLink="./patients/data" routerLinkActive="active">Datos de Pacientes</a></li>
              </ul>
            </li>

            <li class="nav-item has-submenu open">
              <a class="nav-link" routerLink="./doctors" routerLinkActive="active">
                <i class="fas fa-user-md menu-icon"></i> Doctores
                <i class="fas fa-chevron-right ml-auto arrow-icon"></i>
              </a>
              <ul class="submenu">
                <li><a class="nav-link sub-link" routerLink="./doctors" routerLinkActive="active">Lista de Doctores</a></li>
              </ul>
            </li>

            <li class="nav-item has-submenu open">
              <a class="nav-link">
                <i class="fas fa-bullseye menu-icon"></i> Historial Clinico
                <i class="fas fa-chevron-right ml-auto arrow-icon"></i>
              </a>
              <ul class="submenu">
                <li><a class="nav-link sub-link">Nuevo Historial</a></li>
                <li><a class="nav-link sub-link" routerLink="./medical-records/0" routerLinkActive="active">Historial</a></li>
              </ul>
            </li>
          </ul>
        </div>

        <ul class="nav flex-column mt-auto logout-container">
          <li class="nav-item">
            <a class="nav-link text-muted" (click)="logout()">
              <i class="fas fa-power-off menu-icon"></i> Salir
            </a>
          </li>
        </ul>
      </aside>

      <main class="main-content">
        <header class="topbar">
          <button class="menu-toggle"><i class="fas fa-bars"></i></button>
          <div class="topbar-right">
            <div class="avatar-small" *ngIf="profilePhoto; else topInitialsAvatar">
              <img [src]="profilePhoto" alt="Foto de perfil" class="avatar-image">
            </div>
            <ng-template #topInitialsAvatar>
              <div class="avatar-small top-avatar">{{ getInitials(currentUser?.username) }}</div>
            </ng-template>
          </div>
        </header>

        <div class="content-wrapper">
          <router-outlet></router-outlet>
        </div>
      </main>
    </div>

    <div class="modal-overlay" *ngIf="showProfileModal" (click)="closeProfileModal()">
      <div class="modal-content" (click)="$event.stopPropagation()">
        <div class="modal-header">
          <h3>Perfil de Usuario</h3>
          <button type="button" class="close-btn" (click)="closeProfileModal()">x</button>
        </div>

        <div class="profile-photo-section">
          <div class="profile-photo" *ngIf="profilePhoto; else modalInitialsAvatar">
            <img [src]="profilePhoto" alt="Foto de perfil" class="avatar-image">
          </div>
          <ng-template #modalInitialsAvatar>
            <div class="profile-photo avatar-fallback">{{ getInitials(currentUser?.username) }}</div>
          </ng-template>
          <button type="button" class="btn btn-photo" (click)="fileInput.click()">Cambiar Foto</button>
          <input #fileInput type="file" accept="image/*" class="hidden-input" (change)="onProfilePhotoSelected($event)">
        </div>

        <form [formGroup]="profileForm" (ngSubmit)="saveProfile()">
          <div class="form-group">
            <label>Nombre</label>
            <input class="form-control" formControlName="username" placeholder="Nombre completo">
          </div>

          <div class="form-group">
            <label>Correo electrónico</label>
            <input class="form-control" formControlName="email" type="email" placeholder="Ingresa tu correo electrónico">
          </div>

          <div class="form-row">
            <div class="form-group flex-1">
              <label>Contraseña actual</label>
              <input class="form-control" formControlName="currentPassword" type="password" placeholder="Escribe tu contraseña actual">
            </div>
            <div class="form-group flex-1">
              <label>Nueva contraseña</label>
              <input class="form-control" formControlName="newPassword" type="password" placeholder="Escribe una nueva contraseña">
            </div>
          </div>

          <p class="role-text">Rol: {{ getDisplayRole(currentUser?.role) }}</p>
          <p *ngIf="profileMessage" class="profile-message">{{ profileMessage }}</p>

          <div class="modal-footer">
            <button type="submit" class="btn btn-save" [disabled]="profileForm.invalid">Guardar Cambios</button>
          </div>
        </form>
      </div>
    </div>
  `,
  styles: [`
    :host { display: block; width: 100vw; height: 100dvh; overflow: hidden; }
    .dashboard-layout { display: flex; height: 100dvh; width: 100vw; overflow: hidden; background: #f4f6f9; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; }
    .sidebar { width: 280px; background: #fff; display: flex; flex-direction: column; box-shadow: 2px 0 10px rgba(0,0,0,0.05); z-index: 10; }

    .sidebar-header { padding: 14px 16px; border-bottom: 1px solid #f0f0f0; display: flex; align-items: center; gap: 10px; }
    .brand-logo { width: 48px; height: 48px; object-fit: contain; }
    .brand-text h3 { margin: 0; font-size: 23px; color: #22324a; line-height: 1.1; }
    .brand-text p { margin: 2px 0 0 0; font-size: 13px; color: #688099; }

    .user-profile { padding: 12px 16px; border: none; border-bottom: 1px solid #f0f0f0; background: #fff; width: 100%; display: flex; align-items: center; text-align: left; cursor: pointer; }
    .avatar-small { border-radius: 50%; width: 40px; height: 40px; overflow: hidden; display: flex; align-items: center; justify-content: center; }
    .avatar-image { width: 100%; height: 100%; object-fit: cover; }
    .avatar-fallback { background:#e0f7fa; color:#006064; font-weight:bold; }
    .user-meta { display: flex; flex-direction: column; margin-left: 10px; min-width: 0; }
    .user-name { font-size: 14px; font-weight: 600; color: #38495b; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
    .user-meta small { color: #7a8a9a; font-size: 12px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; max-width: 150px; }
    .user-profile .fa-chevron-right { margin-left: auto; color: #999; font-size: 12px; }

    .nav-section { padding: 15px 0; flex: 1; overflow-y: auto; }
    .nav-heading { padding: 0 20px; color: #999; text-transform: uppercase; font-size: 12px; font-weight: 600; margin-bottom: 10px; letter-spacing: 0.5px; }

    .nav { list-style: none; padding: 0; margin: 0; width: 100%; }
    .nav-item { position: relative; }

    .nav-link { display: flex; align-items: center; padding: 12px 20px; text-decoration: none; color: #666; font-weight: 500; font-size: 14px; cursor: pointer; transition: all 0.3s; }
    .nav-link:hover { color: #1976d2; }
    .menu-icon { width: 25px; text-align: center; margin-right: 10px; font-size: 18px; color: #a0a0a0; }
    .nav-link:hover .menu-icon { color: #1976d2; }
    .active-icon { color: #1976d2; }
    .active-text { color: #1976d2; font-weight: 600; }

    .arrow-icon { margin-left: auto; font-size: 10px; transition: transform 0.3s; }

    .submenu { list-style: none; padding: 0; margin: 0; background: #fafafa; display: block; }

    .has-submenu.open .arrow-icon { transform: rotate(90deg); }

    .sub-link { padding: 10px 20px 10px 55px; font-size: 13px; color: #777; }
    .sub-link:hover, .sub-link.active { color: #1976d2; font-weight: 600; background: #fff; }

    .logout-container { border-top: 1px solid #f0f0f0; padding: 10px 0; }
    .text-muted { color: #888 !important; }

    .main-content { flex: 1; display: flex; flex-direction: column; overflow: hidden; }
    .topbar { background: #1976d2; color: white; padding: 0 20px; height: 60px; display: flex; justify-content: space-between; align-items: center; box-shadow: 0 2px 4px rgba(0,0,0,0.1); z-index: 5; }
    .menu-toggle { background: transparent; border: none; color: white; font-size: 20px; cursor: pointer; }
    .topbar-right { display: flex; align-items: center; }
    .top-avatar { background:#283593; color:white; font-weight:bold; }

    .content-wrapper { padding: 25px; background: #fdfdfd; height: calc(100dvh - 60px); min-height: 0; overflow: auto; }

    .modal-overlay { position: fixed; inset: 0; background: rgba(0,0,0,0.45); display: flex; align-items: center; justify-content: center; z-index: 1500; }
    .modal-content { width: 560px; max-width: 92vw; max-height: 88dvh; overflow: auto; background: white; border-radius: 10px; padding: 22px; box-shadow: 0 10px 30px rgba(0,0,0,0.2); }
    .modal-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 16px; }
    .modal-header h3 { margin: 0; color: #2d3c4b; }
    .close-btn { border: none; background: transparent; font-size: 24px; cursor: pointer; color: #7f8c99; }

    .profile-photo-section { display: flex; align-items: center; gap: 12px; margin-bottom: 18px; }
    .profile-photo { width: 68px; height: 68px; border-radius: 50%; overflow: hidden; display: flex; align-items: center; justify-content: center; }
    .btn { border: none; border-radius: 6px; padding: 10px 14px; cursor: pointer; }
    .btn-photo { background: #e8f2ff; color: #1665c1; }
    .hidden-input { display: none; }

    .form-group { margin-bottom: 14px; }
    .form-row { display: flex; gap: 12px; }
    .flex-1 { flex: 1; }
    .form-group label { display: block; margin-bottom: 6px; color: #607488; font-size: 13px; }
    .form-control { width: 100%; border: 1px solid #d6dde5; border-radius: 6px; padding: 10px; box-sizing: border-box; }
    .form-control:focus { outline: none; border-color: #1976d2; }

    .role-text { margin: 6px 0 0 0; color: #6e8194; font-size: 13px; }
    .profile-message { color: #1976d2; font-size: 13px; margin-top: 8px; }
    .modal-footer { margin-top: 14px; text-align: right; }
    .btn-save { background: #1976d2; color: white; }
    .btn-save:disabled { opacity: 0.6; cursor: not-allowed; }

    .ml-auto { margin-left: auto; }
    .mt-auto { margin-top: auto; }
  `]
})
export class DashboardComponent implements OnInit {
  showProfileModal = false;
  profileMessage = '';
  currentUser: any = null;
  profilePhoto: string | null = null;
  profileForm: FormGroup;

  constructor(
    private authService: AuthService,
    private fb: FormBuilder
  ) {
    this.profileForm = this.fb.group({
      username: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      currentPassword: [''],
      newPassword: ['', Validators.minLength(6)]
    });
  }

  ngOnInit(): void {
    if (!document.getElementById('font-awesome-link')) {
      const link = document.createElement('link');
      link.id = 'font-awesome-link';
      link.rel = 'stylesheet';
      link.href = 'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.4/css/all.min.css';
      document.head.appendChild(link);
    }

    this.currentUser = this.authService.getCurrentUser();
    if (this.currentUser?.id) {
      this.profilePhoto = localStorage.getItem(`profile_photo_${this.currentUser.id}`);
    }

    if (this.currentUser) {
      this.profileForm.patchValue({
        username: this.currentUser.username || '',
        email: this.currentUser.email || ''
      });
    }
  }

  openProfileModal() {
    this.profileMessage = '';
    this.showProfileModal = true;
    this.profileForm.patchValue({
      username: this.currentUser?.username || '',
      email: this.currentUser?.email || '',
      currentPassword: '',
      newPassword: ''
    });
  }

  closeProfileModal() {
    this.showProfileModal = false;
  }

  onProfilePhotoSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    const file = input.files && input.files[0] ? input.files[0] : null;
    if (!file) {
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      this.profilePhoto = typeof reader.result === 'string' ? reader.result : null;
      if (this.currentUser?.id && this.profilePhoto) {
        localStorage.setItem(`profile_photo_${this.currentUser.id}`, this.profilePhoto);
      }
    };
    reader.readAsDataURL(file);
  }

  saveProfile() {
    if (!this.currentUser?.id) {
      this.profileMessage = 'No fue posible identificar el usuario actual.';
      return;
    }

    if (this.profileForm.invalid) {
      this.profileForm.markAllAsTouched();
      return;
    }

    const payload = {
      id: this.currentUser.id,
      username: this.profileForm.value.username,
      email: this.profileForm.value.email,
      currentPassword: this.profileForm.value.currentPassword,
      newPassword: this.profileForm.value.newPassword
    };

    this.authService.updateProfile(payload).subscribe({
      next: (res) => {
        if (res.success) {
          this.currentUser = res.user;
          this.profileMessage = 'Perfil actualizado correctamente.';
          this.profileForm.patchValue({ currentPassword: '', newPassword: '' });
        } else {
          this.profileMessage = res.message || 'No se pudo actualizar el perfil.';
        }
      },
      error: () => {
        this.profileMessage = 'Error de conexion al actualizar perfil.';
      }
    });
  }

  getInitials(name: string | undefined): string {
    if (!name) {
      return 'US';
    }
    const parts = name.split(' ').filter(p => p.trim().length > 0);
    if (parts.length === 1) {
      return parts[0].slice(0, 2).toUpperCase();
    }
    return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
  }

  getDisplayRole(role: string | undefined): string {
    if (role === 'admin') {
      return 'Administrador';
    }
    if (role === 'doctor') {
      return 'Doctor';
    }
    if (role === 'paciente') {
      return 'Paciente';
    }
    return 'Usuario';
  }

  logout() {
    this.authService.logout();
  }
}
