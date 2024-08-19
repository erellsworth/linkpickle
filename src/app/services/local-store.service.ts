import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class LocalStoreService {

  constructor() { }

  public setValue<T = any>(key: string, data: T): void {
    localStorage.setItem(key, JSON.stringify(data));
  }

  public getValue<T = any>(key: string, defaultValue?: T): T | false {
    const data = localStorage.getItem(key);

    if (data) {
      return JSON.parse(data);
    }

    return defaultValue !== undefined ? defaultValue : false;
  }
}
