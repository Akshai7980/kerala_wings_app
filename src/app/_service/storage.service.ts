import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage';

@Injectable({
  providedIn: 'root'
})
export class StorageService {

  constructor(
    public storage: Storage,
    ) { }

  async setStorage(key: string, value: any) {
    this.storage.set(key, value);
  }

  async getStorage(key: string) {
    await this.storage.get(key).then((val) => {
      console.log('Value From Storage:', val);
      return val;
    });
  }

  clearStorage() {
    this.storage.clear();
  }
}
