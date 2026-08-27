import {getPokemonByName} from "@/core/api/services/pokemonService";
import type {Pokemon} from "@/core/models/pokemonModel";

const cache = new Map<number, Pokemon>();

export async function getCachedPokemon(id: number): Promise<Pokemon> {
    const cached = cache.get(id);
    if (cached) return cached;

    const pokemon = await getPokemonByName(String(id));
    cache.set(id, pokemon);
    return pokemon;
}
