import { onBeforeMount, onBeforeUnmount, onMounted } from 'vue'

const { body } = document
const WIDTH = 992
export default function () {
  const store = useStore()

  const isMobile = () => {
    const rect = body.getBoundingClientRect()
    return rect.width - 1 < WIDTH
  }
  const resizeHandler = () => {
    if (!document.hidden) {
      store.app.openSidebar(!isMobile())
    }
  }
  onBeforeMount(() => {
    window.addEventListener('resize', resizeHandler)
  })
  onMounted(() => {
    store.app.openSidebar(!isMobile())
  })
  onBeforeUnmount(() => {
    window.removeEventListener('resize', resizeHandler)
  })
}
