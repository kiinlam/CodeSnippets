// js 里 \x 开头的通常是16进制编码的数据，下面代码实现编解码：

// 解码
//eg.
//decode('\x5f\x63\x68\x61\x6e\x67\x65\x49\x74\x65\x6d\x43\x72\x6f\x73\x73\x4c\x61\x79\x65\x72')
//"_changeItemCrossLayer"
export const decode = (str) => {
  return str.replace(/\\x(\w{2})/g, function (_, $1) { return String.fromCharCode(parseInt($1, 16)) });
}

//编码
//eg.
//encode("_changeItemCrossLayer")
//"\x5f\x63\x68\x61\x6e\x67\x65\x49\x74\x65\x6d\x43\x72\x6f\x73\x73\x4c\x61\x79\x65\x72"
export const encode = (str) => {
  return str.replace(/(\w)/g, function (_, $1) { return "\\x" + $1.charCodeAt(0).toString(16) });
}