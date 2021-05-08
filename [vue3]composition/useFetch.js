/**
 * useFetch
 */
import { ref, watchEffect } from 'vue'

export function useFetch(refUrl) {
  const data = ref(null)
  const error = ref(null)
  const isPending = ref(true)

  watchEffect(() => {
    data.value = null
    error.value = null
    isPending.value = true

    fetch(refUrl())
      .then(res => res.json())
      .then(result => (data.value = result))
      .catch(err => (error.value = err))
      .finally(() => (isPending.value = false))
  })

  return {
    data,
    error,
    isPending,
  }
}

/**
 * use
 */
import useFetch from 'useFetch'
import { ref } from 'vue'

const Todo = {
  template: `
    <div v-if="isPending">loading...</div>
    <div v-else-if="data">{{ data }}</div>
    <div v-else>{{ error.message }}</div>
  `,
  props: ['id'],
  setup(props) {
    const { data, error, isPending } = useFetch(() => `http://jsonplaceholder.typicode.com/todos/${props.id}`)
    return { data, error, isPending }
  }
}

const App = {
  components: {
    Todo
  },
  template: `
    <Todo :id="id" />
  `,
  data() {
    return {
      id: 1
    }
  }
}