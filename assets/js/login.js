$(function() {

    //1.登陆注册显示隐藏
    $('#link_reg').on('click', function() {
        $('.login_box').hide();
        $('.reg_box').show();
    });
    $('#link_login').on('click', function() {
        $('.reg_box').hide();
        $('.login_box').show();
    });

    //2.自定义校验规则，首先从layui中获取form对象
    var form = layui.form; //只要导入layui这个js，就可以使用layui这个对象，form是属相；跟jquery一样，只要导入jquery，就可以使用$
    var layer = layui.layer;
    //通过form.verify()函数自定义校验规则，里面是一个配置对象，采取键值对的形式，verify是一个方法
    form.verify({
        pwd: [
            /^[\S]{6,12}$/, '密码必须6到12位，且不能出现空格'
        ],
        //校验两次密码是否一致
        repwd: function(value) { //value就是用户输入的再次确认的值
            // 通过形参拿到的是确认密码框中的内容
            // 还需要拿到密码框中的内容
            // 然后进行一次等于的判断
            // 如果判断失败,则return一个提示消息即可
            var pwd = $('.reg_box [name=password]').val(); //用户第一次输入的值
            if (value !== pwd) {
                return '两次密码不一致！'
            }
        }

    })



    //3.发起注册用户的ajax请求 监听注册表单的提交事件

    /* $('#form_reg').on('submit', function(e) {
        // 1. 阻止表单的默认的提交行为
        e.preventDefault()
            // 2. 发起Ajax的POST请求
        var data = {
            username: $('#form_reg [name=username]').val(),
            password: $('#form_reg [name=password]').val()
        }
        $.post('http://ajax.frontend.itheima.net/api/reguser', data, function(res) {
            if (res.status !== 0) {
                
                return layer.msg(res.message)
            }
            layer.msg('注册成功，请登录！')
           // console.log('注册成功');
            // 模拟人的点击行为
            $('#link_login').click()
        })
    })
 */
    $('#form_reg').on('submit', function(e) {
        e.preventDefault();
        var data = {
                username: $('#form_reg [name=username]').val(),
                password: $('#form_reg [name=password]').val()
            }
            //var data = $(this).serialize();或者快速获取表单中的数据
        $.ajax({
            method: 'POST',
            url: '/api/reguser',
            data: data,
            success: function(res) {
                if (res.status !== 0) {
                    //return console.log(res.message);
                    return layer.msg(res.message);
                }
                //console.log('注册成功');
                layer.msg('注册成功，请登录！');
                //模拟人的点击行为，自动调用去登陆这个点击事件
                $('#link_login').click();
            }
        })
    })


    //4.发起登陆的ajax请求 监听登陆表单的提交事件
    $('#form_login').submit(function(e) {
        e.preventDefault();
        var data = $(this).serialize(); //快速获取表单中的数据 
        $.ajax({
            method: 'POST',
            url: '/api/login',
            data: data,
            success: function(res) {
                if (res.status !== 0) {
                    // return layer.msg(res.message);或则下面
                    return layer.msg('登陆失败');
                }
                //将登陆成功之后得到的token字符串，保存到localStorage中
                //console.log(res);
                //console.log(res.token);//token的值

                localStorage.setItem('token', res.token);
                layer.msg('登陆成功！');

                location.href = "/index.html"; //成功之后跳转到后台主页

            }
        })
    })

    //token就是登陆成功以后，服务器发过来的token值，在以后请求有权限的api接口时，需要带着token值才可以，如果不带这token，会请求失败。这样就可以先把服务器返回过来的值先存到本地，后续再用到的时候再取这个token值  用的时候在请求头headers中加一个Authorization这个字段 后面是返回来的token值

})