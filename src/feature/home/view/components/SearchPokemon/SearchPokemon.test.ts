import {describe, it, expect} from 'vitest'
import {mount} from '@vue/test-utils'
import SearchPokemon from './SearchPokemon.vue'

describe('SearchPokemon', () => {
  it('emite search con el nombre recortado al enviar el formulario', async () => {
    const wrapper = mount(SearchPokemon)

    await wrapper.find('input').setValue('  charizard  ')
    await wrapper.find('form').trigger('submit')

    expect(wrapper.emitted('search')).toEqual([['charizard']])
  })

  it('no emite nada al enviar el formulario vacío', async () => {
    const wrapper = mount(SearchPokemon)

    await wrapper.find('form').trigger('submit')

    expect(wrapper.emitted('search')).toBeFalsy()
  })

  it('emite search vacío al borrar el input, sin esperar el submit', async () => {
    const wrapper = mount(SearchPokemon)

    await wrapper.find('input').setValue('charizard')
    await wrapper.find('input').setValue('')

    expect(wrapper.emitted('search')).toEqual([['']])
  })

  it('precarga el input con el initialQuery recibido', () => {
    const wrapper = mount(SearchPokemon, {props: {initialQuery: 'charizard'}})

    expect((wrapper.find('input').element as HTMLInputElement).value).toBe('charizard')
  })

  it('sincroniza el input si el initialQuery cambia externamente', async () => {
    const wrapper = mount(SearchPokemon, {props: {initialQuery: 'charizard'}})

    await wrapper.setProps({initialQuery: ''})

    expect((wrapper.find('input').element as HTMLInputElement).value).toBe('')
  })
})
