# 用KOA搭建一个FORM表单上传的环境

上上上一期链接——也就是本文的基础，[参考KOA，5步手写一款粗糙的web框架](https://juejin.im/post/5b7e8718e51d4538ca573445)

上上一期链接——有关Router的实现思路，[这份Koa的简易Router手敲指南请收下](https://juejin.im/post/5b7fd1bc6fb9a019b421cc35)

上一期链接——有关模板引擎的实现思路，[KOA的简易模板引擎实现方式](https://juejin.im/post/5b865aeb6fb9a01a040717fb)

本文参考仓库：[点我](https://github.com/nanaSun/myHTTP/tree/master/upload)

做这个表单上传的时候，我被封印了，真的是封印了，这个表单上传看似人畜无害，实则暗藏玄机，让我不吐不快。

我在研究这个上传的中间件的时候，大概就属于，这个很简单，源码都封装好了，拿来用就好了。可是我太天真了。源码给你的真的是“源码”，无任何处理的数据，绝对的天然无污染！当时我就震惊了，本来想30分钟过一遍，就可以结束了。结果😭……，大哥，我错了，我一定好好研究……

在开始动手敲代码前，还有几点知识需要科普下：

* [客户端（client）像服务器（server）发送信息。](https://juejin.im/post/5b7919345188254312414b9c#heading-5)：如果不进行这个操作，我们无法得知发生了什么。
* fs的各类操作（这个等我稍后补上，哈哈哈哈）：这个操作用于将用户上传的内容保存到本地。

## 重点“原料”代码

获取HEADERS信息

```
Content-Length: 230
Content-Type: multipart/form-data; boundary=----WebKitFormBoundaryfWSJqD9FgKeYfOTF
```

拼接获取的资源，并组合。

```
let buf=[]
ctx.req.on("data",(data)=>{
    buf.push(data)
});
ctx.req.on("end",(data)=>{
    string=Buffer.concat(buf).toString()
})
```

过滤格式化获取到的数据，然后就要开始可怕的正则提取有效字段和内容。

```
------WebKitFormBoundaryfWSJqD9FgKeYfOTF
Content-Disposition: form-data; name="text"

111
------WebKitFormBoundaryfWSJqD9FgKeYfOTF
Content-Disposition: form-data; name="aaa"; filename="checked.png"
Content-Type: image/png

�PNG

------WebKitFormBoundaryfWSJqD9FgKeYfOTF--
```

好了，我们开始一步步实现吧！

## STEP1 创建一个中间件

这个中间件，放于代码最上方，每次页面访问的时候，进行监听，看看有没有数据传给服务器，有的话，就接收留给后方程序使用。然后再继续进行后续中间件/代码的执行。

```
function bodyparser(){
    return async (ctx,next)=>{
        await next();
    }
}
```

服务器端接受数据的方式，大家应该很熟悉,通过`data`事件监听每次获取到的数据，然后将缓存`push`到数组中。等到全部接收完毕，触发`end`事件，将缓存拼接到一起转化成字符串。

```
let buf = [];
let string="";  
ctx.req.on("data",(data)=>{
    buf.push(data)
});
ctx.req.on("end",(data)=>{
    string=Buffer.concat(buf).toString()
}
```



