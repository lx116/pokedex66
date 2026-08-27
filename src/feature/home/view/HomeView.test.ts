import {describe, it, expect, vi, beforeEach, afterEach} from 'vitest'
import {mount, flushPromises} from '@vue/test-utils'
import {createPinia, setActivePinia} from 'pinia'
import {createRouter, createMemoryHistory, type Router} from 'vue-router'
import {nextTick} from 'vue'
import HomeView from './HomeView.vue'
import TypeFilterChips from './components/TypeFilterChips/TypeFilterChips.vue'
import TypeFilterModal from './components/TypeFilterModal/TypeFilterModal.vue'
import SearchPokemon from './components/SearchPokemon/SearchPokemon.vue'
import PokemonList from './components/PokemonList/PokemonList.vue'
import PokeballLoader from '@/components/PokeballLoading.vue'
import ErrorMessage from './components/Messages/ErrorMessage.vue'
import {usePokemonStore} from '../store/usePokemonStore'
import api from '@/core/api/api'

vi.mock('@/core/api/api', () => ({
  default: {
    get: vi.fn(),
  },
}))

const mockedGet = vi.mocked(api.get)

const stubs = {
  PokemonList: true,
  TypeFilterModal: true,
  PokeballLoader: true,
  TypeFilterChips: true,
  ErrorMessage: true,
}

async function createTestRouter(initialPath = '/') {
  const router = createRouter({
    history: createMemoryHistory(),
    routes: [{path: '/', component: HomeView}],
  })
  await router.push(initialPath)
  await router.isReady()
  return router
}

async function mountHome(router: Router) {
  const wrapper = mount(HomeView, {
    global: {plugins: [router], stubs},
  })

  await flushPromises()
  await flushPromises()

  wrapper.findComponent(PokeballLoader).vm.$emit('complete')
  await nextTick()

  return wrapper
}

function findButtonByText(wrapper: Awaited<ReturnType<typeof mountHome>>, text: string) {
  return wrapper.findAll('button').find(b => b.text().trim() === text)!
}

describe('HomeView - filtros y búsqueda', () => {
  let store: ReturnType<typeof usePokemonStore>

  beforeEach(() => {
    setActivePinia(createPinia())
    store = usePokemonStore()
    vi.spyOn(store, 'syncFromQuery').mockImplementation(async (query: string, types: string[]) => {
      store.selectedTypes = types
    })
  })

  it('carga inicial sin query dispara syncFromQuery con estado vacío', async () => {
    const router = await createTestRouter('/')
    await mountHome(router)

    expect(store.syncFromQuery).toHaveBeenCalledTimes(1)
    expect(store.syncFromQuery).toHaveBeenCalledWith('', [])
  })

  it('normaliza types en la URL: filtra inválidos, deduplica y ordena canónico', async () => {
    const router = await createTestRouter('/?types=water,invalid,fire,fire')
    await mountHome(router)

    expect(router.currentRoute.value.query.types).toBe('fire,water')
    expect(store.syncFromQuery).toHaveBeenCalledWith('', ['fire', 'water'])
  })

  it('togglear un chip agrega el tipo a la URL sin tocar q', async () => {
    const router = await createTestRouter('/?q=charizard')
    const wrapper = await mountHome(router)

    wrapper.findComponent(TypeFilterChips).vm.$emit('toggle-type', 'fire')
    await flushPromises()

    expect(router.currentRoute.value.query.q).toBe('charizard')
    expect(router.currentRoute.value.query.types).toBe('fire')
    expect(store.syncFromQuery).toHaveBeenLastCalledWith('charizard', ['fire'])
  })

  it('el modal aplica la selección final en orden canónico', async () => {
    const router = await createTestRouter('/')
    const wrapper = await mountHome(router)

    wrapper.findComponent(TypeFilterModal).vm.$emit('apply', ['water', 'electric'])
    await flushPromises()

    expect(router.currentRoute.value.query.types).toBe('electric,water')
    expect(store.syncFromQuery).toHaveBeenLastCalledWith('', ['electric', 'water'])
  })

  it('"Borrar filtros" limpia los tipos sin tocar la búsqueda activa', async () => {
    const router = await createTestRouter('/?q=charizard&types=fire,water')
    const wrapper = await mountHome(router)

    await findButtonByText(wrapper, 'Borrar filtros').trigger('click')
    await flushPromises()

    expect(router.currentRoute.value.query.q).toBe('charizard')
    expect(router.currentRoute.value.query.types).toBeUndefined()
    expect(store.syncFromQuery).toHaveBeenLastCalledWith('charizard', [])
  })

  it('buscar un pokemon agrega q a la URL sin borrar los tipos activos', async () => {
    const router = await createTestRouter('/?types=fire')
    const wrapper = await mountHome(router)

    wrapper.findComponent(SearchPokemon).vm.$emit('search', 'charizard')
    await flushPromises()

    expect(router.currentRoute.value.query.q).toBe('charizard')
    expect(router.currentRoute.value.query.types).toBe('fire')
    expect(store.syncFromQuery).toHaveBeenLastCalledWith('charizard', ['fire'])
  })

  it('vaciar el buscador saca q de la URL y conserva los tipos', async () => {
    const router = await createTestRouter('/?q=charizard&types=fire')
    const wrapper = await mountHome(router)

    wrapper.findComponent(SearchPokemon).vm.$emit('search', '')
    await flushPromises()

    expect(router.currentRoute.value.query.q).toBeUndefined()
    expect(router.currentRoute.value.query.types).toBe('fire')
    expect(store.syncFromQuery).toHaveBeenLastCalledWith('', ['fire'])
  })

  it('el buscador recibe el q inicial de la URL como prop', async () => {
    const router = await createTestRouter('/?q=charizard')
    const wrapper = await mountHome(router)

    expect(wrapper.findComponent(SearchPokemon).props('initialQuery')).toBe('charizard')
  })

  it('retry() de HomeView reconstruye desde la URL completa (q + types)', async () => {
    const router = await createTestRouter('/?q=charizard&types=fire')
    const wrapper = mount(HomeView, {global: {plugins: [router], stubs}})
    await flushPromises()
    await flushPromises()

    wrapper.findComponent(PokeballLoader).vm.$emit('error-complete')
    await nextTick()

    const errorMessage = wrapper.findComponent(ErrorMessage)
    expect(errorMessage.exists()).toBe(true)

    errorMessage.vm.$emit('retry')
    await flushPromises()

    expect(store.syncFromQuery).toHaveBeenLastCalledWith('charizard', ['fire'])
  })

  it('el retry emitido por PokemonList reconstruye desde la misma URL completa', async () => {
    const router = await createTestRouter('/?q=charizard&types=fire')
    const wrapper = await mountHome(router)

    wrapper.findComponent(PokemonList).vm.$emit('retry')
    await flushPromises()

    expect(store.syncFromQuery).toHaveBeenLastCalledWith('charizard', ['fire'])
  })

  it('"Ocultar/Mostrar filtros" esconde y vuelve a mostrar los chips', async () => {
    const router = await createTestRouter('/')
    const wrapper = await mountHome(router)

    expect(wrapper.findComponent(TypeFilterChips).exists()).toBe(true)

    await findButtonByText(wrapper, 'Ocultar filtros').trigger('click')
    expect(wrapper.findComponent(TypeFilterChips).exists()).toBe(false)

    await findButtonByText(wrapper, 'Mostrar filtros').trigger('click')
    expect(wrapper.findComponent(TypeFilterChips).exists()).toBe(true)
  })
})

/*
 * Estos tests NO mockean syncFromQuery: corren la implementación real
 * (con api.get mockeado) para probar el problema real reportado — llegar
 * directo de un link con ?q=&types= que no matchean se resolvía ANTES de
 * que PokemonList llegue a montarse, y su propio gate de carga (pensado
 * para reaccionar a una transición futura) nunca se enteraba.
 */
describe('HomeView - carga directa desde la URL (integración real)', () => {
  class NoopIntersectionObserver {
    observe() {}
    unobserve() {}
    disconnect() {}
  }

  const rawCharizard = {
    id: 6,
    name: 'charizard',
    weight: 905,
    height: 17,
    sprites: {front_default: 'charizard.png'},
    types: [{type: {name: 'fire'}}, {type: {name: 'flying'}}],
  }

  beforeEach(() => {
    setActivePinia(createPinia())
    vi.clearAllMocks()
    vi.stubGlobal('IntersectionObserver', NoopIntersectionObserver)
  })

  afterEach(() => {
    vi.useRealTimers()
    vi.unstubAllGlobals()
  })

  it('muestra el mensaje de desajuste al llegar directo con ?q= y ?types= que no coinciden', async () => {
    mockedGet.mockResolvedValueOnce({data: rawCharizard})

    const router = await createTestRouter('/?q=charizard&types=ghost')

    vi.useFakeTimers()

    const wrapper = mount(HomeView, {
      global: {
        plugins: [router],
        stubs: {TypeFilterChips: true, TypeFilterModal: true, ErrorMessage: true},
      },
    })

    await vi.runAllTimersAsync()
    await flushPromises()
    await vi.runAllTimersAsync()
    await flushPromises()

    expect(wrapper.text()).toContain('charizard')
    expect(wrapper.text()).toContain('Prueba buscando en:')
    expect(wrapper.findComponent(PokemonList).exists()).toBe(true)
  })
})
