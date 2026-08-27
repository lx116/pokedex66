import {describe, it, expect, vi, beforeEach, afterEach} from 'vitest'
import {shallowMount, flushPromises} from '@vue/test-utils'
import {createPinia, setActivePinia} from 'pinia'
import {nextTick} from 'vue'
import PokemonList from './PokemonList.vue'
import PokemonGrid from '@/components/PokemonGrid.vue'
import {usePokemonStore} from '../../../store/usePokemonStore'
import api from '@/core/api/api'

vi.mock('@/core/api/api', () => ({
  default: {
    get: vi.fn(),
  },
}))

const mockedGet = vi.mocked(api.get)

let defaultIntersecting = true

class FakeIntersectionObserver {
  static instances: FakeIntersectionObserver[] = []
  intersecting = defaultIntersecting
  private readonly callback: IntersectionObserverCallback

  constructor(callback: IntersectionObserverCallback) {
    this.callback = callback
    FakeIntersectionObserver.instances.push(this)
  }

  observe(target: Element) {
    this.callback(
        [{isIntersecting: this.intersecting, target} as IntersectionObserverEntry],
        this as unknown as IntersectionObserver,
    )
  }

  unobserve() {
  }

  disconnect() {
  }
}

const rawPikachu = {
  id: 25, name: 'pikachu', weight: 60, height: 4,
  sprites: {front_default: 'pikachu.png'}, types: [{type: {name: 'electric'}}],
}
const rawBulbasaur = {
  id: 1, name: 'bulbasaur', weight: 69, height: 7,
  sprites: {front_default: 'bulbasaur.png'}, types: [{type: {name: 'grass'}}],
}
const rawCharmander = {
  id: 4, name: 'charmander', weight: 85, height: 6,
  sprites: {front_default: 'charmander.png'}, types: [{type: {name: 'fire'}}],
}

/**
 * Deja el store en el estado real que tiene PokemonList cuando se monta:
 * una primera página ya cargada, con una segunda página todavía disponible.
 */
async function loadFirstPage() {
  const store = usePokemonStore()

  mockedGet
      .mockResolvedValueOnce({
        data: {results: [{name: 'pikachu', url: '.../25'}, {name: 'bulbasaur', url: '.../1'}], next: 'page2'},
      })
      .mockResolvedValueOnce({data: rawPikachu})
      .mockResolvedValueOnce({data: rawBulbasaur})

  vi.useFakeTimers()
  const promise = store.fetchAllPokemon()
  await vi.runAllTimersAsync()
  await promise
  vi.useRealTimers()

  return store
}

describe('PokemonList', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    setActivePinia(createPinia())
    vi.stubGlobal('IntersectionObserver', FakeIntersectionObserver)
    FakeIntersectionObserver.instances = []
    defaultIntersecting = true
  })

  afterEach(() => {
    vi.unstubAllGlobals()
  })

  it('muestra en el grid los pokemon ya cargados', async () => {
    const store = await loadFirstPage()
    defaultIntersecting = false

    const wrapper = shallowMount(PokemonList)
    await nextTick()
    await flushPromises()

    expect(wrapper.findComponent(PokemonGrid).props('pokemons')).toEqual(store.pokemonList)
  })

  it('sigue autocargando lotes mientras el sentinel permanece visible, hasta agotar los resultados', async () => {
    const store = await loadFirstPage()
    expect(store.hasMore).toBe(true)

    mockedGet
        .mockResolvedValueOnce({data: {results: [{name: 'charmander', url: '.../4'}], next: null}})
        .mockResolvedValueOnce({data: rawCharmander})

    const wrapper = shallowMount(PokemonList)

    await nextTick()
    await flushPromises()
    await flushPromises()
    await nextTick()

    expect(store.pokemonList).toHaveLength(3)
    expect(store.hasMore).toBe(false)
    expect(mockedGet).toHaveBeenCalledTimes(5)
    expect(wrapper.find('.h-4').exists()).toBe(false)
  })

  it('no dispara autocarga cuando el sentinel no está intersectando', async () => {
    const store = await loadFirstPage()
    defaultIntersecting = false

    shallowMount(PokemonList)
    await nextTick()
    await flushPromises()

    expect(store.pokemonList).toHaveLength(2)
    expect(mockedGet).toHaveBeenCalledTimes(3)
  })

  it('corta el auto-scroll si un lote falla, en vez de reintentar sin parar', async () => {
    const store = await loadFirstPage()
    expect(store.hasMore).toBe(true)

    mockedGet.mockRejectedValueOnce(new Error('Network Error'))

    shallowMount(PokemonList)

    await nextTick()
    await flushPromises()
    await flushPromises()
    await nextTick()

    expect(store.error).toBe('Network Error')
    expect(store.hasMore).toBe(true)
    expect(mockedGet).toHaveBeenCalledTimes(4)
  })
})
