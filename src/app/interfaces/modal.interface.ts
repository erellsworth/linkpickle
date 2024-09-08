import { Type } from '@angular/core';

export interface PickleModalStyles {
  width?: string;
  height?: string;
}

export interface PickleModal<T = any> extends PickleModalStyles {
  componant: Type<any>;
  inputs?: T;
}
