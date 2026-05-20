import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';

export type ButtonVariant = 'primary' | 'secondary' | 'danger' | 'ghost' | 'gold';
export type ButtonSize = 'sm' | 'md' | 'lg';

@Component({
  selector: 'app-button',
  standalone: true,
  imports: [CommonModule],
  template: `
    <button
      [type]="type"
      [disabled]="disabled || loading"
      [ngClass]="classes"
      (click)="onClick.emit($event)"
      class="inline-flex items-center justify-center gap-2 font-medium rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
    >
      @if (loading) {
        <svg class="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
          <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
          <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"></path>
        </svg>
      }
      <ng-content></ng-content>
    </button>
  `,
})
export class ButtonComponent {
  @Input() variant: ButtonVariant = 'primary';
  @Input() size: ButtonSize = 'md';
  @Input() type: 'button' | 'submit' | 'reset' = 'button';
  @Input() disabled = false;
  @Input() loading = false;
  @Output() onClick = new EventEmitter<MouseEvent>();

  get classes(): string {
    const variants: Record<ButtonVariant, string> = {
      primary:   'bg-[#0f2044] text-white hover:bg-[#1a3260] focus:ring-[#0f2044]',
      secondary: 'bg-white text-[#0f2044] border border-[#0f2044] hover:bg-slate-50 focus:ring-[#0f2044]',
      danger:    'bg-red-600 text-white hover:bg-red-700 focus:ring-red-500',
      ghost:     'bg-transparent text-slate-600 hover:bg-slate-100 focus:ring-slate-300',
      gold:      'bg-[#c9a84c] text-white hover:bg-[#b8963e] focus:ring-[#c9a84c]',
    };
    const sizes: Record<ButtonSize, string> = {
      sm: 'px-3 py-1.5 text-xs',
      md: 'px-4 py-2 text-sm',
      lg: 'px-6 py-3 text-base',
    };
    return `${variants[this.variant]} ${sizes[this.size]}`;
  }
}
