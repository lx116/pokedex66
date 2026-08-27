import {describe, it, expect, vi, beforeEach, afterEach} from 'vitest'
import {mount} from '@vue/test-utils'
import {nextTick} from 'vue'
import PokeballLoading from './PokeballLoading.vue'

describe('PokeballLoading', () => {
  beforeEach(() => {
    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('llega a notFound y emite not-found-complete cuando loading y notFound cambian en el mismo tick', async () => {
    const wrapper = mount(PokeballLoading, {props: {loading: true, error: false, notFound: false}})

    await wrapper.setProps({loading: false, notFound: true})
    await vi.runAllTimersAsync()

    expect(wrapper.emitted('notFoundComplete')).toBeTruthy()
  })

  it('regresión: si loading se apaga y notFound llega un tick después, se cuelga sin emitir nada', async () => {
    const wrapper = mount(PokeballLoading, {props: {loading: true, error: false, notFound: false}})

    await wrapper.setProps({loading: false})
    await nextTick()
    await wrapper.setProps({notFound: true})
    await vi.runAllTimersAsync()

    expect(wrapper.emitted('notFoundComplete')).toBeFalsy()
    expect(wrapper.emitted('complete')).toBeFalsy()
    expect(wrapper.emitted('errorComplete')).toBeFalsy()
  })

  it('llega a success y emite complete cuando termina sin error ni notFound', async () => {
    const wrapper = mount(PokeballLoading, {props: {loading: true, error: false, notFound: false}})

    await wrapper.setProps({loading: false})
    await vi.runAllTimersAsync()

    expect(wrapper.emitted('complete')).toBeTruthy()
  })
})
