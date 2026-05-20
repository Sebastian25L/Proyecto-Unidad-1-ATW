import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-loader',
  standalone: true,
  imports: [CommonModule],
  template: `
    @if (fullScreen) {
      <div class="fixed inset-0 z-50 flex items-center justify-center bg-white/80 backdrop-blur-sm">
        <div class="flex flex-col items-center gap-3">
          <div class="w-10 h-10 border-4 border-slate-200 border-t-[#0f2044] rounded-full animate-spin"></div>
          @if (text) { <p class="text-sm text-slate-500">{{ text }}</p> }
        </div>
      </div>
    } @else {
      <div class="flex items-center justify-center py-12">
        <div class="flex flex-col items-center gap-3">
          <div [ngClass]="spinnerSize" class="border-4 border-slate-200 border-t-[#0f2044] rounded-full animate-spin"></div>
          @if (text) { <p class="text-sm text-slate-500">{{ text }}</p> }
        </div>
      </div>
    }
  `,
})
export class LoaderComponent {
  @Input() fullScreen = false;
  @Input() size: 'sm' | 'md' | 'lg' = 'md';
  @Input() text = '';

  get spinnerSize(): string {
    return { sm: 'w-6 h-6', md: 'w-8 h-8', lg: 'w-12 h-12' }[this.size];
  }
}
