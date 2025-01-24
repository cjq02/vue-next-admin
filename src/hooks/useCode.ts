export const useCode = () => {
  const extendMap = {
    IS_ACTIVE: {
      [Code.IS_ACTIVE._1]: { type: 'success' },
      [Code.IS_ACTIVE._0]: { type: 'danger' },
    },
  }

  return {
    extendMap,
  }
}
