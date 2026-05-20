import { Component, signal, inject } from '@angular/core';
import { RouterOutlet, RouterLink, RouterLinkActive } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../core/services/auth.service';

interface NavItem {
  label: string;
  icon: string;
  route: string;
  badge?: number;
}

@Component({
  selector: 'app-dashboard-layout',
  standalone: true,
  imports: [RouterOutlet, RouterLink, RouterLinkActive, CommonModule],
  template: `
    <div class="flex h-screen bg-slate-50 overflow-hidden">

      @if (sidebarOpen()) {
        <div
          class="fixed inset-0 z-20 bg-black/40 lg:hidden"
          (click)="sidebarOpen.set(false)"
        ></div>
      }

      <aside
        [class]="'fixed inset-y-0 left-0 z-30 w-64 bg-[#0f2044] flex flex-col transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:z-auto ' +
          (sidebarOpen() ? 'translate-x-0' : '-translate-x-full')"
      >
        <div class="flex items-center gap-3 px-6 py-5 border-b border-white/10">
          <div class="w-9 h-9 bg-[#c9a84c] rounded-xl flex items-center justify-center shrink-0">
            <svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"/>
            </svg>
          </div>
          <div>
            <h1 class="text-white font-bold text-sm leading-tight">HotelReservas</h1>
            <p class="text-slate-400 text-xs">Sistema de Gestion</p>
          </div>
        </div>

        <nav class="flex-1 px-3 py-4 overflow-y-auto">
          <p class="text-slate-500 text-xs font-semibold uppercase tracking-wider px-3 mb-2">Principal</p>

          @for (item of mainNav; track item.route) {
            <a
              [routerLink]="item.route"
              routerLinkActive="bg-white/10 text-white"
              [routerLinkActiveOptions]="{ exact: item.route === '/dashboard' }"
              (click)="sidebarOpen.set(false)"
              class="flex items-center gap-3 px-3 py-2.5 rounded-lg text-slate-300 hover:bg-white/10 hover:text-white transition-all duration-150 mb-0.5 group"
            >
              <span class="w-5 h-5 shrink-0" [innerHTML]="item.icon"></span>
              <span class="text-sm font-medium">{{ item.label }}</span>
              @if (item.badge) {
                <span class="ml-auto bg-[#c9a84c] text-white text-xs font-bold px-1.5 py-0.5 rounded-full">
                  {{ item.badge }}
                </span>
              }
            </a>
          }

          <p class="text-slate-500 text-xs font-semibold uppercase tracking-wider px-3 mt-5 mb-2">Gestion</p>

          @for (item of gestionNav; track item.route) {
            <a
              [routerLink]="item.route"
              routerLinkActive="bg-white/10 text-white"
              (click)="sidebarOpen.set(false)"
              class="flex items-center gap-3 px-3 py-2.5 rounded-lg text-slate-300 hover:bg-white/10 hover:text-white transition-all duration-150 mb-0.5"
            >
              <span class="w-5 h-5 shrink-0" [innerHTML]="item.icon"></span>
              <span class="text-sm font-medium">{{ item.label }}</span>
            </a>
          }
        </nav>

        <div class="px-3 py-4 border-t border-white/10">
          <div class="flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-white/10 transition-colors cursor-pointer group">
            <div class="w-8 h-8 bg-[#c9a84c] rounded-full flex items-center justify-center shrink-0">
              <span class="text-white text-xs font-bold">{{ userInitial() }}</span>
            </div>
            <div class="flex-1 min-w-0">
              <p class="text-white text-xs font-medium truncate">{{ userName() }}</p>
              <p class="text-slate-400 text-xs truncate">Administrador</p>
            </div>
            <button
              (click)="logout()"
              title="Cerrar sesion"
              class="text-slate-400 hover:text-red-400 transition-colors opacity-0 group-hover:opacity-100"
            >
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                  d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"/>
              </svg>
            </button>
          </div>
        </div>
      </aside>

      <div class="flex-1 flex flex-col min-w-0 overflow-hidden">

        <header class="bg-white border-b border-slate-200 px-4 lg:px-6 py-3 flex items-center gap-4 shrink-0">
          <button
            (click)="sidebarOpen.set(!sidebarOpen())"
            class="lg:hidden p-2 rounded-lg text-slate-500 hover:bg-slate-100 transition-colors"
          >
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"/>
            </svg>
          </button>

          <div class="flex-1">
            <h2 class="text-base font-semibold text-slate-800">{{ pageTitle() }}</h2>
            <p class="text-xs text-slate-400 hidden sm:block">{{ currentDate }}</p>
          </div>

          <div class="flex items-center gap-2">
            <button class="relative p-2 rounded-lg text-slate-500 hover:bg-slate-100 transition-colors">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                  d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"/>
              </svg>
              <span class="absolute top-1.5 right-1.5 w-2 h-2 bg-[#c9a84c] rounded-full"></span>
            </button>

            <div class="w-8 h-8 bg-[#0f2044] rounded-full flex items-center justify-center">
              <span class="text-white text-xs font-bold">{{ userInitial() }}</span>
            </div>
          </div>
        </header>

        <main class="flex-1 overflow-y-auto p-4 lg:p-6">
          <router-outlet></router-outlet>
        </main>
      </div>
    </div>
  `,
})
export class DashboardLayoutComponent {
  private authService = inject(AuthService);

  sidebarOpen = signal(false);

  readonly mainNav: NavItem[] = [
    {
      label: 'Dashboard',
      route: '/dashboard',
      icon: `<svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"/></svg>`,
    },
    {
      label: 'Reservas',
      route: '/reservas',
      icon: `<svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"/></svg>`,
    },
    {
      label: 'Agenda',
      route: '/agenda',
      icon: `<svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"/></svg>`,
    },
  ];

  readonly gestionNav: NavItem[] = [
    {
      label: 'Clientes',
      route: '/clientes',
      icon: `<svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z"/></svg>`,
    },
    {
      label: 'Habitaciones',
      route: '/habitaciones',
      icon: `<svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"/></svg>`,
    },
  ];

  get currentDate(): string {
    return new Date().toLocaleDateString('es-PE', {
      weekday: 'long', year: 'numeric', month: 'long', day: 'numeric',
    });
  }

  pageTitle = signal('Dashboard');

  userName() {
    return this.authService.currentUser()?.nombre ?? 'Usuario';
  }

  userInitial() {
    return this.userName().charAt(0).toUpperCase();
  }

  logout() {
    this.authService.logout();
  }
}
