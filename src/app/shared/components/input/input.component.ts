import { Component, Input, forwardRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ControlValueAccessor, NG_VALUE_ACCESSOR, ReactiveFormsModule, FormsModule } from '@angular/forms';

@Component({
  selector: 'app-input',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => InputComponent),
      multi: true,
    },
  ],
  template: `
    <div class="flex flex-col gap-1">
      @if (label) {
        <label class="text-sm font-medium text-slate-700">
          {{ label }}
          @if (required) { <span class="text-red-500 ml-0.5">*</span> }
        </label>
      }
      <div class="relative">
        @if (prefixIcon) {
          <span class="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
            <ng-content select="[prefix]"></ng-content>
          </span>
        }
        <input
          [type]="type"
          [placeholder]="placeholder"
          [disabled]="isDisabled"
          [value]="value"
          (input)="onInput($event)"
          (blur)="onTouched()"
          [ngClass]="{
            'pl-10': prefixIcon,
            'border-red-400 focus:ring-red-400': error,
            'border-slate-300 focus:ring-[#0f2044]': !error
          }"
          class="w-full px-3 py-2 text-sm bg-white border rounded-lg outline-none focus:ring-2 focus:ring-offset-0 transition-all duration-200 disabled:bg-slate-50 disabled:text-slate-400"
        />
      </div>
      @if (error) {
        <p class="text-xs text-red-500">{{ error }}</p>
      }
      @if (hint && !error) {
        <p class="text-xs text-slate-400">{{ hint }}</p>
      }
    </div>
  `,
})
export class InputComponent implements ControlValueAccessor {
  @Input() label = '';
  @Input() type = 'text';
  @Input() placeholder = '';
  @Input() required = false;
  @Input() error = '';
  @Input() hint = '';
  @Input() prefixIcon = false;

  value = '';
  isDisabled = false;

  onChange: (v: string) => void = () => {};
  onTouched: () => void = () => {};

  writeValue(val: string): void {
    this.value = val ?? '';
  }

  registerOnChange(fn: (v: string) => void): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  setDisabledState(disabled: boolean): void {
    this.isDisabled = disabled;
  }

  onInput(event: Event): void {
    const val = (event.target as HTMLInputElement).value;
    this.value = val;
    this.onChange(val);
  }
}
