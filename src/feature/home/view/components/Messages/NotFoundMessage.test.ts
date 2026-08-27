import {describe, it, expect} from 'vitest'
import {mount} from '@vue/test-utils'
import NotFoundMessage from './NotFoundMessage.vue'
import TypeChip from '../TypeChip/TypeChip.vue'

describe('NotFoundMessage', () => {
  it('muestra el mensaje genérico cuando no hay un desajuste de tipo', () => {
    const wrapper = mount(NotFoundMessage)

    expect(wrapper.text()).toContain('No se ha encontrado lo que buscabas.')
    expect(wrapper.findComponent(TypeChip).exists()).toBe(false)
  })

  it('muestra el nombre buscado, los tipos filtrados y sugiere los tipos reales como chips', () => {
    const wrapper = mount(NotFoundMessage, {
      props: {
        mismatch: {name: 'charizard', types: ['fire', 'flying']},
        searchedTypes: ['steel'],
      },
    })

    const text = wrapper.text()
    expect(text).toContain('charizard')
    expect(text).toContain('Acero')
    expect(text).toContain('Prueba buscando en:')

    const chipNames = wrapper.findAllComponents(TypeChip).map(c => c.props('type').name)
    expect(chipNames).toEqual(['fire', 'flying'])
  })
})
