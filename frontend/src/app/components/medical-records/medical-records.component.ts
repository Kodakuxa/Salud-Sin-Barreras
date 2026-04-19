import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { Router } from '@angular/router';
import { ApiService } from '../../services/api.service';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { jsPDF } from 'jspdf';
import html2canvas from 'html2canvas';

@Component({
  selector: 'app-medical-records',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <div class="records-container" id="printable-area">
      <div class="header-actions no-print">
        <div>
          <h2>{{ patientId > 0 ? ('Expediente de ' + (selectedPatientName || 'Paciente')) : 'Historial de Expedientes' }}</h2>
          <p class="section-subtitle" *ngIf="patientId > 0">Edita datos clinicos, doctor asignado y genera el PDF final desde aqui.</p>
        </div>
        <button class="btn btn-primary" (click)="openAddModal()">+ Nuevo Historial</button>
      </div>

      <div class="no-print empty-state" *ngIf="records.length === 0">
        <p>No hay expedientes registrados{{ selectedPatientName ? ' para ' + selectedPatientName : '' }}.</p>
        <button class="btn btn-primary" (click)="openAddModal()">+ Crear expediente</button>
      </div>

      <div class="records-list no-print" *ngIf="records.length > 0">
        <table class="table">
          <thead>
            <tr>
              <th>Nombre</th>
              <th>Fecha Elaborada</th>
              <th>Fecha Citada</th>
              <th>Doctor</th>
              <th>Editar</th>
              <th>Ver</th>
              <th>Imprimir Receta</th>
            </tr>
          </thead>
          <tbody>
            <tr *ngFor="let record of records">
              <td>{{ record.patient_name }}</td>
              <td>{{ record.appointment_date | date:'dd-MM-yyyy' }}</td>
              <td>{{ record.appointment_date | date:'yyyy-MM-dd' }}</td>
              <td>{{ record.doctor_name }}</td>
              <td><button class="btn-icon-edit" title="Editar" (click)="editRecord(record)"><i class="fas fa-edit"></i></button></td>
              <td><button class="btn-icon-view" title="Ver" (click)="viewRecord(record)"><i class="fas fa-eye"></i></button></td>
              <td><button class="btn-icon-print" (click)="printPrescription(record)" title="Imprimir"><i class="fas fa-file-invoice"></i></button></td>
            </tr>
          </tbody>
        </table>
      </div>

      <div class="pdf-container" style="position: absolute; left: -9999px; top: 0; width: 0; height: 0; overflow: hidden;">
        <div id="prescription-pdf" class="prescription-pdf" *ngIf="recordToPrint">
          <div class="pdf-topbar">
            <div class="pdf-brand">
              <img src="logo.jpg" alt="Salud Sin Barreras" class="pdf-brand-logo">
              <div>
                <h1>Salud Sin Barreras</h1>
                <p>Telemedicina</p>
              </div>
            </div>
            <div class="pdf-badge">Expediente Clinico</div>
          </div>

          <div class="pdf-title-row">
            <div>
              <h2>{{ recordToPrint.patient_name }}</h2>
              <p>Doctor asignado: {{ recordToPrint.doctor_name || 'Sin asignar' }}</p>
            </div>
            <div class="pdf-date-block">
              <span>Fecha</span>
              <strong>{{ recordToPrint.appointment_date | date:'dd-MM-yyyy' }}</strong>
            </div>
          </div>

          <div class="pdf-grid">
            <div class="pdf-card">
              <h3>Datos del paciente</h3>
              <div class="pdf-field"><span>Nombre</span><strong>{{ recordToPrint.patient_name }}</strong></div>
              <div class="pdf-field"><span>Edad</span><strong>{{ recordToPrint.age || 'N/D' }} años</strong></div>
              <div class="pdf-field"><span>Peso</span><strong>{{ recordToPrint.weight }} kg</strong></div>
              <div class="pdf-field"><span>Talla</span><strong>{{ recordToPrint.height }} cm</strong></div>
            </div>

            <div class="pdf-card">
              <h3>Signos vitales</h3>
              <div class="pdf-field"><span>Frecuencia cardiaca</span><strong>{{ recordToPrint.heart_rate || 'N/D' }}</strong></div>
              <div class="pdf-field"><span>Temperatura</span><strong>{{ recordToPrint.temperature || 'N/D' }}</strong></div>
              <div class="pdf-field"><span>Doctor</span><strong>{{ recordToPrint.doctor_name || 'Sin asignar' }}</strong></div>
            </div>
          </div>

          <div class="pdf-card pdf-main-text">
            <h3>Notas del expediente / Receta</h3>
            <p>{{ recordToPrint.prescription }}</p>
          </div>

          <div class="pdf-footer">
            <div>
              <strong>Salud Sin Barreras</strong>
              <p>Expediente generado automaticamente</p>
            </div>
            <div class="footer-right">
              <strong>Confidencial</strong>
              <p>Uso exclusivo clinico</p>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="modal-overlay" *ngIf="showModal" (click)="closeModal()">
      <div class="modal-content" (click)="$event.stopPropagation()">
        <div class="modal-header">
          <h3>{{ editingRecordId ? 'Editar Expediente' : 'Nuevo Expediente' }}</h3>
          <button class="close-btn" (click)="closeModal()">×</button>
        </div>

        <form [formGroup]="recordForm" (ngSubmit)="saveRecord()">
          <div class="form-row" *ngIf="patientId === 0">
            <div class="form-group flex-1">
              <label>Paciente <span style="color:red">*</span></label>
              <select class="form-control" formControlName="patient_id" [class.is-invalid]="recordForm.get('patient_id')?.invalid && recordForm.get('patient_id')?.touched">
                <option value="">Seleccione paciente</option>
                <option *ngFor="let p of allPatients" [value]="p.id">{{ p.full_name }}</option>
              </select>
              <small class="text-danger" *ngIf="recordForm.get('patient_id')?.invalid && recordForm.get('patient_id')?.touched">Seleccione un paciente.</small>
            </div>
          </div>

          <div class="form-row">
            <div class="form-group flex-1">
              <label>Doctor asignado <span style="color:red">*</span></label>
              <select class="form-control" formControlName="doctor_id" [class.is-invalid]="recordForm.get('doctor_id')?.invalid && recordForm.get('doctor_id')?.touched">
                <option value="">Seleccione doctor</option>
                <option *ngFor="let doctor of doctors" [value]="doctor.id">{{ doctor.username }}</option>
              </select>
              <small class="text-danger" *ngIf="recordForm.get('doctor_id')?.invalid && recordForm.get('doctor_id')?.touched">Seleccione un doctor.</small>
            </div>
            <div class="form-group flex-1">
              <label>Fecha de atención <span style="color:red">*</span></label>
              <input formControlName="appointment_date" type="date" class="form-control" [class.is-invalid]="recordForm.get('appointment_date')?.invalid && recordForm.get('appointment_date')?.touched">
              <small class="text-danger" *ngIf="recordForm.get('appointment_date')?.invalid && recordForm.get('appointment_date')?.touched">Requerido.</small>
            </div>
          </div>

          <div class="form-row">
            <div class="form-group flex-1">
              <label>Peso (kg) <span style="color:red">*</span></label>
              <input formControlName="weight" type="number" step="0.1" class="form-control" placeholder="Escribe el peso" [class.is-invalid]="recordForm.get('weight')?.invalid && recordForm.get('weight')?.touched">
              <small class="text-danger" *ngIf="recordForm.get('weight')?.invalid && recordForm.get('weight')?.touched">Requerido.</small>
            </div>
            <div class="form-group flex-1">
              <label>Talla (cm) <span style="color:red">*</span></label>
              <input formControlName="height" type="number" step="0.1" class="form-control" placeholder="Escribe la talla" [class.is-invalid]="recordForm.get('height')?.invalid && recordForm.get('height')?.touched">
              <small class="text-danger" *ngIf="recordForm.get('height')?.invalid && recordForm.get('height')?.touched">Requerido.</small>
            </div>
          </div>

            <div class="form-row">
            <div class="form-group flex-1">
              <label>Frecuencia cardiaca</label>
              <input formControlName="heart_rate" type="text" class="form-control" placeholder="Escribe la frecuencia cardiaca">
            </div>
            <div class="form-group flex-1">
              <label>Temperatura</label>
              <input formControlName="temperature" type="text" class="form-control" placeholder="Escribe la temperatura">
            </div>
          </div>

          <div class="form-group">
            <label>Notas / Receta <span style="color:red">*</span></label>
            <textarea formControlName="prescription" rows="6" class="form-control" [class.is-invalid]="recordForm.get('prescription')?.invalid && recordForm.get('prescription')?.touched" placeholder="Escribe aquí la evolución, indicaciones o receta..."></textarea>
            <small class="text-danger" *ngIf="recordForm.get('prescription')?.invalid && recordForm.get('prescription')?.touched">Requerido.</small>
          </div>

          <div class="modal-footer">
            <button type="button" class="btn btn-secondary" (click)="closeModal()">Cancelar</button>
            <button type="submit" class="btn btn-success" [disabled]="recordForm.invalid">Guardar</button>
          </div>
        </form>
      </div>
    </div>
  `,
  styles: [`
    .records-container { background: #fdfdfd; padding: 20px; }
    .header-actions { display: flex; justify-content: space-between; align-items: flex-start; gap: 12px; margin-bottom: 18px; }
    .header-actions h2 { color: #4b65c2; font-weight: 600; margin: 0; font-size: 26px; }
    .section-subtitle { margin: 6px 0 0 0; color: #76839a; font-size: 13px; }
    .empty-state { padding: 28px 0; color: #6d7b8a; }
    .table { width: 100%; border-collapse: collapse; background: white; box-shadow: 0 1px 3px rgba(0,0,0,0.05); }
    .table th { background: #7e57c2; color: white; padding: 15px 12px; text-align: left; font-weight: 600; }
    .table td { padding: 15px 12px; border-bottom: 1px solid #f0f0f0; color: #555; vertical-align: middle; }
    .btn { padding: 10px 16px; border: none; border-radius: 6px; cursor: pointer; color: white; transition: all 0.2s; font-weight: 600; }
    .btn-primary { background: #1976d2; }
    .btn-success { background: #26a69a; }
    .btn-secondary { background: #95a5a6; }
    .btn-icon-edit, .btn-icon-view, .btn-icon-print { background: none; border: none; cursor: pointer; font-size: 1.2rem; margin-right: 8px; }
    .btn-icon-edit { color: #ffb74d; }
    .btn-icon-view { color: #26a69a; }
    .btn-icon-print { color: #7e57c2; }

    .modal-overlay { position: fixed; inset: 0; background: rgba(0,0,0,0.5); display: flex; justify-content: center; align-items: center; z-index: 1000; }
    .modal-content { background: white; padding: 24px; border-radius: 14px; width: 760px; max-width: 94%; max-height: 90vh; overflow-y: auto; box-shadow: 0 20px 50px rgba(0,0,0,0.2); }
    .modal-header { display: flex; justify-content: space-between; align-items: center; border-bottom: 1px solid #eee; padding-bottom: 12px; margin-bottom: 20px; }
    .modal-header h3 { margin: 0; color: #23324b; font-weight: 700; }
    .close-btn { background: none; border: none; font-size: 1.6rem; cursor: pointer; color: #999; }
    .form-control { width: 100%; padding: 11px 12px; border: 1px solid #d8dee8; border-radius: 8px; box-sizing: border-box; background: #fff; }
    .form-control:focus { outline: none; border-color: #26a69a; box-shadow: 0 0 0 3px rgba(38,166,154,0.12); }
    .form-group { margin-bottom: 18px; }
    .form-group label { display: block; margin-bottom: 8px; color: #64748b; font-size: 13px; font-weight: 600; }
    .form-row { display: flex; gap: 18px; margin-bottom: 4px; }
    .flex-1 { flex: 1; }
    .text-danger { color: #d32f2f; font-size: 12px; display: block; margin-top: 5px; }
    .is-invalid { border-color: #d32f2f !important; }
    .modal-footer { margin-top: 10px; display: flex; justify-content: flex-end; gap: 10px; }

    .prescription-pdf { width: 1120px; min-height: 1580px; background: linear-gradient(180deg, #ffffff 0%, #fbfcff 100%); padding: 54px; box-sizing: border-box; font-family: 'Georgia', serif; color: #22324a; }
    .pdf-topbar { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 26px; }
    .pdf-brand { display: flex; align-items: center; gap: 14px; }
    .pdf-brand-logo { width: 72px; height: 72px; object-fit: contain; }
    .pdf-brand h1 { margin: 0; font-size: 26px; color: #153a6b; }
    .pdf-brand p { margin: 2px 0 0 0; color: #5c6f87; font-size: 14px; }
    .pdf-badge { background: #e8f1ff; color: #1b4f91; padding: 10px 16px; border-radius: 999px; font-weight: 700; letter-spacing: 0.3px; }
    .pdf-title-row { display: flex; justify-content: space-between; align-items: flex-end; border-top: 3px solid #153a6b; border-bottom: 1px solid #dbe3ef; padding: 18px 0; margin-bottom: 20px; }
    .pdf-title-row h2 { margin: 0; font-size: 28px; color: #153a6b; }
    .pdf-title-row p { margin: 6px 0 0 0; color: #5f6c80; font-size: 15px; }
    .pdf-date-block { text-align: right; }
    .pdf-date-block span { display: block; color: #6e7f95; font-size: 12px; text-transform: uppercase; letter-spacing: 0.8px; }
    .pdf-date-block strong { font-size: 18px; color: #153a6b; }
    .pdf-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 18px; margin-bottom: 18px; }
    .pdf-card { background: #ffffff; border: 1px solid #e2e8f3; border-radius: 16px; padding: 20px 22px; box-shadow: 0 8px 28px rgba(21, 58, 107, 0.06); }
    .pdf-card h3 { margin: 0 0 16px 0; color: #153a6b; font-size: 18px; }
    .pdf-field { display: flex; justify-content: space-between; gap: 16px; padding: 8px 0; border-bottom: 1px dashed #edf2f8; }
    .pdf-field:last-child { border-bottom: none; }
    .pdf-field span { color: #74839a; }
    .pdf-field strong { color: #22324a; text-align: right; }
    .pdf-main-text p { white-space: pre-wrap; line-height: 1.6; margin: 0; color: #22324a; font-size: 16px; }
    .pdf-footer { display: flex; justify-content: space-between; margin-top: 34px; padding-top: 18px; border-top: 1px solid #dbe3ef; color: #5c6f87; font-size: 13px; }
    .pdf-footer strong { color: #153a6b; }
    .footer-right { text-align: right; }

    .no-print { padding: 10px 0; }
    .mt-3 { margin-top: 20px; }

    @media (max-width: 900px) {
      .form-row, .pdf-grid, .pdf-topbar, .pdf-title-row, .pdf-footer { flex-direction: column; }
      .modal-content { width: 100%; }
    }
  `]
})
export class MedicalRecordsComponent implements OnInit {
  records: any[] = [];
  allPatients: any[] = [];
  doctors: any[] = [];
  patientId = 0;
  selectedPatientName = '';
  showModal = false;
  editingRecordId: number | null = null;
  recordForm: FormGroup;
  recordToPrint: any = null;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private api: ApiService,
    private fb: FormBuilder
  ) {
    this.recordForm = this.fb.group({
      patient_id: ['', Validators.required],
      doctor_id: ['', Validators.required],
      appointment_date: ['', Validators.required],
      weight: ['', Validators.required],
      height: ['', Validators.required],
      heart_rate: [''],
      temperature: [''],
      prescription: ['', Validators.required]
    });
  }

  ngOnInit() {
    this.route.params.subscribe(params => {
      this.patientId = params['id'] ? +params['id'] : 0;
      this.selectedPatientName = this.route.snapshot.queryParamMap.get('patient') || '';
      this.loadDoctors();
      this.loadPatients();
      this.loadRecords();

      if (this.patientId > 0) {
        this.recordForm.patchValue({ patient_id: this.patientId });
      }

      const shouldCreate = this.route.snapshot.queryParamMap.get('create');
      if (this.patientId > 0 && shouldCreate === '1') {
        this.openAddModal();
      }
    });
  }

  loadPatients() {
    this.api.getPatients().subscribe(res => {
      if (res.success) {
        this.allPatients = res.data;
      }
    });
  }

  loadDoctors() {
    this.api.getDoctors().subscribe(res => {
      if (res.success) {
        this.doctors = res.data;
        if (this.doctors.length > 0 && !this.recordForm.value.doctor_id) {
          this.recordForm.patchValue({ doctor_id: this.doctors[0].id });
        }
      }
    });
  }

  loadRecords() {
    this.api.getRecords(this.patientId).subscribe(res => {
      if (res.success && Array.isArray(res.data)) {
        this.records = res.data;
        if (!this.selectedPatientName && this.records.length > 0) {
          this.selectedPatientName = this.records[0].patient_name || '';
        }
      } else {
        this.records = [];
      }
    });
  }

  openAddModal() {
    this.editingRecordId = null;
    const defaultDoctorId = this.doctors.length > 0 ? this.doctors[0].id : '';
    this.recordForm.reset({
      patient_id: this.patientId > 0 ? this.patientId : '',
      doctor_id: defaultDoctorId,
      appointment_date: this.getTodayDate(),
      weight: '',
      height: '',
      heart_rate: '',
      temperature: '',
      prescription: ''
    });
    this.showModal = true;
  }

  editRecord(record: any) {
    this.editingRecordId = record.id;
    this.recordForm.reset({
      patient_id: record.patient_id,
      doctor_id: record.doctor_id,
      appointment_date: record.appointment_date,
      weight: record.weight,
      height: record.height,
      heart_rate: record.heart_rate,
      temperature: record.temperature,
      prescription: record.prescription
    });
    this.showModal = true;
  }

  viewRecord(record: any) {
    if (this.patientId === 0) {
      this.router.navigate(['/dashboard/medical-records', record.patient_id], {
        queryParams: { patient: record.patient_name }
      });
      return;
    }

    this.editRecord(record);
  }

  closeModal() {
    this.showModal = false;
  }

  saveRecord() {
    if (this.recordForm.invalid) {
      this.recordForm.markAllAsTouched();
      return;
    }

    const payload = {
      id: this.editingRecordId,
      patient_id: this.patientId > 0 ? this.patientId : Number(this.recordForm.value.patient_id),
      doctor_id: Number(this.recordForm.value.doctor_id),
      appointment_date: this.recordForm.value.appointment_date,
      weight: this.recordForm.value.weight,
      height: this.recordForm.value.height,
      heart_rate: this.recordForm.value.heart_rate,
      temperature: this.recordForm.value.temperature,
      prescription: this.recordForm.value.prescription
    };

    const request$ = this.editingRecordId ? this.api.updateRecord(payload) : this.api.addRecord(payload);

    request$.subscribe({
      next: (res) => {
        if (res.success) {
          this.loadRecords();
          this.closeModal();
        } else {
          alert(res.message || 'No se pudo guardar el expediente');
        }
      },
      error: () => {
        alert('Error de conexion al guardar el expediente');
      }
    });
  }

  printPrescription(record: any) {
    this.recordToPrint = record;
    setTimeout(async () => {
      const element = document.getElementById('prescription-pdf');
      if (element) {
        try {
          const canvas = await html2canvas(element, { scale: 2, useCORS: true, backgroundColor: '#ffffff' });
          const imgData = canvas.toDataURL('image/jpeg', 1.0);
          const pdf = new jsPDF('p', 'mm', 'a4');
          const pdfWidth = pdf.internal.pageSize.getWidth();
          const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
          pdf.addImage(imgData, 'JPEG', 0, 0, pdfWidth, pdfHeight);
          pdf.save(`Expediente_${record.patient_name}_${this.normalizeFileName(record.appointment_date)}.pdf`);
          this.recordToPrint = null;
        } catch (error) {
          console.error('Error generando PDF:', error);
          this.recordToPrint = null;
        }
      }
    }, 120);
  }

  getTodayDate(): string {
    const now = new Date();
    const month = `${now.getMonth() + 1}`.padStart(2, '0');
    const day = `${now.getDate()}`.padStart(2, '0');
    return `${now.getFullYear()}-${month}-${day}`;
  }

  normalizeFileName(value: string): string {
    return (value || '')
      .toString()
      .replace(/[^a-zA-Z0-9_-]+/g, '_')
      .replace(/^_+|_+$/g, '');
  }
}
