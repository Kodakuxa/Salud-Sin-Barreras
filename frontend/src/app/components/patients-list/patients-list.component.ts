import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { ApiService } from '../../services/api.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-patients-list',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <div class="patients-container">
      <div class="header-actions">
        <h2>Lista de Pacientes</h2>
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
            <th>Historial</th>
          </tr>
        </thead>
        <tbody>
          <tr *ngFor="let patient of patients; let i = index">
            <td>{{ i + 1 }}</td>
            <td>{{ patient.full_name | uppercase }}</td>
            <td>{{ patient.age }} años</td>
            <td>{{ patient.phone }}</td>
            <td>{{ patient.address }}</td>
            <td>
              <button class="btn-icon" (click)="viewRecords(patient.id, patient.full_name)" title="Ver historial">
                <i class="fas fa-eye" style="color:#26a69a"></i>
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  `,
  styles: [`
    .patients-container { background: white; padding: 20px; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1); }
    .header-actions { border-bottom: 2px solid #eee; padding-bottom: 15px; margin-bottom: 20px; }
    .search-bar { display: flex; gap: 10px; margin-bottom: 20px; max-width: 420px; }
    .search-bar input { flex: 1; padding: 8px; border: 1px solid #ccc; border-radius: 4px; outline: none; }
    .table { width: 100%; border-collapse: collapse; }
    .table th { background: #5c6bc0; color: white; padding: 12px; text-align: left; }
    .table td { padding: 12px; border-bottom: 1px solid #eee; }
    .table tr:hover { background: #f9fafe; }
    .btn { padding: 8px 15px; border: none; border-radius: 4px; cursor: pointer; color: white; }
    .btn-info { background: #00bcd4; }
    .btn-icon { background: none; border: none; cursor: pointer; font-size: 16px; }
  `]
})
export class PatientsListComponent implements OnInit {
  patients: any[] = [];
  searchControl: any;
  private patientsChangesSub?: Subscription;

  constructor(
    private api: ApiService,
    private fb: FormBuilder,
    private router: Router
  ) {
    this.searchControl = this.fb.control('');
  }

  ngOnInit() {
    this.loadPatients();
    this.patientsChangesSub = this.api.patientsChanged$.subscribe(() => {
      this.loadPatients();
    });
  }

  ngOnDestroy() {
    this.patientsChangesSub?.unsubscribe();
  }

  loadPatients() {
    this.api.getPatients(this.searchControl.value).subscribe(res => {
      if (res.success) {
        this.patients = res.data;
      }
    });
  }

  viewRecords(id: number, name: string) {
    this.router.navigate(['/dashboard/medical-records', id], {
      queryParams: { patient: name }
    });
  }
}
