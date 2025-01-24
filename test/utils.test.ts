import { describe, expect, it } from 'vitest'

import { isEmpty, isNotEmpty } from '@/utils/common'

describe('utils', () => {
  it('isEmpty', () => {
    expect(isEmpty('')).toBe(true)
    expect(isEmpty(null)).toBe(true)
    expect(isEmpty(undefined)).toBe(true)
    expect(isEmpty([])).toBe(true)
    expect(isEmpty({})).toBe(true)
    expect(isEmpty(0)).toBe(false)
    expect(isEmpty(new Date())).toBe(false)
  })

  it('isNotEmpty', () => {
    expect(isNotEmpty('aaa')).toBe(true)
  })
})
