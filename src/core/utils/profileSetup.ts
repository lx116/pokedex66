const STORAGE_KEY = "pokedex66:profile_setup";

export interface ProfileSetup {
    gender: "boy" | "girl";
    name: string;
    starterId: number;
}

export function isProfileSetupDone(): boolean {
    return localStorage.getItem(STORAGE_KEY) !== null;
}

export function saveProfileSetup(setup: ProfileSetup): void {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(setup));
}

export function getProfileSetup(): ProfileSetup | null {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : null;
}
