import {Pokemon} from "../../models/pokemonModel";

interface PokemonDto {
    id: number;
    name: string;
    weight: number;
    height: number;
    sprites: {front_default:string|null};
    types: {type:{name:string}}[];
}

export function createPokemon(raw: PokemonDto): Pokemon {
    return {
        id: raw.id,
        name:raw.name,
        imageURL:raw.sprites.front_default,
        types: raw.types.map(t=> t.type.name),
        weight:raw.weight,
        height: raw.height,
    }
}