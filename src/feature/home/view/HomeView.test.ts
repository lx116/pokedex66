import {describe, it, expect, vi, beforeEach} from 'vitest'
import {mount, flushPromises} from '@vue/test-utils'
import {createPinia, setActivePinia} from 'pinia'
import {createRouter, createMemoryHistory, type Router} from 'vue-router'
import {nextTick} from 'vue'
import HomeView from './HomeView.vue'
import TypeFilterChips from './components/TypeFilterChips/TypeFilterChips.vue'
import TypeFilterModal from './components/TypeFilterModal/TypeFilterModal.vue'
import PokeballLoader from '@/components/PokeballLoading.vue'
import ErrorMessage from './components/Messages/ErrorMessage.vue'
import {usePokemonStore} from '../store/usePokemonStore'

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

describe('HomeView - filtros', () => {
  let store: ReturnType<typeof usePokemonStore>

  beforeEach(() => {
    setActivePinia(createPinia())
    store = usePokemonStore()
    vi.spyOn(store, 'applyTypeFilters').mockImplementation(async (types: string[]) => {
      store.selectedTypes = types
    })
  })

  it('carga inicial sin query dispara applyTypeFilters con selección vacía', async () => {
    const router = await createTestRouter('/')
    await mountHome(router)

    expect(store.applyTypeFilters).toHaveBeenCalledTimes(1)
    expect(store.applyTypeFilters).toHaveBeenCalledWith([])
  })

  it('normaliza la URL: filtra inválidos, deduplica y ordena en el orden canónico', async () => {
    const router = await createTestRouter('/?types=water,invalid,fire,fire')
    await mountHome(router)

    expect(router.currentRoute.value.query.types).toBe('fire,water')
    expect(store.applyTypeFilters).toHaveBeenCalledWith(['fire', 'water'])
  })

  it('togglear un chip agrega el tipo a la URL y aplica el filtro', async () => {
    const router = await createTestRouter('/')
    const wrapper = await mountHome(router)

    wrapper.findComponent(TypeFilterChips).vm.$emit('toggle-type', 'fire')
    await flushPromises()

    expect(router.currentRoute.value.query.types).toBe('fire')
    expect(store.applyTypeFilters).toHaveBeenLastCalledWith(['fire'])
  })

  it('togglear un chip ya seleccionado lo saca de la URL', async () => {
    const router = await createTestRouter('/?types=fire')
    const wrapper = await mountHome(router)

    wrapper.findComponent(TypeFilterChips).vm.$emit('toggle-type', 'fire')
    await flushPromises()

    expect(router.currentRoute.value.query.types).toBeUndefined()
    expect(store.applyTypeFilters).toHaveBeenLastCalledWith([])
  })

  it('el modal aplica la selección final en orden canónico', async () => {
    const router = await createTestRouter('/')
    const wrapper = await mountHome(router)

    wrapper.findComponent(TypeFilterModal).vm.$emit('apply', ['water', 'electric'])
    await flushPromises()

    expect(router.currentRoute.value.query.types).toBe('electric,water')
    expect(store.applyTypeFilters).toHaveBeenLastCalledWith(['electric', 'water'])
  })

  it('"Borrar filtros" limpia la selección', async () => {
    const router = await createTestRouter('/?types=fire,water')
    const wrapper = await mountHome(router)

    await findButtonByText(wrapper, 'Borrar filtros').trigger('click')
    await flushPromises()

    expect(router.currentRoute.value.query.types).toBeUndefined()
    expect(store.applyTypeFilters).toHaveBeenLastCalledWith([])
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

  it('retry() reaplica la selección de tipos activa en vez de resetear todo', async () => {
    const router = await createTestRouter('/?types=fire')
    const wrapper = mount(HomeView, {global: {plugins: [router], stubs}})
    await flushPromises()
    await flushPromises()

    expect(store.applyTypeFilters).toHaveBeenLastCalledWith(['fire'])

    wrapper.findComponent(PokeballLoader).vm.$emit('error-complete')
    await nextTick()

    const errorMessage = wrapper.findComponent(ErrorMessage)
    expect(errorMessage.exists()).toBe(true)

    errorMessage.vm.$emit('retry')
    await flushPromises()

    expect(store.applyTypeFilters).toHaveBeenLastCalledWith(['fire'])
  })
})
