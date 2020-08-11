//jquery.ajaxPrefilter() 函数用于指定预先处理Ajax参数选项的回调函数。拦截到每一次的ajax请求，也就是说每次发起ajax之前会先调用一下这个函数。
//在这个函数中，可以拿到我们给ajax提供的配置对象




//回调函数中有三个参数，
//options  (Object对象)当前AJAX请求的所有参数选项。
//originalOptions：(Object对象)传递给$.ajax()方法的未经修改的参数选项。
//jqXHR：当前请求的jqXHR对象(经过jQuery封装的XMLHttpRequest对象)。


var baseURL = 'http://ajax.frontend.itheima.net'; //请求的根路径
$.ajaxPrefilter(function(options) { //options就是在调ajax的时候传递的配置对象
    // console.log(options.url);
    // 1. 在发起真正的 Ajax 请求之前，统一拼接请求的根路径
    options.url = baseURL + options.url;
    //console.log(options.url);

    //2.统一为有权限的接口，设置headers请求头  只有url中包含/my/的才加headers
    if (options.url.indexOf('/my/') !== -1) {
        options.headers = {
            Authorization: localStorage.getItem('token') || '',
        }
    }
    //3.全局统一挂载complete函数
    //jquery中的ajax  不论成功还是失败都会调用complete回调函数,没有登陆是进不去里面的页面的
    // 在 complete 回调函数中，可以使用 res.responseJSON 拿到服务器响应回来的数据
    options.complete = function(res) {
        // console.log('执行了 complete 回调：')
        // console.log(res)
        // 在 complete 回调函数中，可以使用 res.responseJSON 拿到服务器响应回来的数据
        if (res.responseJSON.status === 1 && res.responseJSON.message === '身份认证失败！') {
            // 1. 强制清空 token
            localStorage.removeItem('token')
                // 2. 强制跳转到登录页面
            location.href = '/login.html'
        }
    }
})