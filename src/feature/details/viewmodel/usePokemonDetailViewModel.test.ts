import {describe, it, expect, vi, beforeEach} from 'vitest'
import {usePokemonDetailViewModel} from './usePokemonDetailViewModel'
import {getPokemonDetailByName} from '@/core/api/services/pokemonService'

vi.mock('@/core/api/services/pokemonService', () => ({
  getPokemonDetailByName: vi.fn(),
}))

const mockedGetPokemonDetailByName = vi.mocked(getPokemonDetailByName)

const charmander = {
  id: 4,
  name: 'charmander',
  imageURL: 'charmander.png',
  types: ['fire'],
  weight: 85,
  height: 6,
  description: 'Spits fire.',
  category: 'Lizard',
  ability: 'Blaze',
  genderRate: 4,
  weaknesses: ['water'],
}

const bulbasaur = {
  id: 1,
  name: 'bulbasaur',
  imageURL: 'bulbasaur.png',
  types: ['grass'],
  weight: 69,
  height: 7,
  description: 'Seed on its back.',
  category: 'Seed',
  ability: 'Overgrow',
  genderRate: 1,
  weaknesses: ['fire'],
}

function makeNotFoundError() {
  return Object.assign(new Error('Request failed with status code 404'), {
    isAxiosError: true,
    response: {status: 404},
  })
}

describe('usePokemonDetailViewModel', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('starts with empty state', () => {
    const {pokemon, loading, error, notFound} = usePokemonDetailViewModel()

    expect(pokemon.value).toBe(null)
    expect(loading.value).toBe(false)
    expect(error.value).toBe(null)
    expect(notFound.value).toBe(false)
  })

  it('sets pokemon on success', async () => {
    mockedGetPokemonDetailByName.mockResolvedValueOnce(charmander)

    const {pokemon, loading, error, notFound, findPokemon} = usePokemonDetailViewModel()
    const promise = findPokemon('charmander')

    expect(loading.value).toBe(true)

    await promise

    expect(getPokemonDetailByName).toHaveBeenCalledWith('charmander')
    expect(pokemon.value).toEqual(charmander)
    expect(loading.value).toBe(false)
    expect(error.value).toBe(null)
    expect(notFound.value).toBe(false)
  })

  it('sets notFound on a 404 response', async () => {
    mockedGetPokemonDetailByName.mockRejectedValueOnce(makeNotFoundError())

    const {pokemon, loading, error, notFound, findPokemon} = usePokemonDetailViewModel()
    await findPokemon('unknown')

    expect(pokemon.value).toBe(null)
    expect(loading.value).toBe(false)
    expect(error.value).toBe(null)
    expect(notFound.value).toBe(true)
  })

  it('sets error message on a non-404 Error', async () => {
    mockedGetPokemonDetailByName.mockRejectedValueOnce(new Error('Network Error'))

    const {pokemon, loading, error, notFound, findPokemon} = usePokemonDetailViewModel()
    await findPokemon('charmander')

    expect(pokemon.value).toBe(null)
    expect(loading.value).toBe(false)
    expect(error.value).toBe('Network Error')
    expect(notFound.value).toBe(false)
  })

  it('stringifies a thrown non-Error value', async () => {
    mockedGetPokemonDetailByName.mockRejectedValueOnce('boom')

    const {error, findPokemon} = usePokemonDetailViewModel()
    await findPokemon('charmander')

    expect(error.value).toBe('boom')
  })

  it('resets pokemon, error and notFound before each new call', async () => {
    mockedGetPokemonDetailByName.mockRejectedValueOnce(makeNotFoundError())

    const {pokemon, notFound, findPokemon} = usePokemonDetailViewModel()
    await findPokemon('unknown')
    expect(notFound.value).toBe(true)

    mockedGetPokemonDetailByName.mockResolvedValueOnce(bulbasaur)
    await findPokemon('bulbasaur')

    expect(notFound.value).toBe(false)
    expect(pokemon.value).toEqual(bulbasaur)
  })
})
