import { defineComponent, onBeforeMount } from 'vue'
import { useRoute, useRouter } from 'vue-router'

export default defineComponent({
  setup() {
    const route = useRoute()
    const router = useRouter()
    onBeforeMount(() => {
      const { params, query } = route
      const { path } = params
      router.replace({ path: '/' + path, query })
    })
    // @ts-ignore
    return () => <div> </div>
  },
})
