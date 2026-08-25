export const POKEMON_ENDPOINTS = {
    list: '/pokemon',
    pokemonListByType: (type: string) => `/type/${type}`,
    one: (pokemonName: string) => `/pokemon/${pokemonName}`,
    species: (pokemonName: string) => `/pokemon-species/${pokemonName}`,
    ability: (abilityName: string) => `/ability/${abilityName}`,
}