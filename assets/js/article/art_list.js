$(function() {

    var layer = layui.layer;
    var form = layui.form;
    var laypage = layui.laypage;

    //1.3定义美化时间的过滤器
    template.defaults.imports.dateForm = function(dtStr) {
        var dt = new Date(dtStr);
        var y = dt.getFullYear();
        var m = padZero(dt.getMonth() + 1);
        var d = padZero(dt.getDate());
        var hh = padZero(dt.getHours());
        var mm = padZero(dt.getMinutes());
        var ss = padZero(dt.getSeconds());

        return y + '-' + m + '-' + d + ' ' + hh + ':' + mm + ':' + ss;
    };
    //1.4定义补零的函数
    function padZero(n) {
        if (n < 10) {
            return '0' + n
        } else {
            return n
        }
        //n < 10 ? '0' + n : n;
    }


    //1.1首先定义一个查询的参数对象，将来请求数据的时候需要将请求参数对象发送到服务器
    var q = {
        pagenum: 1, //页码值默认第1页
        pagesize: 2, //默认每页显示2条数据
        cate_id: '', //分类的文章id 默认没有选择 一个空字符串
        state: '' //文章的状态 默认没有选择

    }

    initTable();
    initCate();

    //1.2获取文章的列表数据的方法
    function initTable() {
        $.ajax({
            method: 'GET',
            url: '/my/article/list',
            data: q,
            success: function(res) {
                if (res.status !== 0) {
                    return layer.msg('获取文章列表失败！')
                }
                // 使用模板引擎渲染页面的数据
                var htmlStr = template('tpl-table', res);
                $('tbody').html(htmlStr);
                // 调用渲染分页的方法
                renderPage(res.total)
            }
        })
    };

    //2.初始化文章分类的方法
    function initCate() {
        $.ajax({
            method: 'GET',
            url: '/my/article/cates',
            success: function(res) {
                if (res.status !== 0) {
                    return layer.msg('获取分类数据失败！');
                }
                var htmlStr = template('tpl-cate', res);
                // console.log(htmlStr);

                $('[name = cate_id]').html(htmlStr);
                //因为是后来动态添加进去的，顺序上没有被layui.js所监听到，需要调用一下layui的 form.render()方法 通过 layui 重新渲染表单区域的UI结构
                form.render();
            }
        })
    };

    //3.为筛选按钮绑定submit事件
    $('#form-search').on('submit', function(e) {
        e.preventDefault();

        //3.1获取表单中选中项的值
        var cate_id = $('[name=cate_id]').val();
        var state = $('[name=state]').val();

        //3.2把表单中选中项的值赋给查询对象参数q
        q.cate_id = cate_id;
        q.state = state;

        //3.3根据最新的筛选条件 重新渲染表格的数据
        initTable();
    });

    //4.定义渲染分页的方法
    function renderPage(total) {
        //4.1 调用laypge.render()方法来渲染分页的结构
        laypage.render({
            elem: 'pageBox', //指向存放分页的容器 这里不能加 # 号
            count: total, //数据总数。一般通过服务端得到
            limit: q.pagesize, //每页显示的条数。laypage将会借助 count 和 limit 计算出分页数。
            curr: q.pagenum, //起始页
            layout: ['count', 'limit', 'prev', 'page', 'next', 'skip'],
            limits: [2, 3, 5, 10],
            //4.2分页发生切换的时候，触发jump回调
            // 触发 jump 回调的方式有两种：
            // 1. 点击页码的时候，会触发 jump 回调
            // 2. 只要调用了 laypage.render() 方法，就会触发 jump 回调
            //下面造成死循环的原因就是在jump函数中调用了第二种方式，只要不调用第二种方式，就可以解决死循环这个问题，怎么判断是不是第二种方式
            jump: function(obj, first) { //obj包含了当前分页的所有参数，first（是否首次，一般用于初始加载的判断，是一个布尔值）
                // 可以通过 first 的值，来判断是通过哪种方式，触发的 jump 回调
                // 如果 first 的值为 true，证明是方式2触发的
                // undefined，否则就是方式1触发的
                // console.log(first);

                //console.log(obj.curr); //得到当前页
                //console.log(obj.limit); //得到每页显示的条数
                //4.2.1把最近的页码值，赋值到q这个查询参数对象中
                q.pagenum = obj.curr;
                //4.3把最新的条目数 赋值到q这个查询对象的pagesize属性中
                q.pagesize = obj.limit;
                //4.4 根据最新的q获取对应的数据列表，并渲染表格
                //initTable();//这样直接调用会造成一个死循环
                if (!first) { //只要first不为true就可以调用initTable（）
                    initTable();
                }
            }
        })
    };



    //5.通过代理的形式，为删除按钮绑定点击事件处理函数
    $('tbody').on('click', '.btn-delete', function() {
        //获取删除按钮的个数,有几个删除按钮就有几条数据
        var len = $('.btn-delete').length;
        console.log(len);
        //获取到文章的id
        var id = $(this).attr('data-id');
        //询问用户是否要删除数据
        layer.confirm('确认删除?', { icon: 3, title: '提示' }, function(index) {
            //do something
            $.ajax({
                method: 'GET',
                url: '/my/article/delete/' + id,
                success: function(res) {
                    if (res.status !== 0) {
                        return layer.msg('删除失败！');
                    }
                    layer.msg('删除成功！');
                    // 当数据删除完成后，需要判断当前这一页中，是否还有剩余的数据
                    // 如果没有剩余的数据了,则让页码值 -1 之后,
                    // 再重新调用 initTable 方法
                    if (len === 1) {
                        // 如果 len 的值等于1，证明删除完毕之后，页面上就没有任何数据了
                        // 页码值最小必须是 1
                        q.pagenum = q.pagenum === 1 ? 1 : q.pagenum - 1;
                    }
                    initTable();
                }
            })
            layer.close(index);
        });

    })

})