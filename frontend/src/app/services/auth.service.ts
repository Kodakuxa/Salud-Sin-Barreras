import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { map } from 'rxjs/operators';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = 'http://localhost/salud_sin_barreras/login.php';
  private loggedIn = new BehaviorSubject<boolean>(false);

  constructor(private http: HttpClient, private router: Router) {
    if (localStorage.getItem('token')) {
      this.loggedIn.next(true);
    }
  }

  isLoggedIn(): Observable<boolean> {
    return this.loggedIn.asObservable();
  }

  login(email: string, password: string): Observable<any> {
    return this.http.post<any>(this.apiUrl, { email, password }).pipe(
      map(res => {
        if (res.success) {
          localStorage.setItem('token', res.token);
          if (res.user) localStorage.setItem('user', JSON.stringify(res.user));
          this.loggedIn.next(true);
        }
        return res;
      })
    );
  }

  register(userData: any): Observable<any> {
    return this.http.post<any>('http://localhost/salud_sin_barreras/register.php', userData);
  }

  updateProfile(profileData: { id: number; username: string; email: string; currentPassword?: string; newPassword?: string }): Observable<any> {
    return this.http.put<any>('http://localhost/salud_sin_barreras/usuario.php', profileData).pipe(
      map(res => {
        if (res.success && res.user) {
          localStorage.setItem('user', JSON.stringify(res.user));
        }
        return res;
      })
    );
  }

  getCurrentUser(): any {
    const userRaw = localStorage.getItem('user');
    return userRaw ? JSON.parse(userRaw) : null;
  }

  logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    this.loggedIn.next(false);
    this.router.navigate(['/login']);
  }
}
