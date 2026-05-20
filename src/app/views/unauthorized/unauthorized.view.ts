import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-unauthorized-view',
  standalone: true,
  imports: [RouterLink],
  template: `
    <div class="min-h-screen bg-gradient-to-br from-[#0f2044] via-[#1a3260] to-[#0f2044] flex items-center justify-center p-4">
      <div class="text-center animate-fade-in">
        <div class="inline-flex items-center justify-center w-20 h-20 bg-red-500/20 rounded-full mb-6">
          <svg class="w-10 h-10 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"/>
          </svg>
        </div>
        <h1 class="text-4xl font-bold text-white mb-2">403</h1>
        <h2 class="text-xl font-semibold text-slate-300 mb-3">Acceso No Autorizado</h2>
        <p class="text-slate-400 text-sm mb-8 max-w-sm mx-auto">
          No tienes permisos para acceder a esta sección del sistema.
        </p>
        <a
          routerLink="/dashboard"
          class="inline-flex items-center gap-2 bg-[#c9a84c] text-white px-6 py-2.5 rounded-lg font-medium text-sm hover:bg-[#b8963e] transition-colors"
        >
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"/>
          </svg>
          Volver al Dashboard
        </a>
      </div>
    </div>
  `,
})
export class UnauthorizedView {}
