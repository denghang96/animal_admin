前端使用的是基于vue.js的iview-admin框架，使用的组件来源于iview

src/index.js
baseUrl-->dev 和 reqUrl 这两个配置的是后台的IP地址加端口号
homename-->关联标签上【首页】两个字，homeName的值与src/router/routers.js中的路由name相对应
header:每一个请求，都必须在请求头中待上header,因为里面包含了token的信息，token就相当于JSP中用户登录后的session

src/router/routers.js 路由，配置页面跳转的js

view文件夹下 
 animal -->动物管理
 approval -->审批
 comment --> 评论
 consume --》消费
 foster -->寄养
 interview -->领养回访
 support ==>助养
 users -->用户管理
 其他的都是框架自带的，方便开发的一些组件

 后端代码。只需要关注除controller中auth，common 和exception以外的文件夹


 在传统的SSM这种框架中，因为存在有session这样的JSP内置对象。所以能够很清楚的知道用户是否登录了和当前登录的用户是谁
 同时session有一个有效时间，默认为30分钟，超过这个时间用户不做任何操作的话session就失效了，就会自动退出登录。

 现在的话，前后端的代码没有在一起了，也就没有了session的概念，要实现上面的功能，就需要有一个东西来做出标识，所以在登录之后，后台就根据
开发人员自己定义的规则生成一个加密的字符串来包含这些信息，加密主要是为了安全，也可以不加密的类似于这样：[userid,username,有效时间]的一个字符串，登录后
在前台浏览器中将token保存下来，然后每次请求，在请求header中带上token。这样后台在filter中每次都可以拿到token先解析token，就知道用户是谁了
如果token不能解析成功，就说明有人在恶意请求什么的，也是为了安全考虑，token是用的Jwt官方提供的加密工具方法generateToken进行加密