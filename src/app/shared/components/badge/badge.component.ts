import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

export type BadgeVariant = 'success' | 'warning' | 'danger' | 'info' | 'neutral' | 'gold';

@Component({
  selector: 'app-badge',
  standalone: true,
  imports: [CommonModule],
  template: `
    <span [ngClass]="classes" class="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium">
      @if (dot) {
        <span class="w-1.5 h-1.5 rounded-full" [ngClass]="dotClass"></span>
      }
      <ng-content></ng-content>
    </span>
  `,
})
export class BadgeComponent {
  @Input() variant: BadgeVariant = 'neutral';
  @Input() dot = false;

  get classes(): string {
    const map: Record<BadgeVariant, string> = {
      success: 'bg-emerald-100 text-emerald-700',
      warning: 'bg-amber-100 text-amber-700',
      danger:  'bg-red-100 text-red-700',
      info:    'bg-blue-100 text-blue-700',
      neutral: 'bg-slate-100 text-slate-600',
      gold:    'bg-amber-50 text-amber-700 border border-amber-200',
    };
    return map[this.variant];
  }

  get dotClass(): string {
    const map: Record<BadgeVariant, string> = {
      success: 'bg-emerald-500',
      warning: 'bg-amber-500',
      danger:  'bg-red-500',
      info:    'bg-blue-500',
      neutral: 'bg-slate-400',
      gold:    'bg-amber-500',
    };
    return map[this.variant];
  }
}
