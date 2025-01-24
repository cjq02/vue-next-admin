class BusinessError extends Error {
  constructor(m: string) {
    super(m)
    this.name = 'BusinessError'
  }
}

export function throwError(m: string): never {
  throw new BusinessError(`${m}`)
}
