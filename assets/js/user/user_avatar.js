$(function() {

    // 1.1 获取裁剪区域的 DOM 元素
    var $image = $('#image');
    // 1.2 配置选项
    const options = {
        aspectRatio: 1, // 纵横比  1/1     
        preview: '.img-preview', // 指定预览区域
    };
    // 1.3 创建裁剪区域
    $image.cropper(options);


    //2.为上传按钮绑定点击事件
    $('#btnChooseImage').on('click', function() {
        $('#file').click(); //只要触发上传按钮的点击事件就自动调用上传input的点击事件
        // console.log('ok');

    });

    //3.为文件选择框绑定change事件
    $('#file').on('change', function(e) {
        //console.log(e);
        //console.log(e.target);//e.target是事件触发的元素 点击哪个元素就返回哪个元素
        //3.1获取用户选择的文件
        var fileList = e.target.files; //伪数组的形式
        if (fileList.length === 0) {
            return layer.msg('请选择照片！');
        }
        //3.2 拿到用户选择的文件
        var file = e.target.files[0];
        // console.log(file);

        //3.3 将文件转换为路径  URL有个createObjectURL（）方法
        var imgURL = URL.createObjectURL(file);
        //3.4 从新初始化裁剪区域
        $image
            .cropper('destroy') // 销毁旧的裁剪区域
            .attr('src', imgURL) // 重新设置图片路径
            .cropper(options) // 重新初始化裁剪区域


    })

    //4.为确定按钮绑定点击事件
    $('#btnUpload').on('click', function() {
        //4.1拿到用户裁剪之后的头像
        var dataURL = $image
            .cropper('getCroppedCanvas', {
                // 创建一个 Canvas 画布
                width: 100,
                height: 100
            })
            .toDataURL('image/png'); // 将 Canvas 画布上的内容，转化为 base64 格式的字符串
        //4.2调用接口，把头像上传到服务器
        $.ajax({
            method: 'POST',
            url: '/my/update/avatar',
            data: {
                avatar: dataURL,
            },
            success: function(res) {
                //console.log(res);
                if (res.status !== 0) {
                    return layer.msg('更新头像失败！');

                }
                layer.msg('更新头像成功！');
                window.parent.getUserInfo(); //调用父页面中的获取用户的基本信息的函数
            }
        })
    })
})