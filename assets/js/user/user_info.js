 $(function() {
     var form = layui.form;
     var layer = layui.layer;

     //1.校验昵称长度
     form.verify({
         nickname: function(val) {
             if (val.length > 6) {
                 return '昵称长度必须在 1 ~ 6 个字符之间！'
             }
         }
     });
     initUserInfo();

     //2.获取用户的基本信息 初始化基本信息
     function initUserInfo() {
         $.ajax({
             method: 'GET',
             url: '/my/userinfo',
             success: function(res) {
                 //console.log(res);
                 if (res.status !== 0) {
                     return layer.msg('获取用户信息失败！');
                 }
                 // 调用 form.val() 快速为表单赋值
                 //表单赋值 / 取值  语法：form.val('filter', object);如果 object 参数存在，则为赋值；如果 object 参数不存在，则为取值。页面中的name值必须和res.data返回的属性名一样才可以  赋值的时候也会给隐藏域赋值  隐藏域也有value值
                 form.val('formUserInfo', res.data)
             }
         })
     };

     //3.重置表单的数据
     $('#btnReset').on('click', function(e) {
         //重置默认会把表单里面的内容清空 先阻止默认表单重置行为
         e.preventDefault();
         initUserInfo(); //重新获取一下用户的初始化信息 重新填充一下表单
     });

     //4.监听表单的提交事件
     $('.layui-form').on('submit', function(e) {
         e.preventDefault();
         $.ajax({
             method: 'POST',
             url: '/my/userinfo',
             data: $(this).serialize(),
             success: function(res) {
                 if (res.status !== 0) {
                     return layer.msg('修改用户失败！');
                 }
                 console.log(res);
                 layer.msg('修改用户成功！');
                 //在子页面中调用父页面的方法，重新渲染一下用户信息和头像
                 window.parent.getUserInfo(); //window就是iframe所代表的这个窗口  parent就是父页面 index

             }

         })
     })
 })