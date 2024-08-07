const sorter = new Intl.Collator('zh-Hans-CN').compare

function pinyinSort(array) {
  return array.sort(sorter)
}
