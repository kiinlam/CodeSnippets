import { customRef } from 'vue'

export function useDebouncedRef(value, delay = 200) {
  let timeout
  return customRef((track, trigger) => {
    return {
      get() {
        track()
        return value
      },
      set(newValue) {
        clearTimeout(timeout)
        timeout = setTimeout(() => {
          value = newValue
          trigger()
        }, delay)
      }
    }
  })
}

// use
<script setup>
import { useDebouncedRef } from './debouncedRef.js'
const text = useDebouncedRef('hello', 1000)
</script>

<template>
  <p>
    This text only updates 1 second after you've stopped typing:
  </p>
  <p>{{ text }}</p>
  <input v-model="text" />
</template>
