import rawStarters from "@/assets/json/starters.json";

export interface StarterMeta {
    id: number;
    name: string;
    spanishName: string;
    imageUrl: string;
}

export const STARTERS: StarterMeta[] = rawStarters.starters;
