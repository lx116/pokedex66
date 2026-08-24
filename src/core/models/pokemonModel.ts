export interface Pokemon {
    id: number;
    name: string;
    imageURL: string | null;
    types: string[];
    weight: number;
    height: number;
}