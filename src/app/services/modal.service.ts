import { Component, Injectable, signal, Type } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class ModalService {
  public component = signal<Type<any> | null>(null);

  constructor() {}

  public show(component: Type<any>): void {
    this.component.set(component);
  }
}
