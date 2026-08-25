import {Pokemon} from "@/core/models/pokemonModel";

export interface PokemonDetail extends Pokemon {
    description: string;
    category: string;
    ability: string;
    genderRate: number;
    weaknesses: string[];
}
