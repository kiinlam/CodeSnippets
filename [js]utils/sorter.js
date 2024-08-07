const sorter = new Intl.Collator('zh-Hans-CN', { numeric: true }).compare

function pinyinSort(array) {
  return array.sort(sorter)
}
