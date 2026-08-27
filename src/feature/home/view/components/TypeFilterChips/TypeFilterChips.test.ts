import {describe, it, expect, vi, beforeEach} from 'vitest'
import {mount} from '@vue/test-utils'
import {createPinia, setActivePinia} from 'pinia'
import TypeFilterChips from './TypeFilterChips.vue'
import TypeChip from '../TypeChip/TypeChip.vue'
import {usePokemonStore} from '../../../store/usePokemonStore'

describe('TypeFilterChips', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
  })

  it('emite toggle-type con el nombre del tipo clickeado, sin llamar al store', () => {
    const store = usePokemonStore()
    const applySpy = vi.spyOn(store, 'applyTypeFilters')
    const toggleSpy = vi.spyOn(store, 'toggleTypeFilter')

    const wrapper = mount(TypeFilterChips)
    const fireChip = wrapper.findAllComponents(TypeChip).find(c => c.props('type').name === 'fire')!

    fireChip.vm.$emit('toggle')

    expect(wrapper.emitted('toggle-type')).toEqual([['fire']])
    expect(applySpy).not.toHaveBeenCalled()
    expect(toggleSpy).not.toHaveBeenCalled()
  })

  it('marca como selected los tipos que ya están aplicados en el store', () => {
    const store = usePokemonStore()
    store.selectedTypes = ['water']

    const wrapper = mount(TypeFilterChips)

    const waterChip = wrapper.findAllComponents(TypeChip).find(c => c.props('type').name === 'water')!
    const fireChip = wrapper.findAllComponents(TypeChip).find(c => c.props('type').name === 'fire')!

    expect(waterChip.props('selected')).toBe(true)
    expect(fireChip.props('selected')).toBe(false)
  })
})
