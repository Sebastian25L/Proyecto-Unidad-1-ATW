import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-card',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div
      [ngClass]="[
        'bg-white rounded-xl border border-slate-200 shadow-sm',
        hoverable ? 'hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 cursor-pointer' : '',
        padding ? 'p-6' : '',
        extraClass
      ]"
    >
      @if (title) {
        <div class="flex items-center justify-between mb-4">
          <h3 class="text-base font-semibold text-slate-800">{{ title }}</h3>
          <ng-content select="[card-actions]"></ng-content>
        </div>
      }
      <ng-content></ng-content>
    </div>
  `,
})
export class CardComponent {
  @Input() title = '';
  @Input() hoverable = false;
  @Input() padding = true;
  @Input() extraClass = '';
}
