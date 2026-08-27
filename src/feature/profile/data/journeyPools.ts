import rawPools from "./journeyPokemon.json";

export type Terrain = "grass" | "fire" | "water";
export type Rarity = "global" | "basic" | "special" | "legendary";

export const TERRAIN_ORDER: Terrain[] = ["grass", "fire", "water"];

export const MAX_TEAM_SIZE = 6;
export const ENCOUNTER_INTERVAL = 30_000;

export const RARITY_WEIGHT: Record<Rarity, number> = {
    global: 30,
    basic: 50,
    special: 17,
    legendary: 3,
};

interface TerrainPool {
    basic: number[];
    special: number[];
    legendary: number[];
}

const POOLS: Record<Terrain, TerrainPool> = rawPools as unknown as Record<Terrain, TerrainPool>;
const GLOBAL_POOL: number[] = rawPools.global;

export const LEGENDARY_IDS: Set<number> = new Set(
    TERRAIN_ORDER.flatMap(terrain => POOLS[terrain].legendary)
);

export function nextTerrain(current: Terrain): Terrain {
    const index = TERRAIN_ORDER.indexOf(current);
    return TERRAIN_ORDER[(index + 1) % TERRAIN_ORDER.length];
}

export function poolFor(terrain: Terrain): { id: number; rarity: Rarity }[] {
    const pool = POOLS[terrain];

    return [
        ...GLOBAL_POOL.map(id => ({id, rarity: "global" as const})),
        ...pool.basic.map(id => ({id, rarity: "basic" as const})),
        ...pool.special.map(id => ({id, rarity: "special" as const})),
        ...pool.legendary.map(id => ({id, rarity: "legendary" as const})),
    ];
}
