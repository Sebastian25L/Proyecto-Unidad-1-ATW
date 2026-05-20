import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-modal',
  standalone: true,
  imports: [CommonModule],
  template: `
    @if (isOpen) {
      <div
        class="fixed inset-0 z-50 flex items-center justify-center p-4"
        (click)="onBackdropClick($event)"
      >
        <div class="absolute inset-0 bg-black/50 backdrop-blur-sm animate-fade-in"></div>

        <div
          class="relative bg-white rounded-2xl shadow-2xl w-full animate-fade-in"
          [ngClass]="sizeClass"
          (click)="$event.stopPropagation()"
        >
          <div class="flex items-center justify-between px-6 py-4 border-b border-slate-100">
            <h3 class="text-lg font-semibold text-slate-800">{{ title }}</h3>
            <button
              (click)="close.emit()"
              class="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
            >
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
              </svg>
            </button>
          </div>

          <div class="px-6 py-4">
            <ng-content></ng-content>
          </div>

          @if (showFooter) {
            <div class="flex items-center justify-end gap-3 px-6 py-4 border-t border-slate-100">
              <ng-content select="[footer]"></ng-content>
            </div>
          }
        </div>
      </div>
    }
  `,
})
export class ModalComponent {
  @Input() isOpen = false;
  @Input() title = '';
  @Input() size: 'sm' | 'md' | 'lg' | 'xl' = 'md';
  @Input() showFooter = true;
  @Input() closeOnBackdrop = true;
  @Output() close = new EventEmitter<void>();

  get sizeClass(): string {
    const map = {
      sm: 'max-w-sm',
      md: 'max-w-lg',
      lg: 'max-w-2xl',
      xl: 'max-w-4xl',
    };
    return map[this.size];
  }

  onBackdropClick(event: MouseEvent): void {
    if (this.closeOnBackdrop) {
      this.close.emit();
    }
  }
}
