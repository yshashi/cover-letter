import { Injectable } from '@angular/core';
import { CoverLetterData } from '../models/cover-letter';

export interface SavedProfile {
  id: string;
  name: string;
  data: CoverLetterData;
  createdAt: string;
  updatedAt: string;
}

@Injectable({
  providedIn: 'root',
})
export class StorageService {
  private readonly STORAGE_KEY = 'lp_coverletter_profiles';
  private readonly CURRENT_PROFILE_KEY = 'lp_coverletter_current_profile';
  private readonly AUTO_SAVE_KEY = 'lp_coverletter_autosave';

  saveProfile(name: string, data: CoverLetterData): SavedProfile {
    const profiles = this.getAllProfiles();
    const existingProfile = profiles.find((p) => p.name === name);

    if (existingProfile) {
      existingProfile.data = data;
      existingProfile.updatedAt = new Date().toISOString();
      this.saveAllProfiles(profiles);
      return existingProfile;
    } else {
      const newProfile: SavedProfile = {
        id: this.generateId(),
        name,
        data,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      profiles.push(newProfile);
      this.saveAllProfiles(profiles);
      return newProfile;
    }
  }

  getAllProfiles(): SavedProfile[] {
    try {
      const stored = localStorage.getItem(this.STORAGE_KEY);
      return stored ? JSON.parse(stored) : [];
    } catch (error) {
      console.error('Error loading profiles:', error);
      return [];
    }
  }

  getProfile(id: string): SavedProfile | null {
    const profiles = this.getAllProfiles();
    return profiles.find((p) => p.id === id) || null;
  }

  deleteProfile(id: string): void {
    const profiles = this.getAllProfiles().filter((p) => p.id !== id);
    this.saveAllProfiles(profiles);

    if (this.getCurrentProfileId() === id) {
      this.clearCurrentProfile();
    }
  }

  setCurrentProfile(id: string): void {
    localStorage.setItem(this.CURRENT_PROFILE_KEY, id);
  }

  getCurrentProfileId(): string | null {
    return localStorage.getItem(this.CURRENT_PROFILE_KEY);
  }

  clearCurrentProfile(): void {
    localStorage.removeItem(this.CURRENT_PROFILE_KEY);
  }

  autoSave(data: CoverLetterData, templateId?: string): void {
    try {
      const saveData = {
        data,
        templateId,
        timestamp: new Date().toISOString(),
      };
      localStorage.setItem(this.AUTO_SAVE_KEY, JSON.stringify(saveData));
    } catch (error) {
      console.error('Error auto-saving:', error);
    }
  }

  getAutoSave(): { data: CoverLetterData; templateId?: string } | null {
    try {
      const stored = localStorage.getItem(this.AUTO_SAVE_KEY);
      if (!stored) return null;

      const parsed = JSON.parse(stored);

      // Handle old format (just data) or new format (data + templateId)
      if (parsed.data) {
        return parsed;
      } else {
        return { data: parsed };
      }
    } catch (error) {
      console.error('Error loading auto-save:', error);
      return null;
    }
  }

  clearAutoSave(): void {
    localStorage.removeItem(this.AUTO_SAVE_KEY);
  }

  private saveAllProfiles(profiles: SavedProfile[]): void {
    try {
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(profiles));
    } catch (error) {
      console.error('Error saving profiles:', error);
    }
  }

  private generateId(): string {
    return `profile_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  exportProfiles(): string {
    return JSON.stringify(this.getAllProfiles(), null, 2);
  }

  importProfiles(jsonData: string): boolean {
    try {
      const profiles = JSON.parse(jsonData) as SavedProfile[];
      if (Array.isArray(profiles)) {
        this.saveAllProfiles(profiles);
        return true;
      }
      return false;
    } catch (error) {
      console.error('Error importing profiles:', error);
      return false;
    }
  }
}
