import { Component, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-login-view',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="p-8">
      <div class="mb-6">
        <h2 class="text-2xl font-bold text-slate-800">Iniciar Sesion</h2>
        <p class="text-slate-500 text-sm mt-1">Ingresa tus credenciales para continuar</p>
      </div>

      @if (errorMsg()) {
        <div class="mb-4 flex items-center gap-2 bg-red-50 border border-red-200 text-red-700 text-sm px-4 py-3 rounded-lg animate-fade-in">
          <svg class="w-4 h-4 shrink-0" fill="currentColor" viewBox="0 0 20 20">
            <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd"/>
          </svg>
          {{ errorMsg() }}
        </div>
      }

      <form (ngSubmit)="onSubmit()" #loginForm="ngForm" autocomplete="off" class="space-y-5">
        <div class="flex flex-col gap-1">
          <label class="text-sm font-medium text-slate-700">
            Usuario <span class="text-red-500">*</span>
          </label>
          <div class="relative">
            <span class="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                  d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/>
              </svg>
            </span>
            <input
              type="text"
              name="usuario"
              [(ngModel)]="usuario"
              required
              autocomplete="off"
              placeholder="Usuario"
              class="w-full pl-10 pr-3 py-2.5 text-sm bg-white border border-slate-300 rounded-lg outline-none focus:ring-2 focus:ring-[#0f2044] focus:border-transparent transition-all"
            />
          </div>
        </div>

        <div class="flex flex-col gap-1">
          <label class="text-sm font-medium text-slate-700">
            Contrasena <span class="text-red-500">*</span>
          </label>
          <div class="relative">
            <span class="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                  d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"/>
              </svg>
            </span>
            <input
              [type]="showPassword() ? 'text' : 'password'"
              name="password"
              [(ngModel)]="password"
              required
              autocomplete="new-password"
              placeholder="Contrasena"
              class="w-full pl-10 pr-10 py-2.5 text-sm bg-white border border-slate-300 rounded-lg outline-none focus:ring-2 focus:ring-[#0f2044] focus:border-transparent transition-all"
            />
            <button
              type="button"
              (click)="showPassword.set(!showPassword())"
              class="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
            >
              @if (showPassword()) {
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21"/>
                </svg>
              } @else {
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/>
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"/>
                </svg>
              }
            </button>
          </div>
        </div>

        <button
          type="submit"
          [disabled]="loading()"
          class="w-full flex items-center justify-center gap-2 bg-[#0f2044] text-white py-2.5 px-4 rounded-lg font-medium text-sm hover:bg-[#1a3260] focus:outline-none focus:ring-2 focus:ring-[#0f2044] focus:ring-offset-2 transition-all disabled:opacity-60 disabled:cursor-not-allowed"
        >
          @if (loading()) {
            <svg class="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"></path>
            </svg>
            Ingresando...
          } @else {
            Ingresar al sistema
          }
        </button>
      </form>
    </div>
  `,
})
export class LoginView {
  private authService = inject(AuthService);
  private router = inject(Router);

  usuario = '';
  password = '';
  loading = signal(false);
  errorMsg = signal('');
  showPassword = signal(false);

  onSubmit() {
    this.errorMsg.set('');
    if (!this.usuario || !this.password) {
      this.errorMsg.set('Por favor completa todos los campos.');
      return;
    }
    this.loading.set(true);
    setTimeout(() => {
      const ok = this.authService.login(this.usuario, this.password);
      this.loading.set(false);
      if (ok) {
        this.router.navigate(['/dashboard']);
      } else {
        this.errorMsg.set('Credenciales incorrectas. Intenta nuevamente.');
      }
    }, 800);
  }
}
