import api from "@/core/api/api";
import {POKEMON_ENDPOINTS} from "@/core/api/ApiEndpoints";
import {createPokemon} from "@/core/api/dto/pokemonDto";
import {
    calculateWeaknesses,
    createPokemonDetail,
    extractAbilityName,
    extractPrimaryAbilitySlug,
    type AbilityDto,
    type TypeDamageRelationsDto,
} from "@/core/api/dto/pokemonDetailDto";
import {Pokemon} from "@/core/models/pokemonModel";
import {PokemonDetail} from "@/core/models/pokemonDetailModel";

export async function getPokemonByName(name: string): Promise<Pokemon> {
    const response = await api.get(POKEMON_ENDPOINTS.one(name));
    return createPokemon(response.data);
}

async function getAbilityDisplayName(abilitySlug: string): Promise<string> {
    const response = await api.get(POKEMON_ENDPOINTS.ability(abilitySlug));
    return extractAbilityName(response.data as AbilityDto, abilitySlug);
}

async function getWeaknesses(typeNames: string[]): Promise<string[]> {
    const relationsList = await Promise.all(
        typeNames.map(typeName =>
            api.get(POKEMON_ENDPOINTS.pokemonListByType(typeName))
                .then(response => response.data.damage_relations as TypeDamageRelationsDto)
        )
    );
    return calculateWeaknesses(relationsList);
}

export async function getPokemonDetailByName(name: string): Promise<PokemonDetail> {
    const [pokemonResponse, speciesResponse] = await Promise.all([
        api.get(POKEMON_ENDPOINTS.one(name)),
        api.get(POKEMON_ENDPOINTS.species(name)),
    ]);

    const base = createPokemon(pokemonResponse.data);
    const abilitySlug = extractPrimaryAbilitySlug(pokemonResponse.data.abilities);

    const [ability, weaknesses] = await Promise.all([
        getAbilityDisplayName(abilitySlug),
        getWeaknesses(base.types),
    ]);

    return createPokemonDetail(base, speciesResponse.data, ability, weaknesses);
}
