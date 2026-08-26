import { Injectable, signal, effect, inject } from '@angular/core';
import { PersonalInfo } from '../models/cover-letter';
import { StorageService } from './storage';

const EMPTY_PERSONAL_INFO: PersonalInfo = {
  fullName: '',
  email: '',
  phone: '',
  address: '',
};

@Injectable({
  providedIn: 'root',
})
export class PersonalInfoService {
  private readonly storage = inject(StorageService);

  #data = signal<PersonalInfo>(EMPTY_PERSONAL_INFO);
  readonly data = this.#data.asReadonly();

  private isInitialized = false;

  constructor() {
    this.load();
    this.isInitialized = true;

    effect(() => {
      if (this.isInitialized) {
        this.storage.savePersonalInfo(this.#data());
      }
    });
  }

  private load(): void {
    const saved = this.storage.getPersonalInfo();
    if (saved) {
      this.#data.set(saved);
      return;
    }

    // Seed from pre-existing per-letter data so users don't have to retype anything.
    const legacy = this.storage.getLegacyPersonalInfoFromAutoSave();
    if (legacy) {
      this.#data.set(legacy);
    }
  }

  update(partial: Partial<PersonalInfo>): void {
    this.#data.update((current) => ({ ...current, ...partial }));
  }
}
