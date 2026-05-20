import { Injectable, inject } from '@angular/core';
import { Router } from '@angular/router';
import { AuthStore } from '../stores/auth.store';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private authStore = inject(AuthStore);
  private router = inject(Router);

  get isAuthenticated() {
    return this.authStore.isAuthenticated;
  }

  get currentUser() {
    return this.authStore.currentUser;
  }

  login(usuario: string, password: string): boolean {
    return this.authStore.login(usuario, password);
  }

  logout(): void {
    this.authStore.logout();
    this.router.navigate(['/login']);
  }

  restoreSession(): void {
    this.authStore.restoreSession();
  }
}
