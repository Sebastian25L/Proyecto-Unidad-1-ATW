import { Injectable, signal, computed } from '@angular/core';
import { User } from '../models/user.model';

const ADMIN_USER: User = {
  id: 1,
  nombre: 'admin123',
  email: 'admin123',
  rol: 'admin',
  activo: true,
};

@Injectable({ providedIn: 'root' })
export class AuthStore {
  private _currentUser = signal<User | null>(null);
  private _isLoading = signal(false);

  readonly currentUser = this._currentUser.asReadonly();
  readonly isLoading = this._isLoading.asReadonly();
  readonly isAuthenticated = computed(() => this._currentUser() !== null);
  readonly userRole = computed(() => this._currentUser()?.rol ?? null);
  readonly userName = computed(() => this._currentUser()?.nombre ?? '');

  login(usuario: string, password: string): boolean {
    this._isLoading.set(true);
    if (usuario === 'admin123' && password === 'admin123') {
      this._currentUser.set(ADMIN_USER);
      sessionStorage.setItem('hr_session', JSON.stringify(ADMIN_USER));
      this._isLoading.set(false);
      return true;
    }
    this._isLoading.set(false);
    return false;
  }

  logout(): void {
    this._currentUser.set(null);
    sessionStorage.removeItem('hr_session');
  }

  restoreSession(): void {
    const stored = sessionStorage.getItem('hr_session');
    if (stored) {
      try {
        this._currentUser.set(JSON.parse(stored));
      } catch {
        sessionStorage.removeItem('hr_session');
      }
    }
  }

  hasRole(role: string): boolean {
    return this._currentUser()?.rol === role;
  }
}
