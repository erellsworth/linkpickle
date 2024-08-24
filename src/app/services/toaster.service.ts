import { Injectable, signal } from '@angular/core';
import { PickleToast } from '../interfaces/toaster.interface';
import { first, firstValueFrom, timer } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ToasterService {

  public toasts = signal<PickleToast[]>([]);

  private _duration = 4000; // 3 second default
  private _toastId = 0;

  constructor() { }

  public add(toast: PickleToast): void {
    this._toastId++;
    toast.id = this._toastId;
    toast.position = toast.position || 'top-right';
    toast.severity = toast.severity || 'info';
    this.toasts.update(toasts => {
      return [...toasts, toast];
    });

    if (!toast.sticky) {
      this.delayedDismiss(toast);
    }

    console.log('added', this.toasts());
  }

  public dismiss(id: number): void {
    this.toasts.update(toasts => toasts.filter(toast => toast.id !== id));
    console.log('dismissed', this.toasts());
  }

  private async delayedDismiss(toast: PickleToast): Promise<void> {
    if (!toast.id || toast.severity === 'error') { return; }
    const duration = toast.duration || this._duration;

    await firstValueFrom(timer(duration));

    this.dismiss(toast.id);

  }
}
