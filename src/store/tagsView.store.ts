import { defineStore } from 'pinia'

const useTagsViewStore = defineStore('tagsView', {
  actions: {
    addCachedView(view) {
      this.$patch((state) => {
        if (state.cachedViews.includes(view.name)) {
          return
        }
        if (!view.meta.noCache) {
          state.cachedViews.push(view.name)
        }
      })
    },
    addView(view) {
      this.addVisitedView(view)
      this.addCachedView(view)
    },
    addVisitedView(view) {
      this.$patch((state) => {
        if (state.visitedViews.some((v) => v.path === view.path)) {
          return
        }
        state.visitedViews.push(
          Object.assign({}, view, {
            title: view.meta.title || 'no-name',
          }),
        )
      })
    },

    delAllCachedViews() {
      return new Promise((resolve) => {
        this.$patch((state) => {
          state.cachedViews = []
          resolve([...state.cachedViews])
        })
      })
    },
    async delAllViews() {
      const res = await Promise.all([this.delAllVisitedViews(), this.delAllCachedViews()])
      return { cachedViews: res[1], visitedViews: res[0] }
    },
    delAllVisitedViews() {
      return new Promise((resolve) => {
        this.$patch((state) => {
          state.visitedViews = state.visitedViews.filter((tag) => tag.meta.affix)
          resolve([...state.visitedViews])
        })
      })
    },

    delCachedView(view) {
      return new Promise((resolve) => {
        this.$patch((state) => {
          const index = state.cachedViews.indexOf(view.name)
          index > -1 && state.cachedViews.splice(index, 1)
          resolve([...state.cachedViews])
        })
      })
    },
    delOthersCachedViews(view) {
      return new Promise((resolve) => {
        this.$patch((state) => {
          for (const i of state.cachedViews) {
            if (i === view.name) {
              const index = state.cachedViews.indexOf(i)
              state.cachedViews = state.cachedViews.slice(index, index + 1)
              break
            }
          }
          resolve([...state.cachedViews])
        })
      })
    },
    async delOthersViews(view) {
      const res = await Promise.all([this.delOthersVisitedViews(view), this.delOthersCachedViews(view)])
      return { cachedViews: res[1], visitedViews: res[0] }
    },

    delOthersVisitedViews(view) {
      return new Promise((resolve) => {
        this.$patch((state) => {
          state.visitedViews = state.visitedViews.filter((v) => {
            return v.meta.affix || v.path === view.path
          })
          resolve([...state.visitedViews])
        })
      })
    },
    async delView(view) {
      const res = await Promise.all([this.delVisitedView(view), this.delCachedView(view)])
      return { cachedViews: res[1], visitedViews: res[0] }
    },
    delVisitedView(view) {
      return new Promise((resolve) => {
        this.$patch((state) => {
          for (const [i, v] of state.visitedViews.entries()) {
            if (v.path === view.path) {
              state.visitedViews.splice(i, 1)
              break
            }
          }
          resolve([...state.visitedViews])
        })
      })
    },

    moveVisitedView(from, to) {
      this.$patch((state) => {
        state.visitedViews.splice(to, 0, state.visitedViews.splice(from, 1)[0])
      })
    },

    updateVisitedView(view) {
      this.$patch((state) => {
        for (let v of state.visitedViews) {
          if (v.path === view.path) {
            v = Object.assign(v, view)
            break
          }
        }
      })
    },
  },
  state: () => ({
    cachedViews: [],
    visitedViews: [],
  }),
})

export default useTagsViewStore
