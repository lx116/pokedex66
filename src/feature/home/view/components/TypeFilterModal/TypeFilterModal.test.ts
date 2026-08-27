import {describe, it, expect, beforeEach} from 'vitest'
import {mount} from '@vue/test-utils'
import {createPinia, setActivePinia} from 'pinia'
import TypeFilterModal from './TypeFilterModal.vue'
import {usePokemonStore} from '../../../store/usePokemonStore'
import {POKEMON_TYPES} from '@/core/models/typeMeta'

function checkboxFor(wrapper: ReturnType<typeof mount>, typeName: string) {
  const index = POKEMON_TYPES.findIndex(t => t.name === typeName)
  return wrapper.findAll('input[type="checkbox"]')[index]
}

function findButtonByText(wrapper: ReturnType<typeof mount>, text: string) {
  return wrapper.findAll('button').find(b => b.text().trim() === text)!
}

describe('TypeFilterModal', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
  })

  it('inicializa el borrador con la selección actual del store al abrirse', async () => {
    const store = usePokemonStore()
    store.selectedTypes = ['fire']

    const wrapper = mount(TypeFilterModal, {props: {open: false}})
    await wrapper.setProps({open: true})

    expect((checkboxFor(wrapper, 'fire').element as HTMLInputElement).checked).toBe(true)
    expect((checkboxFor(wrapper, 'water').element as HTMLInputElement).checked).toBe(false)
  })

  it('arma el borrador y lo emite al aplicar, sin tocar el store', async () => {
    const store = usePokemonStore()
    store.selectedTypes = []

    const wrapper = mount(TypeFilterModal, {props: {open: true}})

    await checkboxFor(wrapper, 'fire').setValue(true)
    await checkboxFor(wrapper, 'water').setValue(true)

    await findButtonByText(wrapper, 'Aplicar').trigger('click')

    expect(wrapper.emitted('apply')).toEqual([[['fire', 'water']]])
    expect(wrapper.emitted('close')).toBeTruthy()
    expect(store.selectedTypes).toEqual([])
  })

  it('cancelar cierra sin emitir ninguna selección', async () => {
    const wrapper = mount(TypeFilterModal, {props: {open: true}})

    await checkboxFor(wrapper, 'fire').setValue(true)
    await findButtonByText(wrapper, 'Cancelar').trigger('click')

    expect(wrapper.emitted('close')).toBeTruthy()
    expect(wrapper.emitted('apply')).toBeFalsy()
  })
})
