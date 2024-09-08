import { Injectable, signal, Type } from '@angular/core';
import { PickleModal } from '../interfaces/modal.interface';

@Injectable({
  providedIn: 'root',
})
export class ModalService {
  public modal = signal<PickleModal>({} as PickleModal);

  constructor() {}

  public show<T = any>(options: PickleModal<T>): void {
    this.modal.set(options);
  }
}
