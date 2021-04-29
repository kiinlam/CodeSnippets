/**
 * fetchAPI
 */
import { ref } from 'vue'

export function fetchAPI(refUrl) {
  const data = ref(null)
  const error = ref(null)
  const isPending = ref(true)

  fetch(refUrl())
    .then(res => res.json())
    .then(result => (data.value = result))
    .catch(err => (error.value = err))
    .finally(() => (isPending.value = false))

  return {
    data,
    error,
    isPending,
   }
}