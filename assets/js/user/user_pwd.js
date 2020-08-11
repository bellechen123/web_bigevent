$(function() {
    var form = layui.form;
    var layer = layui.layer;

    //1.校验密码
    form.verify({
        pwd: [
            /^[\S]{6,12}$/, '密码必须6到12位，且不能出现空格'
        ],
        samePwd: function(value) {
            if (value === $('[name = oldPwd]').val()) {
                return '新旧密码不能相同！';
            }
        },
        resPwd: function(value) {
            if (value !== $('[name = newPwd]').val()) {
                return '两次密码不一致！';
            }
        }
    });

    //2.监听修改密码提交事件
    $('.layui-form').on('submit', function(e) {
        e.preventDefault();
        $.ajax({
            method: 'POST',
            url: '/my/updatepwd',
            data: $(this).serialize(),
            success: function(res) {
                if (res.status !== 0) {
                    return layer.msg('更新密码失败！');
                }
                //console.log(res);
                layer.msg('更新密码成功！');
                $('.layui-form')[0].reset(); //重置标案 清空表单所填写内容 reset()是原生dom方法  jquery方法需要转换原生dom

            }
        })
    })

})