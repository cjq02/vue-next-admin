import { describe, expect, it } from 'vitest'

import $filters from '@/filters'

describe('filters', () => {
  it('thousandSeparator', () => {
    expect($filters.thousandSeparator(1235.32)).toBe('1,235.32')
    expect($filters.thousandSeparator(1235.3254, { precision: 2 })).toBe('1,235.33')
    expect($filters.thousandSeparator(1235.5254, { isInt: true })).toBe('1,235')
    expect($filters.thousandSeparator(1235.5254, { isInt: true })).toBe('1,235')
    expect($filters.thousandSeparator(1235, { precision: 3 })).toBe('1,235.000')
    expect($filters.thousandSeparator(1235)).toBe('1,235.00')
  })
})
