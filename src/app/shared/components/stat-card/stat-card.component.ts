import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-stat-card',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="bg-white rounded-xl border border-slate-200 shadow-sm p-6 hover:shadow-md transition-shadow duration-200">
      <div class="flex items-start justify-between">
        <div>
          <p class="text-sm font-medium text-slate-500 mb-1">{{ label }}</p>
          <p class="text-3xl font-bold text-slate-800">{{ value }}</p>
          @if (subtitle) {
            <p class="text-xs text-slate-400 mt-1">{{ subtitle }}</p>
          }
        </div>
        <div
          [ngClass]="iconBg"
          class="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0"
        >
          <ng-content></ng-content>
        </div>
      </div>
      @if (trend !== undefined) {
        <div class="mt-4 flex items-center gap-1 text-xs">
          @if (trend >= 0) {
            <svg class="w-3 h-3 text-emerald-500" fill="currentColor" viewBox="0 0 20 20">
              <path fill-rule="evenodd" d="M5.293 9.707a1 1 0 010-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 01-1.414 1.414L11 7.414V15a1 1 0 11-2 0V7.414L6.707 9.707a1 1 0 01-1.414 0z" clip-rule="evenodd"/>
            </svg>
            <span class="text-emerald-600 font-medium">+{{ trend }}%</span>
          } @else {
            <svg class="w-3 h-3 text-red-500" fill="currentColor" viewBox="0 0 20 20">
              <path fill-rule="evenodd" d="M14.707 10.293a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 111.414-1.414L9 12.586V5a1 1 0 012 0v7.586l2.293-2.293a1 1 0 011.414 0z" clip-rule="evenodd"/>
            </svg>
            <span class="text-red-600 font-medium">{{ trend }}%</span>
          }
          <span class="text-slate-400">vs mes anterior</span>
        </div>
      }
    </div>
  `,
})
export class StatCardComponent {
  @Input() label = '';
  @Input() value: string | number = '';
  @Input() subtitle = '';
  @Input() trend?: number;
  @Input() iconBg = 'bg-slate-100';
}
