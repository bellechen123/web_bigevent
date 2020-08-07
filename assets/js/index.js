 $(function() {
     //调用getUserInfo获取用户基本信息
     getUserInfo();

     var layer = layui.layer;
     //3.点击按钮，实现退出功能
     $('#btnLogout').on('click', function() {
         layer.confirm('确定退出登录?', { icon: 3, title: '提示' }, function(index) {
             //do something
             //3.1清空本地存储的token
             localStorage.removeItem('token');

             //3.2返回登陆页
             location.href = '/login.html';
             //关闭询问框
             layer.close(index);
         });
     })
 })

 //1.获取用户的基本信息
 function getUserInfo() {
     $.ajax({
         method: 'GET',
         url: '/my/userinfo',
         //headers就是请求头配置对象
         // headers: {
         //Authorization: localStorage.getItem('token') || '',
         //},
         success: function(res) {
             console.log(res);
             if (res.status !== 0) {
                 return layui.layer.msg('获取用户信息失败！');

             }
             //获取用户基本信息成功以后调用renderAvatar()这个函数渲染用户名称和头像
             renderAvatar(res.data); //把用户信息传进去用下面的user接收一下

         },
         //jquery中的ajax  不论成功还是失败都会调用complete回调函数,没有登陆是进不去里面的页面的
         // 在 complete 回调函数中，可以使用 res.responseJSON 拿到服务器响应回来的数据
         /* complete: function(res) {
             console.log('执行了complete回调');
             console.log(res);
             if (res.responseJSON.status === 1 && res.responseJSON.message === '身份认证失败！') {
                 // 1. 强制清空 token
                 localStorage.removeItem('token');
                 // 2. 强制跳转到登录页面
                 location.href = '/login.html';
             }

         } */

     })
 }

 //2.渲染用户的名称和头像
 function renderAvatar(user) {
     //2.1获取用户的名称
     var name = user.nickname || user.username;
     //console.log(typeof name);//string
     //console.log(name[0]); //字符串获取第一个字符和数组一样使用

     //2.2设置欢迎的文本
     $('#welcome').html('欢迎&nbsp;&nbsp;' + name);
     //2.3按需渲染用户的头像
     if (user.user_pic !== null) {
         //渲染图片头像
         $('.layui-nav-img').attr('src', user.user_pic).show();
         $('.text-avatar').hide();
     } else {
         //渲染文本头像
         $('.layui-nav-img').hide();
         var first = name[0].toUpperCase();
         $('.text-avatar').html(first).show();
     }

 }




 /* $(function() {
     getUserInfo();
 })

 //1.获取用户的信息
 function getUserInfo() {
     $.ajax({
         method: 'GET',
         url: '/my/userinfo',
         headers: {
             Authorization: localStorage.getItem('token') || '',
         },
         success: function(res) {
             console.log(res);
             if (res.status !== 0) {
                 return '获取用户基本信息失败！';
             }
             //成功之后渲染用户头像和名称
             var name = res.data.username;
             console.log(name);
             $('#welcome').html('您好' + name);
             //如果有图片头像则渲染图片头像
             if (res.data.user_pic !== null) {
                 $('.layui-nav-img').attr('src', 'res.data.user_pic').show();
                 $('.text-avatar').hide();
             } else {
                 $('.layui-nav-img').hide();
                 var first = name[0].toUpperCase();
                 $('.text-avatar').html(first).show();
             }

         }
     })
 } */