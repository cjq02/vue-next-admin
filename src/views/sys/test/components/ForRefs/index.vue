<script setup>
import { ref } from 'vue'

import Child from './child.vue'

const childRefs = ref([])
const text = ref('')

function handleClick(idx) {
  text.value = childRefs.value[idx].childFunc()
  const ab = '222'
  console.log(ab)
}
</script>

<template>
  <div v-for="(i, idx) in [1, 2, 3, 4]" :key="i">
    <div>
      <Child ref="childRefs" :value="i"></Child>
      <button @click="handleClick(idx)">click me</button>
    </div>
  </div>
  {{ text }}
</template>
