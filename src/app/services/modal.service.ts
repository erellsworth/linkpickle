import { Injectable, signal, Type } from '@angular/core';
import { PickleModal } from '../interfaces/modal.interface';
import { ConfirmDialogComponent } from '../pickle-ui/confirm-dialog/confirm-dialog.component';
import { PickleConfirmation } from '../interfaces/confirm-options.interface';

@Injectable({
  providedIn: 'root',
})
export class ModalService {
  public modal = signal<PickleModal>({} as PickleModal);

  constructor() {}

  public show<T = any>(options: PickleModal<T>): void {
    this.modal.set(options);
  }

  public close(): void {
    if (this.modal().onClose) {
      (this.modal().onClose as () => void)();
    }

    this.modal.set({} as PickleModal);
  }

  public confirm(confirmOptions: PickleConfirmation): void {
    const inputs: PickleConfirmation = {
      ...{
        onCancel: () => {
          this.close();
        },
      },
      ...confirmOptions,
    };

    const modal: PickleModal = {
      componant: ConfirmDialogComponent,
      width: '25vw',
      inputs,
    };

    if (!this.modal().onClose && confirmOptions.onCancel) {
      modal.onClose = confirmOptions.onCancel;
    }

    this.modal.set(modal);
  }
}
