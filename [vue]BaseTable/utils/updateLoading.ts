/**
 * 构建loading
 */
export default function updatePagination(loading, innerLoading) {
  const spin: any = {
    spinning: innerLoading.spinning
  }
  if (typeof loading === 'boolean') {
    spin.spinning = loading
  } else if (typeof loading === 'object') {
    for (let k in loading) {
      spin[k] = loading[k]
    }
  }
  return spin
}