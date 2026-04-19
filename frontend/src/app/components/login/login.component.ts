import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <div class="login-container">
      <div class="login-card">
        <div class="logo">
           <img src="logo.jpg" alt="Salud Sin Barreras Logo">
        </div>

        <form *ngIf="isLogin" [formGroup]="loginForm" (ngSubmit)="onLoginSubmit()">
          <div class="form-group mb-3 text-left">
            <label class="form-label">Correo electrónico <span style="color:red">*</span></label>
            <input type="email" formControlName="email" placeholder="Ingresa tu correo electrónico" [class.is-invalid]="loginForm.get('email')?.invalid && loginForm.get('email')?.touched">
            <small class="error-text" *ngIf="loginForm.get('email')?.invalid && loginForm.get('email')?.touched">Correo inválido.</small>
          </div>
          <div class="form-group mb-4 text-left">
            <label class="form-label">Contraseña <span style="color:red">*</span></label>  
            <input type="password" formControlName="password" placeholder="Ingresa tu contraseña" [class.is-invalid]="loginForm.get('password')?.invalid && loginForm.get('password')?.touched">
            <small class="error-text" *ngIf="loginForm.get('password')?.invalid && loginForm.get('password')?.touched">Requerida.</small>
          </div>
          <button type="submit" [disabled]="loginForm.invalid">Iniciar Sesión</button>
          <p class="mt-3" style="font-size:14px;">¿No tienes cuenta? <a href="javascript:void(0)" (click)="toggleMode()" style="color:#2196f3;">Regístrate</a></p>
        </form>

        <form *ngIf="!isLogin" [formGroup]="registerForm" (ngSubmit)="onRegisterSubmit()">
          <div class="form-group mb-3 text-left">
            <label class="form-label">Nombre Completo <span style="color:red">*</span></label>
            <input type="text" formControlName="full_name" placeholder="Juan Pérez" [class.is-invalid]="registerForm.get('full_name')?.invalid && registerForm.get('full_name')?.touched">
            <small class="error-text" *ngIf="registerForm.get('full_name')?.invalid && registerForm.get('full_name')?.touched">Requerido.</small>     
          </div>
          <div class="form-group mb-3 text-left">
            <label class="form-label">Correo electrónico <span style="color:red">*</span></label>
            <input type="email" formControlName="email" placeholder="nombre.apellido@correo.com" [class.is-invalid]="registerForm.get('email')?.invalid && registerForm.get('email')?.touched">
            <small class="error-text" *ngIf="registerForm.get('email')?.invalid && registerForm.get('email')?.touched">Inválido.</small>    
          </div>
          <div class="form-group mb-3 text-left">
            <label class="form-label">Contraseña <span style="color:red">*</span></label>  
            <input type="password" formControlName="password" placeholder="Crea una contraseña segura" [class.is-invalid]="registerForm.get('password')?.invalid && registerForm.get('password')?.touched">
            <small class="error-text" *ngIf="registerForm.get('password')?.invalid && registerForm.get('password')?.touched">Requerida (min 6).</small>
          </div>
          <div class="form-group mb-4 text-left">
            <label class="form-label">Tipo de Cuenta <span style="color:red">*</span></label>
            <select formControlName="role" style="width:100%; padding:10px 5px; border:none; border-bottom:1px solid #ccc; background:transparent; outline:none;">
              <option value="paciente">Paciente</option>
              <option value="doctor">Doctor</option>
            </select>
          </div>
          <button type="submit" [disabled]="registerForm.invalid">Registrarse</button>
          <p class="mt-3" style="font-size:14px;">¿Ya tienes cuenta? <a href="javascript:void(0)" (click)="toggleMode()" style="color:#2196f3;">Inicia Sesión</a></p>
        </form>

        <p *ngIf="error" class="error-msg">{{error}}</p>
      </div>
    </div>
  `,
  styles: [`
    :host { display: block; width: 100vw; height: 100dvh; overflow: hidden; }
    .login-container { position: fixed; inset: 0; display: flex; justify-content: center; align-items: center; height: 100dvh; width: 100vw; overflow: hidden;
      background: url('https://images.unsplash.com/photo-1579684385127-1ef15d508118?q=80&w=1920&auto=format&fit=crop') no-repeat center center;
      background-size: cover; margin: 0; padding: 0; }
    .login-card { background: rgba(255, 255, 255, 0.95); padding: 40px; border-radius: 4px;
      box-shadow: 0 10px 25px rgba(0,0,0,0.15); width: 320px; text-align: center; }
    .logo { margin-bottom: 30px; }
    .logo img { width: 80px; margin-bottom: 10px; }
    .form-group { margin-bottom: 25px; }
    .form-label { display:block; text-align:left; color:#666; font-size:14px; margin-bottom:8px; }
    input { width: 100%; padding: 10px 5px; border: none; border-bottom: 1px solid #ccc;
      background: transparent; outline: none; font-size: 15px; transition: border-color 0.3s; }
    input:focus { border-bottom: 2px solid #2196f3; }
    button { width: 100%; padding: 12px; background: #2196f3; color: white;
      border: none; border-radius: 30px; cursor: pointer; font-size: 16px; font-weight: 500; margin-top: 10px; }
    button:hover:not(:disabled) { background: #1976d2; }
    button:disabled { background: #90caf9; cursor: not-allowed; }
    .error-text { color:#e53935; font-size:12px; display:block; text-align:left; margin-top:4px; }
    .is-invalid { border-bottom: 2px solid #e53935 !important; }
    .mb-3 { margin-bottom: 15px; }
    .mb-4 { margin-bottom: 25px; }
    .mt-3 { margin-top: 15px; }
    .error-msg { color: #d32f2f; margin-top: 15px; font-size: 14px; }
  `]
})
export class LoginComponent {
  loginForm: FormGroup;
  registerForm: FormGroup;
  error: string = '';
  isLogin: boolean = true;

  constructor(private fb: FormBuilder, private authService: AuthService, private router: Router) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required]
    });
    this.registerForm = this.fb.group({
      full_name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      role: ['paciente', Validators.required]
    });
  }

  toggleMode() {
    this.isLogin = !this.isLogin;
    this.error = '';
    this.loginForm.reset();
    this.registerForm.reset({role: 'paciente'});
  }

  onLoginSubmit() {
    if (this.loginForm.valid) {
      const { email, password } = this.loginForm.value;
      this.authService.login(email, password).subscribe({
        next: (res) => {
          if (res.success) {
            this.router.navigate(['/dashboard']);
          } else {
            this.error = res.message;
          }
        },
        error: (err) => {
          this.error = 'Error en conexión';  
        }
      });
    } else {
      this.loginForm.markAllAsTouched();
    }
  }

  onRegisterSubmit() {
    if (this.registerForm.valid) {
      this.authService.register(this.registerForm.value).subscribe({
        next: (res) => {
          if(res.success) {
            alert('Registro completado exitosamente. Por favor inicie sesión.');
            this.isLogin = true;
            this.loginForm.patchValue({ email: this.registerForm.value.email });
          } else {
            this.error = res.message;
          }
        },
        error: (err) => {
          this.error = 'Error al registrar el usuario';
        }
      });
    } else {
      this.registerForm.markAllAsTouched();
    }
  }
}

