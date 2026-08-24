import { describe, it, expect, vi, beforeEach } from 'vitest'
import { usePokemonViewModel } from './usePokemonViewModel.js'
import api from '../../core/api/api.js'

vi.mock('../../core/api/api.js', () => ({
  default: {
    get: vi.fn(),
  },
}))

describe('usePokemonViewModel', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('fetchAPokemon', () => {
    it('sets pokemon on success', async () => {
      const mockPokemon = { name: 'charmander', sprites: { front_default: 'url' } }
      api.get.mockResolvedValueOnce({ data: mockPokemon })

      const { pokemon, loading, error, fetchAPokemon } = usePokemonViewModel()
      const promise = fetchAPokemon('charmander')

      expect(loading.value).toBe(true)

      await promise

      expect(pokemon.value).toEqual(mockPokemon)
      expect(loading.value).toBe(false)
      expect(error.value).toBe(null)
    })

    it('sets error on failure', async () => {
      api.get.mockRejectedValueOnce(new Error('Network Error'))

      const { pokemon, loading, error, fetchAPokemon } = usePokemonViewModel()
      await fetchAPokemon('charmander')

      expect(pokemon.value).toBe(null)
      expect(loading.value).toBe(false)
      expect(error.value).toBe('Network Error')
    })
  })

  describe('fetchAllPokemon', () => {
    it('sets pokemonList on success', async () => {
      const mockResults = [{ name: 'bulbasaur' }, { name: 'ivysaur' }]
      api.get.mockResolvedValueOnce({ data: { results: mockResults } })

      const { pokemonList, loading, error, fetchAllPokemon } = usePokemonViewModel()
      await fetchAllPokemon()

      expect(pokemonList.value).toEqual(mockResults)
      expect(loading.value).toBe(false)
      expect(error.value).toBe(null)
    })

    it('sets error on failure', async () => {
      api.get.mockRejectedValueOnce(new Error('Network Error'))

      const { pokemonList, loading, error, fetchAllPokemon } = usePokemonViewModel()
      await fetchAllPokemon()

      expect(pokemonList.value).toEqual([])
      expect(loading.value).toBe(false)
      expect(error.value).toBe('Network Error')
    })
  })
})
