import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-auth-layout',
  standalone: true,
  imports: [RouterOutlet],
  template: `
    <div class="min-h-screen bg-gradient-to-br from-[#0f2044] via-[#1a3260] to-[#0f2044] flex items-center justify-center p-4">
      <div class="absolute inset-0 overflow-hidden pointer-events-none">
        <div class="absolute -top-40 -right-40 w-96 h-96 bg-[#c9a84c]/10 rounded-full blur-3xl"></div>
        <div class="absolute -bottom-40 -left-40 w-96 h-96 bg-[#c9a84c]/5 rounded-full blur-3xl"></div>
      </div>

      <div class="relative w-full max-w-md animate-fade-in">
        <div class="text-center mb-8">
          <div class="inline-flex items-center justify-center w-16 h-16 bg-[#c9a84c] rounded-2xl mb-4 shadow-lg">
            <svg class="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"/>
            </svg>
          </div>
          <h1 class="text-3xl font-bold text-white tracking-tight">HotelReservas</h1>
          <p class="text-slate-400 text-sm mt-1">Sistema de Gestion Hotelera</p>
        </div>

        <div class="bg-white rounded-2xl shadow-2xl overflow-hidden">
          <router-outlet></router-outlet>
        </div>

        <p class="text-center text-slate-500 text-xs mt-6">
          2026 HotelReservas. Todos los derechos reservados.
        </p>
      </div>
    </div>
  `,
})
export class AuthLayoutComponent {}
