/*  $(function() {
     var form = layui.form;
     var layer = layui.layer;
     initArtCateList();
     //1.获取文章分类列表
     function initArtCateList() {
         $.ajax({
             method: 'GET',
             url: '/my/article/cates',
             success: function(res) {
                 //console.log(res);
                 var htmlStr = template('tpl-table', res);
                 $('tbody').html(htmlStr);

             }
         })
     };


     //2.为添加类别按钮绑定点击事件
     var addIndex = null;
     $('#btnAddCate').on('click', function() {
         addIndex = layer.open({
             type: 1,
             area: ['500px', '250px'],
             title: '添加文章分类',
             content: $('#dialog-add').html(),
         })
     });

     //3.通过代理方式给form-add表单添加submit提交事件
     $('body').on('submit', '#form-add', function(e) {
         e.preventDefault();
         $.ajax({
             method: 'POST',
             url: '/my/article/addcates',
             data: $(this).serialize(),
             success: function(res) {
                 //console.log(res);
                 if (res.status !== 0) {
                     return layer.msg('新增文章分类失败！');
                 }
                 initArtCateList(); //获取文章分类列表
                 layer.msg('新增文章分类成功！');
                 layer.close(addIndex);

             }
         })
     });

     //4.通过代理方式给btnEdit绑定点击事件
     var indexEdit = null;
     $('tbody').on('click', '.btnEdit', function(e) {
         e.preventDefault();

         indexEdit = layer.open({
             type: 1,
             area: ['500px', '250px'],
             title: '修改文章分类',
             content: $('#dialog-edit').html(),
         });

         //发起请求获取对应分类的数据
         var id = $(this).attr('data-Id'); //获取当前点击的相对应的自定义id
         $.ajax({
             method: 'GET',
             url: '/my/article/cates/' + id,
             data: {
                 id: id
             },
             success: function(res) {
                 // console.log(res);
                 form.val('form-edit', res.data);

             }
         })


     })

     //5.通过代理方式 为修改分类的表单绑定 submit 事件
     $('body').on('submit', '#form-edit', function(e) {
         e.preventDefault();
         $.ajax({
             method: 'POST',
             url: '/my/article/updatecate',
             data: $(this).serialize(),
             success: function(res) {
                 console.log(res);
                 if (res.status !== 0) {
                     return layer.msg('更新分类信息失败！');
                 }

                 layer.msg('更新分类信息成功！');
                 layer.close(indexEdit);
                 initArtCateList();

             }
         })
     })

     //6.通过代理的形式，为删除按钮绑定点击事件
     $('tbody').on('click', '.btn-delete', function(e) {
         e.preventDefault();
         var id = $(this).attr('data-Id');
         console.log(id);

         layer.confirm('确认删除?', { icon: 3, title: '提示' }, function(index) {
             //do something
             $.ajax({
                 method: 'GET',
                 url: '/my/article/deletecate/' + id,
                 data: {
                     id: id
                 },
                 success: function(res) {
                     //console.log(res);
                     if (res.status !== 0) {
                         return layer.msg('删除文章分类失败！');
                     }
                     layer.msg('删除文章分类成功！');
                     layer.close(index);
                     initArtCateList(); //获取文章分类列表

                 }
             })


         });

     })

 }) */

$(function() {
    var form = layui.form;
    var layer = layui.layer;
    initArticle();
    //1.获取文章分类列表
    function initArticle() {
        $.ajax({
            method: 'GET',
            url: '/my/article/cates',
            success: function(res) {
                var htmlStr = template('tpl-table', res);
                $('tbody').html(htmlStr);

            }
        })
    }

    //2.给添加类别按钮绑定点击事件
    var addIndex = null;
    $('#btnAddCate').on('click', function() {
        //2.1弹出添加分类弹框
        addIndex = layer.open({
            type: 1,
            title: '添加文章分类',
            area: ['500px', '250px'],
            content: $('#tpl-add').html(),
        })
    });

    //2.2通过代理方式给form绑定submit提交事件
    $('body').on('submit', '#form-add', function(e) {
        e.preventDefault();
        $.ajax({
            method: 'POST',
            url: '/my/article/addcates',
            data: $(this).serialize(),
            success: function(res) {
                if (res.status !== 0) {
                    return layer.msg('新增文章分类失败！');
                }
                layer.msg('新增文章分类成功！');
                layer.close(addIndex);
                initArticle();

            }
        })
    });

    //3.通过代理方式给编辑按钮添加点击事件
    var editIndex = null;
    $('tbody').on('click', '#edit-btn', function() {
        //3.1弹出添加分类弹框
        editIndex = layer.open({
            type: 1,
            title: '修改文章分类',
            area: ['500px', '250px'],
            content: $('#tpl-edit').html(),
        });
        //3.2 根据id获取文章分类数据
        var id = $(this).attr('data-id');
        //console.log(id);

        $.ajax({
            method: 'GET',
            url: '/my/article/cates/' + id,
            success: function(res) {
                // console.log(res);
                form.val('form-edit', res.data);
            }
        })


    })

    //4.通过代理给form表单绑定提交事件
    $('body').on('submit', '#form-edit', function(e) {
        e.preventDefault();
        $.ajax({
            method: 'POST',
            url: '/my/article/updatecate',
            data: $(this).serialize(),
            success: function(res) {
                // console.log(res);
                if (res.status !== 0) {
                    return layer.msg('更新分类信息失败！');
                }
                layer.msg('更新分类信息成功！');
                layer.close(editIndex);
                initArticle();
            }
        })
    });

    //5. 通过代理方式给删除按钮添加点击事件
    $('tbody').on('click', '#delete-btn', function() {
        var id = $(this).attr('data-id');
        layer.confirm('确定删除?', { icon: 3, title: '提示' }, function(index) {
            //do something
            $.ajax({
                method: 'GET',
                url: '/my/article/deletecate/' + id,
                success: function(res) {
                    console.log(res);
                    if (res.status !== 0) {
                        return layer.msg('删除文章分类失败！');
                    }
                    layer.msg('删除文章分类成功！');
                    layer.close(index);
                    initArticle();
                }
            })



        });
    })

})