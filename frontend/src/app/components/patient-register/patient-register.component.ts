import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ApiService } from '../../services/api.service';

@Component({
  selector: 'app-patient-register',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <div class="register-container">
      <div class="header-actions">
        <h2>Registrar Paciente</h2>
      </div>

      <form [formGroup]="patientForm" (ngSubmit)="savePatient()" class="register-form">
        <div class="form-row">
          <div class="form-group flex-1">
            <label>Nombre completo <span class="text-danger">*</span></label>
            <input formControlName="full_name" type="text" placeholder="Escribe el nombre completo" [class.is-invalid]="patientForm.get('full_name')?.invalid && patientForm.get('full_name')?.touched">
          </div>
          <div class="form-group flex-1">
            <label>Edad <span class="text-danger">*</span></label>
            <input formControlName="age" type="number" placeholder="Escribe la edad" [class.is-invalid]="patientForm.get('age')?.invalid && patientForm.get('age')?.touched">
          </div>
        </div>

        <div class="form-row">
          <div class="form-group flex-1">
            <label>Teléfono</label>
            <input formControlName="phone" type="text" placeholder="Escribe el teléfono">
          </div>
          <div class="form-group flex-1">
            <label>Dirección</label>
            <input formControlName="address" type="text" placeholder="Escribe la dirección">
          </div>
        </div>

        <div class="form-row">
          <div class="form-group flex-1">
            <label>Correo electrónico <span class="text-danger">*</span></label>
            <input formControlName="email" type="email" placeholder="Escribe el correo electrónico" [class.is-invalid]="patientForm.get('email')?.invalid && patientForm.get('email')?.touched">
          </div>
          <div class="form-group flex-1">
            <label>Contraseña <span class="text-danger">*</span></label>
            <input formControlName="password" type="password" placeholder="Escribe una contraseña" [class.is-invalid]="patientForm.get('password')?.invalid && patientForm.get('password')?.touched">
          </div>
        </div>

        <div class="form-footer">
          <button type="submit" class="btn btn-success" [disabled]="patientForm.invalid">Guardar paciente</button>
        </div>

        <p *ngIf="message" class="message">{{ message }}</p>
      </form>
    </div>
  `,
  styles: [`
    .register-container { background: white; padding: 20px; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1); }
    .header-actions { border-bottom: 2px solid #eee; padding-bottom: 15px; margin-bottom: 20px; }
    .register-form { max-width: 900px; }
    .form-row { display: flex; gap: 15px; margin-bottom: 15px; }
    .flex-1 { flex: 1; }
    .form-group label { display: block; margin-bottom: 5px; color: #555; }
    .form-group input { width: 100%; padding: 10px; border: 1px solid #ccc; border-radius: 6px; box-sizing: border-box; }
    .is-invalid { border-color: #dc3545 !important; }
    .text-danger { color: #dc3545; }
    .form-footer { margin-top: 20px; }
    .btn { padding: 10px 16px; border: none; border-radius: 6px; cursor: pointer; color: white; font-weight: 600; }
    .btn-success { background: #26a69a; }
    .btn-success:disabled { opacity: 0.6; cursor: not-allowed; }
    .message { margin-top: 12px; color: #2f3f66; }
  `]
})
export class PatientRegisterComponent {
  patientForm: FormGroup;
  message = '';

  constructor(private fb: FormBuilder, private api: ApiService) {
    this.patientForm = this.fb.group({
      full_name: ['', Validators.required],
      age: ['', [Validators.required, Validators.min(0)]],
      phone: [''],
      address: [''],
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
      role: ['paciente', Validators.required]
    });
  }

  savePatient() {
    if (this.patientForm.invalid) {
      this.patientForm.markAllAsTouched();
      return;
    }

    this.api.registerUser(this.patientForm.value).subscribe({
      next: (res) => {
        if (res.success) {
          this.message = 'Paciente registrado correctamente.';
          this.api.notifyPatientsChanged();
          this.patientForm.reset({ role: 'paciente' });
        } else {
          this.message = res.message || 'No se pudo registrar el paciente.';
        }
      },
      error: () => {
        this.message = 'Error de conexión al registrar paciente.';
      }
    });
  }
}
