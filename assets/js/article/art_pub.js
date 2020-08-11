$(function() {
    var layer = layui.layer;
    var form = layui.form;

    initCate();
    //2. 初始化富文本编辑器
    initEditor();

    //1. 定义加载文章分类的方法
    function initCate() {
        $.ajax({
            method: 'GET',
            url: '/my/article/cates',
            success: function(res) {
                // console.log(res);
                if (res.status !== 0) {
                    return layer.msg('获取文章分类列表失败！');
                }
                //获取成功调用模板引擎，渲染分类的下拉菜单
                var htmlStr = template('tpl-cate', res);
                $('[name=cate_id]').html(htmlStr);
                // 一定要记得调用 form.render() 方法 重新渲染UI页面
                form.render();
            }
        })
    };

    //3.裁剪图片
    // 3.1 初始化图片裁剪器
    var $image = $('#image');

    // 3.2 裁剪选项
    var options = {
        aspectRatio: 400 / 280,
        preview: '.img-preview'
    };

    // 3.3 初始化裁剪区域
    $image.cropper(options);

    // 4. 为选择封面的按钮，绑定点击事件处理函数
    $('#btnChooseImage').on('click', function() {
        $('#coverFile').click();
    });

    //5.监听 `coverFile` 的 `change` 事件，获取用户选择的文件列表
    $('#coverFile').on('change', function(e) {
        e.preventDefault();
        //console.log(e.target.files);
        //获取到文件的列表数组 是一个伪数组
        var files = e.target.files;
        //判断用户是否选择了文件
        if (files.length === 0) {
            return
        }
        //根据文件，创建对应的url地址
        var newImgURL = URL.createObjectURL(files[0]);
        //console.log(newImgURL);

        //为裁剪去重新设置图片
        $image
            .cropper('destroy') // 销毁旧的裁剪区域
            .attr('src', newImgURL) // 重新设置图片路径
            .cropper(options) // 重新初始化裁剪区域
    });

    //6.为表单绑定submit提交事件

    //6.1先处理请求体中的状态  定义文章的发布状态
    var art_state = '已发布'; //默认是已发布

    //6.2为存为草稿按钮，绑定点击事件处理函数
    $('#btnSave2').on('click', function() {
        art_state = '草稿';
    });

    //6.3 为表单绑定submit提交事件
    //var form = document.querySelector('#form-pub');
    $('#form-pub').on('submit', function(e) {
        //6.3.1
        e.preventDefault();
        //6.3.2基于form表单，快速创建一个FormData对象,快速获取到form表单中的数据
        var fd = new FormData($(this)[0]); //[0]把jquery对象转换为原生dom对象   或者下面这种
        //var fd = new FormData(form);

        //6.3.3 将文章的发布状态，存到 fd 中
        fd.append('state', art_state);

        /* fd.forEach(function(v, k) { //v是值 k是键   
            console.log(k, v);

        }); */
        //6.3.4. 将封面裁剪过后的图片，输出为一个文件对象
        $image
            .cropper('getCroppedCanvas', {
                // 创建一个 Canvas 画布
                width: 400,
                height: 280
            })
            .toBlob(function(blob) {
                // 将 Canvas 画布上的内容，转化为文件对象
                // 得到文件对象后，进行后续的操作
                // 6.3.5. 将文件对象blob，存储到 fd 中
                fd.append('cover_img', blob);
                // 6.3.6. 发起 ajax 数据请求
                publishArticle(fd)
            })
    });

    //7. 定义一个发布文章的方法
    function publishArticle(fd) {
        $.ajax({
            method: 'POST',
            url: '/my/article/add',
            data: fd,
            // 注意：如果向服务器提交的是 FormData 格式的数据，
            // 必须添加以下两个配置项
            contentType: false,
            processData: false,
            success: function(res) {
                //console.log(res);
                if (res.status !== 0) {
                    return layer.msg('发布文章失败！');
                }
                layer.msg('发布文章成功！');
                // 发布文章成功后，跳转到文章列表页面
                location.href = '/article/art_list.html';
            }
        })
    }

})