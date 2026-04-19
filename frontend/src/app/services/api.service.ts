import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private apiUrl = 'http://localhost/salud_sin_barreras';
  private patientsChanged = new BehaviorSubject<number>(0);
  patientsChanged$ = this.patientsChanged.asObservable();

  constructor(private http: HttpClient) {}

  // Patients Methods
  getPatients(search: string = ''): Observable<any> {
    return this.http.get(`${this.apiUrl}/pacientes.php?search=${search}`);
  }

  addPatient(patient: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/pacientes.php`, patient);
  }

  registerUser(userData: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/register.php`, userData);
  }

  notifyPatientsChanged() {
    this.patientsChanged.next(Date.now());
  }

  updatePatient(patient: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/pacientes.php`, patient);
  }

  deletePatient(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/pacientes.php?id=${id}`);
  }

  getDoctors(): Observable<any> {
    return this.http.get(`${this.apiUrl}/doctores.php`);
  }

  // Medical Records Methods
  getRecords(patientId: number = 0): Observable<any> {
    const url = patientId > 0 ? `${this.apiUrl}/expedientes.php?patient_id=${patientId}` : `${this.apiUrl}/expedientes.php`;
    return this.http.get(url);
  }

  addRecord(record: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/expedientes.php`, record);
  }

  updateRecord(record: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/expedientes.php`, record);
  }
}
