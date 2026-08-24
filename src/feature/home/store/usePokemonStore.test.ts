import { describe, it, expect, vi, beforeEach } from 'vitest'
import { createPinia, setActivePinia, storeToRefs } from 'pinia'
import { usePokemonStore } from './usePokemonStore'
import api from '../../../core/api/api'

vi.mock('../../../core/api/api', () => ({
  default: {
    get: vi.fn(),
  },
}))

const mockedGet = vi.mocked(api.get)

const rawCharmander = {
  id: 4,
  name: 'charmander',
  weight: 85,
  height: 6,
  sprites: { front_default: 'charmander.png' },
  types: [{ type: { name: 'fire' } }],
}

const mappedCharmander = {
  id: 4,
  name: 'charmander',
  imageURL: 'charmander.png',
  types: ['fire'],
  weight: 85,
  height: 6,
}

const rawBulbasaur = {
  id: 1,
  name: 'bulbasaur',
  weight: 69,
  height: 7,
  sprites: { front_default: 'bulbasaur.png' },
  types: [{ type: { name: 'grass' } }],
}

const mappedBulbasaur = {
  id: 1,
  name: 'bulbasaur',
  imageURL: 'bulbasaur.png',
  types: ['grass'],
  weight: 69,
  height: 7,
}

const rawIvysaur = {
  id: 2,
  name: 'ivysaur',
  weight: 130,
  height: 10,
  sprites: { front_default: 'ivysaur.png' },
  types: [{ type: { name: 'grass' } }],
}

const mappedIvysaur = {
  id: 2,
  name: 'ivysaur',
  imageURL: 'ivysaur.png',
  types: ['grass'],
  weight: 130,
  height: 10,
}

describe('usePokemonStore', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    setActivePinia(createPinia())
  })

  describe('fetchAPokemon', () => {
    it('sets pokemon on success', async () => {
      mockedGet.mockResolvedValueOnce({ data: rawCharmander })

      const store = usePokemonStore()
      const { pokemon, loading, error } = storeToRefs(store)
      const promise = store.fetchAPokemon('charmander')

      expect(loading.value).toBe(true)

      await promise

      expect(pokemon.value).toEqual(mappedCharmander)
      expect(loading.value).toBe(false)
      expect(error.value).toBe(null)
    })

    it('sets error on failure', async () => {
      mockedGet.mockRejectedValueOnce(new Error('Network Error'))

      const store = usePokemonStore()
      const { pokemon, loading, error } = storeToRefs(store)
      await store.fetchAPokemon('charmander')

      expect(pokemon.value).toBe(null)
      expect(loading.value).toBe(false)
      expect(error.value).toBe('Network Error')
    })
  })

  describe('fetchAllPokemon', () => {
    it('sets pokemonList with mapped detail on success', async () => {
      mockedGet
        .mockResolvedValueOnce({ data: { results: [{ name: 'bulbasaur' }, { name: 'ivysaur' }] } })
        .mockResolvedValueOnce({ data: rawBulbasaur })
        .mockResolvedValueOnce({ data: rawIvysaur })

      const store = usePokemonStore()
      const { pokemonList, loading, error } = storeToRefs(store)
      await store.fetchAllPokemon()

      expect(pokemonList.value).toEqual([mappedBulbasaur, mappedIvysaur])
      expect(loading.value).toBe(false)
      expect(error.value).toBe(null)
    })

    it('sets error when the list call fails', async () => {
      mockedGet.mockRejectedValueOnce(new Error('Network Error'))

      const store = usePokemonStore()
      const { pokemonList, loading, error } = storeToRefs(store)
      await store.fetchAllPokemon()

      expect(pokemonList.value).toEqual([])
      expect(loading.value).toBe(false)
      expect(error.value).toBe('Network Error')
    })

    it('skips pokemons whose detail call fails and keeps the rest', async () => {
      mockedGet
        .mockResolvedValueOnce({ data: { results: [{ name: 'bulbasaur' }, { name: 'ivysaur' }] } })
        .mockRejectedValueOnce(new Error('Not Found'))
        .mockResolvedValueOnce({ data: rawIvysaur })

      const store = usePokemonStore()
      const { pokemonList, loading, error } = storeToRefs(store)
      await store.fetchAllPokemon()

      expect(pokemonList.value).toEqual([mappedIvysaur])
      expect(loading.value).toBe(false)
      expect(error.value).toBe(null)
    })
  })
})
