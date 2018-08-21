/**
 * Created by PhpStorm.
 * User: longtaixuan
 */

var _cascadebox = function(){};
var _cascadebox_id = 0;
_cascadebox.prototype = {
    data:null,
    dom_id:null,
    name:null,
    old_selected:null,
    width:0,
    header_data:null,
    all_flag:null,
    init:function(dom_id,name,data,selected = [],header_data = ['一级选项','二级选项','三级选项'],all_flag = true){
        this.dom_id = dom_id;
        this.name = name;
        this.data = data;
        this.old_selected = selected;
        this.header_data = header_data.length == 0 ? ['一级选项','二级选项','三级选项'] : header_data;
        this.all_flag = all_flag;
    },
    makeHtml:function(){
        var _data = {};
        for(var i in this.data){
            var d = this.data[i];
            if(!d.hasOwnProperty('parent_id')){
                d.parent_id = 0;
            }
            if(typeof(_data[d.parent_id]) != 'object'){
                _data[d.parent_id] = [d];
            }else{
                _data[d.parent_id].push(d);
            }
        }
        var html= "";
        //console.log(_data);
        for(var parent_id in _data){
            if(this.all_flag){
                //all_flag是否增加全选
                var tmp_data = {
                    id: -1,
                    name: '全选',
                };
                _data[parent_id].unshift(tmp_data);
            }
            var list = _data[parent_id];
            var html_list = "<li><input type='text' class='search' placeholder='&nbsp;输入内容搜索'></li>";
            for(var j in list){
                var item = list[j];
                var _class = "";
                if(typeof(_data[item.id]) == 'object'){
                    _class += " children";
                }
                try{
                    if(item.is_hidden){
                        _class += " hide2";
                    }
                }catch(err){

                }

                if(_class){
                    _class = " class='"+_class+"'";
                }

                _cascadebox_id++;
                var id = 'cascadebox_'+_cascadebox_id; //for='"+id+"' for会导致误点 先去掉
                var box = "<input type='checkbox' id='"+id+"' name='"+this.name+"' value='"+item.id+"' />";
                try{
                    if(item.no_checkbox){
                        //默认是选项都带复选框的，如果想要某个选项不带复选框，那么该选项应带no_checkbox属性，并且no_checkbox为true！
                        box = '';
                    }
                }catch(err){

                }
                if(_class.indexOf("children") != -1){
                    html_list += "<li"+_class+" v="+item.id+" has_children = 1><em>"+box+"</em><label>"+item.name+"</label><span></span></li>";
                }else{
                    html_list += "<li"+_class+" v="+item.id+" has_children = 0><em>"+box+"</em><label>"+item.name+"</label><span></span></li>";
                }

            }
            var _class = 'outer_box';
            if(parent_id === '0'){
                _class += " root";
            }else{
                _class += " hide";
            }
            if(_class){
                _class = " class='"+_class+"'";
            }

            html_list = "<div outer_parent_id="+parent_id+_class+"><div style='text-align: center;height: 30px;border-right: 1px solid #e8e8e8;'><label>"+this.header_data[_data[parent_id][1]['level']]+"</label></div><div parent_id="+parent_id+" class='box' ><ul>"+html_list+"</ul></div></div>";

            html += html_list;
        }

        html = "<div class='cascadebox_list'>"+html+"</div><div class='cascadebox_header' style='float: left;'></div>";

        $("#"+this.dom_id).addClass('cascadebox').html(html);
        this.width = $("#"+this.dom_id).width();
        this.setWidth();
        var that = this;
        $("#"+this.dom_id+" .children").on('click',function(){
            that.showChildren(this);
        });
        $("#"+this.dom_id+" :checkbox").on('change',function(){
            var flag = $(this).is(':checked');
            var this_div = $(this).parent().parent().parent().parent();
            var top_div = this_div.parent();
            var parentid = this_div.attr('parent_id');

            var id = $(this).val();

            if(id == -1){
                if(flag){
                    this_div.find(':checkbox').prop('checked',true);
                    if(parentid){
                        $(".box li[v="+parentid+"]").find(':checkbox[value='+parentid+']').prop('checked',true);
                    }
                    this_div.find(':checkbox').each(function () {
                        var this_li = $(this).parent().parent();
                        var has_children = this_li.attr('has_children');
                        var this_id = this_li.attr('v');
                        if(has_children){
                            top_div.parent().find('div[parent_id='+this_id+']').find(':checkbox').prop('checked',false);//先全部取消
                            top_div.parent().find('div[parent_id='+this_id+']').find(':checkbox[value="-1"]').trigger('click');
                        }
                    });

                }else{
                    this_div.find(':checkbox').prop('checked',false);
                    if(parentid){
                        $(".box li[v="+parentid+"]").find(':checkbox[value='+parentid+']').prop('checked',false);
                    }
                    this_div.find(':checkbox').each(function () {
                        var this_li = $(this).parent().parent();
                        var has_children = this_li.attr('has_children');
                        var this_id = this_li.attr('v');
                        if(has_children){
                            top_div.parent().find('div[parent_id='+this_id+']').find(':checkbox').prop('checked',true);//先全部勾选
                            top_div.parent().find('div[parent_id='+this_id+']').find(':checkbox[value="-1"]').trigger('click');
                        }
                    });
                }
            }else{
                var has_children = $(this).parent().parent().attr('has_children');
                if(has_children){
                    var children_all_checkbox  =  top_div.parent().find('div[parent_id='+id+']').find(':checkbox[value="-1"]');
                    children_all_checkbox.trigger('click');
                }
            }
            that.change_all(top_div,parentid,id,flag);
            that.showChecked();
        });

        //搜索
        $("#"+this.dom_id+" .search").on('input',function(){
            var text = $(this).val();
            $(this).parent().siblings("li").removeClass('hide');
            if(text){
                $(this).parent().siblings("li").each(function(){
                    var name = $(this).find('label').text();
                    if(name.indexOf(text) == -1){
                        $(this).addClass('hide');
                    }
                });
            }
        });
        that.showChecked();

        //显示预设数据
        for(var i=0; i< this.old_selected.length; i++){
            $('.cascadebox').find(':checkbox[value='+this.old_selected[i]+']').trigger('click');
        }
        $('li.selected').each(function () {
            $(this).trigger('click');
        });

    },
    setWidth:function(){
        var objs = $("#"+this.dom_id+" .outer_box:visible");
        var num = objs.length;
        var w = this.width/num;
        objs.width(w-10);
    },
    showChildren:function(e){
        var li = $(e);
        li.parent().find('.cur').removeClass('cur');
        li.addClass('cur');
        var id = li.attr('v');
        var col = li.parent().parent().attr('col');

        if(!col){
            col = 0;
        }
        var _col = col;
        while(1){
            _col++;
            var o = $("#"+this.dom_id+" div[col="+_col+"]");
            if(o.length > 0){
                o.hide();
            }else{
                break;
            }
        }
        $("#"+this.dom_id+" div[outer_parent_id="+id+"]").attr('col',col*1+1).removeClass('hide').show();
        $("#"+this.dom_id+" div[parent_id="+id+"]").attr('col',col*1+1).removeClass('hide').show();
        this.setWidth();
    },
    showChecked:function(){
        var html = '<a class="clear_header">清空全部已选</a>';

        $("#"+this.dom_id+" input:checked").not('.hide2 input:checked').each(function(i,e){
            var obj = $(this);
            var parent_ul = obj.parent().parent().parent();
            var text = obj.parent().next('label').html();
            var id = obj.val();
            if(id == -1) return;//如果是全选选项，跳过
            var all_flag = parent_ul.find(':checked[value="-1"]').is(':checked');
            var parent_id = parent_ul.parent().attr('parent_id');
            if(all_flag && parent_id != 0) return;//如果给box的全选被选中，则不显示，直接显示父级

            html += "<div><label>"+text+"</label><span v="+id+">x</span></div>";
        });

        $("#"+this.dom_id+" .cascadebox_header").html(html);
        $("#"+this.dom_id+" .cascadebox_header span").on('click',function(){
            var obj = $(this);
            var id = obj.attr('v');

            if(obj.parent().parent().find('div').length < 2){
                obj.parent().parent().find('a').remove();
            }
            obj.parent().parent().prev(".cascadebox_list").find(':checkbox[value='+id+']').trigger('click');
            obj.parent().remove();
        });

        var that = this;
        $("#"+this.dom_id+" .cascadebox_header a").on('click',function(){
            var obj = $(this);
            obj.parent().prev('.cascadebox_list').find(':checkbox').prop('checked',false);
            obj.parent().html('');
            $("#"+that.dom_id+" .selected").removeClass('selected');
        });
        //选中背景加深
        $("#"+this.dom_id+" .selected").removeClass('selected');

        $("#"+this.dom_id+" input:checked").each(function(){
            that.selected($(this).parent().parent());
        });

    },
    selected:function(obj){
        $(obj).addClass('selected');
        var top_div = $(obj).parent().parent();
        var parentid = top_div.attr('parent_id');
        if(parentid){
            this.selected("#"+this.dom_id+" li[v="+parentid+"]");
        }
    },
    change_all:function (top_div,parentid,id, op_flag) {
        var parent_li = $(".box li[v="+parentid+"]");
        var parent_top_div = parent_li.parent().parent();
        var parent_parentid = parent_top_div.attr('parent_id');
        if(op_flag){
            var all_flag = true;
            top_div.find(':checkbox').each(function () {
                if($(this).val() != -1){
                    if(!$(this).is(':checked')){
                        all_flag = false;
                    }
                }

            });

            if(all_flag){
                top_div.find(':checkbox[value="-1"]').prop('checked',true);
                parent_li.find(':checkbox[value='+parentid+']').prop('checked',true);
            }
        }else{
            top_div.find(':checkbox[value="-1"]').prop('checked',false);
            parent_li.find(':checkbox[value='+parentid+']').prop('checked',false);
            parent_li.parent().find(':checkbox[value="-1"]').prop('checked',false);

        }
        if(parentid !== 0 && parentid !== undefined){
            this.change_all(parent_top_div,parent_parentid,parentid, op_flag);
        }

    },
    get_data:function () {
        var get_data = [];
        $("#"+this.dom_id+" .cascadebox_header span").each(function () {
            get_data.push($(this).attr('v'));
        });
        return get_data;
    },
    set_data:function (select_data) {
        //先清空数据
        $('.clear_header').trigger('click');

        //显示设置数据
        for(var i=0; i< select_data.length; i++){
            $('.cascadebox').find(':checkbox[value='+select_data[i]+']').trigger('click');
        }
        $('li.selected').each(function () {
            $(this).trigger('click');
        });

    },
    add_val:function (val) {
        $('.cascadebox').find(':checkbox[value='+val+']').trigger('click');
    },
    del_val:function (val) {
        $('.cascadebox_header').find('span[v='+val+']').trigger('click');
    }
};

/**
 *
 * @param id [插入cascadebox的div的id]
 * @param name [checkbox的name]
 * @param data [cascadebox所有选择项的数据]
 * @param selected [预设选中的数据，可以为空(不传)或[]]
 * @param header_data [各级别名称，可以无限级，如果为空(不传)或[]，默认为3个级别，默认名称为['一级选项','二级选项','三级选项']]
 * @param all_flag [是否开启全选模式，可以为空(不传)，默认为true]
 * @returns {_cascadebox} [返回cascadeBox实例]
 */
function cascadeBox(id, name, data, selected, header_data, all_flag){
    var obj = new _cascadebox();
    obj.init(id, name, data, selected, header_data, all_flag);
    obj.makeHtml();
    return obj;
}