// const xhr = new XMLHttpRequest()
// xhr.open('GET', 'http://qq.com:8888/friends.json')
// xhr.onreadystatechange = () => {
//     if (xhr.readyState === 4 && xhr.status === 200) {
//         console.log(xhr.response)
//     }
// }
// xhr.send()

// window.xxx = data => {
//     console.log(data);
// }


// 发送jsonp
// const random = 'zkJSONPCallBackName' + Math.random()
// console.log(random)
// window[random] = (data) => {
//     console.log(data)
// }
// const script = document.createElement('script')
// script.src = `http://qq.com:8888/friends.js?functionName=${random}`
// script.onload = () => {
//     script.remove()
// }
// document.body.appendChild(script)

// 封装
function jsonp(url) {
  return new Promise((resolve, reject) => {
    // 生成随机的函数
    const random = 'zkJSONPCallBackName' + Math.random()
    window[random] = (data) => {
      resolve(data)
    }
    const script = document.createElement('script')
    // script.src = `${url}?functionName=${random}`
    script.src = `${url}?callback=${random}`
    script.onload = () => {
      script.remove()
    }
    script.onerror = () => {
      reject()
    }
    document.body.appendChild(script)
  })
}
jsonp('http://qq.com:8888/friends.js').then(data => console.log(data))


/**
 * 什么是jsonp？
 * 答：在进行跨域的时候，当前浏览器因为某种原因不支持cors，所以必须使用另外一种方式来跨域，于是
 *     我们就请求一个js文件，这个js文件会执行一个回调，回调里面就有我们需要的数据。
 * jsonp的优点是什么？
 * 答：兼容IE，可以跨域
 * jsonp的缺点是什么？
 *  由于它是script标签，相比较cors而言，只能知道成功或失败，它拿不到状态码
 *  由于它是script标签，所以它只能发get请求，不支持post
*/