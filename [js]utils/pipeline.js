/*
 管道流
  //test
  function f1(a) {
    a.pop();
    return a;
  }
  function f2(a) {
    return a.reverse()
  }
  //[1,2,3]经过两个function的处理后，输出结果
  pipe([1, 2, 3], f1, f2) // => [2,1]
*/

export const pipe = (data, ...args) => {
  return args.reduce((r, f) => f(r), data);
}

/*
 * 使用Proxy实现：
 * var double = n => n * 2;
 * var pow = n => n * n;
 * var reverseInt = n => n.toString().split("").reverse().join("") | 0;
 * pipe(3).double.pow.reverseInt.get; // 63
*/
export const pipe2 = (function () {
  return function (value) {
    var funcStack = [];
    var oproxy = new Proxy({}, {
      get: function (pipeObject, fnName) {
        if (fnName === 'get') {
          return funcStack.reduce(function (val, fn) {
            return fn(val);
          }, value);
        }
        funcStack.push(window[fnName]);
        return oproxy;
      }
    });

    return oproxy;
  }
}());
