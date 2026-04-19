import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { ApiService } from '../../services/api.service';

@Component({
  selector: 'app-doctors',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <div class="doctors-container">
      <div class="header-actions">
        <div>
          <h2>Doctores</h2>
          <p class="section-subtitle">Lista de doctores disponibles para asignar expedientes.</p>
        </div>
      </div>

      <div class="search-bar">
        <input type="text" [formControl]="searchControl" placeholder="Buscar por nombre de doctor..." (keyup.enter)="applyFilter()" />
        <button (click)="applyFilter()" class="btn btn-info">Buscar</button>
      </div>

      <div *ngIf="filteredDoctors.length === 0" class="empty-state">
        No hay doctores registrados.
      </div>

      <table class="table" *ngIf="filteredDoctors.length > 0">
        <thead>
          <tr>
            <th>#</th>
            <th>Nombre</th>
            <th>Correo electrónico</th>
            <th>Rol</th>
          </tr>
        </thead>
        <tbody>
          <tr *ngFor="let doctor of filteredDoctors; let i = index">
            <td>{{ i + 1 }}</td>
            <td>{{ doctor.username }}</td>
            <td>{{ doctor.email }}</td>
            <td>{{ doctor.role }}</td>
          </tr>
        </tbody>
      </table>
    </div>
  `,
  styles: [`
    .doctors-container { background: white; padding: 20px; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1); }
    .header-actions { display: flex; justify-content: space-between; align-items: flex-start; border-bottom: 2px solid #eee; padding-bottom: 15px; margin-bottom: 20px; }
    .header-actions h2 { margin: 0; color: #2f3f66; font-size: 26px; }
    .section-subtitle { margin: 6px 0 0 0; color: #708090; font-size: 13px; }
    .search-bar { display: flex; gap: 10px; margin-bottom: 20px; max-width: 420px; }
    .search-bar input { flex: 1; padding: 8px; border: 1px solid #ccc; border-radius: 4px; outline: none; }
    .table { width: 100%; border-collapse: collapse; }
    .table th { background: #5c6bc0; color: white; padding: 12px; text-align: left; }
    .table td { padding: 12px; border-bottom: 1px solid #eee; }
    .table tr:hover { background: #f9fafe; }
    .empty-state { padding: 18px 0; color: #6b7a8d; }
    .btn { padding: 8px 15px; border: none; border-radius: 4px; cursor: pointer; color: white; }
    .btn-info { background: #00bcd4; }
  `]
})
export class DoctorsComponent implements OnInit {
  doctors: any[] = [];
  filteredDoctors: any[] = [];
  searchControl: any;

  constructor(private api: ApiService, private fb: FormBuilder) {
    this.searchControl = this.fb.control('');
  }

  ngOnInit() {
    this.loadDoctors();
  }

  loadDoctors() {
    this.api.getDoctors().subscribe(res => {
      if (res.success) {
        this.doctors = res.data;
        this.filteredDoctors = [...this.doctors];
      }
    });
  }

  applyFilter() {
    const term = (this.searchControl.value || '').toString().trim().toLowerCase();
    if (!term) {
      this.filteredDoctors = [...this.doctors];
      return;
    }

    this.filteredDoctors = this.doctors.filter(d =>
      (d.username || '').toLowerCase().includes(term) ||
      (d.email || '').toLowerCase().includes(term)
    );
  }
}
