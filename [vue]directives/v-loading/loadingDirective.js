import Loading from './loading.vue'
import createLoadingLikeDirective from './js/loading-like-directive.js'

const loadingDirective = createLoadingLikeDirective(Loading)

export default loadingDirective