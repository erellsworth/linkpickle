import { Injectable, signal } from '@angular/core';
import { PickleToast } from '../interfaces/toaster.interface';
import { first, firstValueFrom, timer } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ToasterService {
  public toasts = signal<PickleToast[]>([]);

  private _duration = 4000; // 3 second default
  private _toastId = 0;

  constructor() {}

  public add(toast: PickleToast): void {
    this._toastId++;

    const newToast: PickleToast = {
      ...{
        id: this._toastId,
        position: 'top-right',
        severity: 'info',
      },
      ...toast,
    };

    this.toasts.update((toasts) => {
      return [...toasts, newToast];
    });

    if (!toast.sticky) {
      this.delayedDismiss(toast);
    }
  }

  public dismiss(id: number): void {
    this.toasts.update((toasts) => toasts.filter((toast) => toast.id !== id));
    console.log('dismissed', this.toasts());
  }

  private async delayedDismiss(toast: PickleToast): Promise<void> {
    if (!toast.id || toast.severity === 'error') {
      return;
    }
    const duration = toast.duration || this._duration;

    await firstValueFrom(timer(duration));

    this.dismiss(toast.id);
  }
}
