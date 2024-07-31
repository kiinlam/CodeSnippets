const sorter = new Intl.Collator('zh').compare

function pinyinSort(array) {
  return array.sort(sorter)
}
