export const POKEMON_ENDPOINTS = {
    list: '/pokemon',
    one: (pokemonName: string) => `/pokemon/${pokemonName}`,
}