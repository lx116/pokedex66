const STORAGE_KEY = "pokedex66:onboarding_done";

export function isOnboardingDone(): boolean {
    return localStorage.getItem(STORAGE_KEY) === "true";
}

export function markOnboardingDone(): void {
    localStorage.setItem(STORAGE_KEY, "true");
}
