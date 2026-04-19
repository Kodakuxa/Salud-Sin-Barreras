import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ApiService } from '../../services/api.service';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-patients',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <div class="patients-container">
      <div class="header-actions">
        <h2>Datos de Pacientes</h2>
      </div>

      <div class="search-bar">
        <input type="text" [formControl]="searchControl" placeholder="Buscar por nombre..." (keyup.enter)="loadPatients()" />
        <button (click)="loadPatients()" class="btn btn-info">Buscar</button>
      </div>

      <table class="table">
        <thead>
          <tr>
            <th>#</th>
            <th>Nombre Completo</th>
            <th>Edad</th>
            <th>Teléfono</th>
            <th>Dirección</th>
            <th>Editar</th>
            <th>Eliminar</th>
          </tr>
        </thead>
        <tbody>
          <tr *ngFor="let patient of patients; let i = index">
            <td>{{i + 1}}</td>
            <td>{{patient.full_name | uppercase}}</td>
            <td>{{patient.age}} años</td>
            <td>{{patient.phone}}</td>
            <td>{{patient.address}}</td>
            <td><button class="btn-icon text-warning" (click)="openModal(patient)" title="Editar"><i class="fas fa-pencil-alt" style="color: #ff9800;"></i></button></td>
            <td><button class="btn-icon text-danger" (click)="deletePatient(patient.id)" title="Eliminar"><i class="fas fa-trash-alt" style="color: #bdbdbd;"></i></button></td>
          </tr>
        </tbody>
      </table>
    </div>

    <div class="modal-overlay" *ngIf="showModal" (click)="closeModal()">
      <div class="modal-content" (click)="$event.stopPropagation()">
        <div class="modal-header">
          <h3>{{ selectedPatientId ? 'Editar Paciente' : 'Registrar Paciente' }}</h3>
          <button class="close-btn" (click)="closeModal()">×</button>
        </div>
        <form [formGroup]="patientForm" (ngSubmit)="savePatient()">
          <div class="form-row">
             <div class="form-group flex-1">
               <label>Nombre Completo <span class="text-danger">*</span></label>
               <input formControlName="full_name" type="text" [class.is-invalid]="patientForm.get('full_name')?.invalid && patientForm.get('full_name')?.touched" required>
               <small class="text-danger" *ngIf="patientForm.get('full_name')?.invalid && patientForm.get('full_name')?.touched">El nombre es requerido.</small>
             </div>
             <div class="form-group flex-1">
               <label>Edad <span class="text-danger">*</span></label>
               <input formControlName="age" type="number" [class.is-invalid]="patientForm.get('age')?.invalid && patientForm.get('age')?.touched" required>
               <small class="text-danger" *ngIf="patientForm.get('age')?.invalid && patientForm.get('age')?.touched">La edad es requerida y debe ser un número válido.</small>
             </div>
          </div>
          <div class="form-row">
             <div class="form-group flex-1">
               <label>Teléfono</label>
               <input formControlName="phone" type="text">
             </div>
             <div class="form-group flex-1">
               <label>Dirección</label>
               <input formControlName="address" type="text">
             </div>
          </div>
          
          <div class="modal-footer">
            <button type="submit" class="btn btn-success" [disabled]="patientForm.invalid" [class.disabled-btn]="patientForm.invalid">Guardar</button>
          </div>
        </form>
      </div>
    </div>
  `,
  styles: [`
    .patients-container { background: white; padding: 20px; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1); }
    .header-actions { display: flex; justify-content: space-between; align-items: center; border-bottom: 2px solid #eee; padding-bottom: 15px; margin-bottom: 20px; }
    .search-bar { display: flex; gap: 10px; margin-bottom: 20px; max-width: 400px; }
    .search-bar input { flex: 1; padding: 8px; border: 1px solid #ccc; border-radius: 4px; outline: none; }
    
    .table { width: 100%; border-collapse: collapse; }
    .table th { background: #5c6bc0; color: white; padding: 12px; text-align: left; }
    .table td { padding: 12px; border-bottom: 1px solid #eee; }
    .table tr:hover { background: #f9fafe; }
    
    .btn { padding: 8px 15px; border: none; border-radius: 4px; cursor: pointer; color: white; transition: opacity 0.3s; }
    .btn-primary { background: #42a5f5; }
    .btn-success { background: #4caf50; }
    .btn-info { background: #00bcd4; }
    .btn-icon { background: none; border: none; cursor: pointer; margin: 0 5px; font-size: 16px;}
    .disabled-btn { opacity: 0.6; cursor: not-allowed; }
    
    .modal-overlay { position: fixed; top: 0; left: 0; right: 0; bottom: 0; background: rgba(0,0,0,0.5); display: flex; justify-content: center; align-items: center; z-index: 1000; }
    .modal-content { background: white; padding: 20px; border-radius: 8px; width: 500px; max-width: 90%; max-height: 90vh; overflow-y: auto; }
    .modal-header { display: flex; justify-content: space-between; align-items: center; border-bottom: 1px solid #eee; padding-bottom: 10px; margin-bottom: 20px; }
    .close-btn { background: none; border: none; font-size: 1.5rem; cursor: pointer; }
    
    .form-row { display: flex; gap: 15px; margin-bottom: 15px; }
    .flex-1 { flex: 1; }
    .form-group label { display: block; margin-bottom: 5px; color: #555; }
    .form-group input, .form-group select { width: 100%; padding: 8px; border: 1px solid #ccc; border-radius: 4px; box-sizing: border-box; }
    .form-control { width: 100%; padding: 8px; border: 1px solid #ccc; border-radius: 4px; }
    .is-invalid { border-color: #dc3545 !important; }
    .text-danger { color: #dc3545; font-size: 0.85em; }
    .modal-footer { margin-top: 20px; text-align: right; }
  `]
})
export class PatientsComponent implements OnInit {
  patients: any[] = [];
  searchControl: any;
  showModal = false;
  patientForm: FormGroup;
  selectedPatientId: number | null = null;

  constructor(
    private api: ApiService, 
    private fb: FormBuilder
  ) {
    this.searchControl = this.fb.control('');
    this.patientForm = this.fb.group({
      full_name: ['', Validators.required],
      age: ['', [Validators.required, Validators.min(0)]],
      phone: [''],
      address: ['']
    });
  }

  ngOnInit() {
    this.loadPatients();
  }

  loadPatients() {
    this.api.getPatients(this.searchControl.value).subscribe(res => {
      if (res.success) {
        this.patients = res.data;
      }
    });
  }

  openModal(patient?: any) {
    this.patientForm.reset();
    if (patient) {
      this.selectedPatientId = patient.id;

      this.patientForm.patchValue({
        full_name: patient.full_name,
        age: patient.age,
        phone: patient.phone,
        address: patient.address
      });
      this.showModal = true;
    }
  }

  closeModal() {
    this.showModal = false;
  }

  savePatient() {
    if (this.patientForm.valid) {
      if (!this.selectedPatientId) {
        return;
      }

      const updateData = {
        id: this.selectedPatientId,
        full_name: this.patientForm.value.full_name,
        age: this.patientForm.value.age,
        phone: this.patientForm.value.phone,
        address: this.patientForm.value.address
      };

      const idx = this.patients.findIndex(p => p.id === this.selectedPatientId);
      const backup = idx >= 0 ? { ...this.patients[idx] } : null;
      if (idx >= 0) {
        this.patients[idx] = { ...this.patients[idx], ...updateData };
      }

      this.api.updatePatient(updateData).subscribe({
        next: () => {
          this.api.notifyPatientsChanged();
          this.closeModal();
        },
        error: () => {
          if (idx >= 0 && backup) {
            this.patients[idx] = backup;
          }
          alert('No se pudo actualizar el paciente.');
        }
      });
    } else {
      this.patientForm.markAllAsTouched();
    }
  }

  deletePatient(id: number) {
    if (confirm('¿Está seguro de que desea eliminar este paciente?')) {       
      const backup = [...this.patients];
      this.patients = this.patients.filter(p => p.id !== id);

      this.api.deletePatient(id).subscribe({
        next: () => {
          this.api.notifyPatientsChanged();
        },
        error: () => {
          this.patients = backup;
          alert('No se pudo eliminar el paciente.');
        }
      });
    }
  }
}