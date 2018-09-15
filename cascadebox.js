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
    selected_highlight_flag:null,
    oppose_box_id:null,
    oppose_flag:false,
    init:function(dom_id,name,data,selected = [],header_data = ['一级选项','二级选项','三级选项'],all_flag = true,selected_highlight_flag = true,oppose_box_id = null){
        this.dom_id = dom_id;
        this.name = name;
        this.data = data;
        this.old_selected = selected;
        this.header_data = header_data.length == 0 ? ['一级选项','二级选项','三级选项'] : header_data;
        this.all_flag = all_flag;
        this.selected_highlight_flag = selected_highlight_flag;
        if(oppose_box_id != null && oppose_box_id != ''){
            this.oppose_box_id = oppose_box_id;
            this.oppose_flag = true;
        }
    },
    makeHtml:function(){
        var this_dom_id = this.dom_id;
        var _data = {};
        var _key_to_value = {};
        var oppose_flag = this.oppose_flag;
        var oppose_box_id = this.oppose_box_id;
        for(var i in this.data){
            var d = this.data[i];
            _key_to_value[d.id] = d.name;
            if(!d.hasOwnProperty('parent_id') || d.parent_id == undefined){
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
                    html_list += "<li"+_class+" v="+item.id+" has_children = 1 children_select_all = 0><em>"+box+"</em><label>"+item.name+"</label><span></span></li>";
                }else{
                    html_list += "<li"+_class+" v="+item.id+" has_children = 0><em>"+box+"</em><label>"+item.name+"</label><span></span></li>";
                }

            }
            var _class = 'outer_box';
            if(parent_id == 0){
                _class += " root";
            }else{
                _class += " hide";
            }
            if(_class){
                _class = " class='"+_class+"'";
            }

            if(this.all_flag){
                var box_header_label = this.header_data[_data[parent_id][1]['level']] || _key_to_value[parent_id];
            }else{
                var box_header_label = this.header_data[_data[parent_id][0]['level']] || _key_to_value[parent_id];
            }

            html_list = "<div outer_parent_id="+parent_id+_class+"><div style='text-align: center;height: 30px;border-right: 1px solid #e8e8e8;'><label >"+box_header_label+"</label></div><div parent_id="+parent_id+" class='box' ><ul>"+html_list+"</ul></div></div>";

            html += html_list;

            _key_to_value.length = 0;
        }

        html = "<div class='cascadebox_list col-sm-9' style='padding: 0;'>"+html+"</div><div class='cascadebox_header col-sm-3' style='float: left;'></div>";

        $("#"+this_dom_id).addClass('cascadebox').html(html);
        this.width = $("#"+this_dom_id).width();
        this.setWidth();
        var that = this;
        $("#"+this_dom_id+" .children").on('click',function(){
            that.showChildren(this);
        });
        $("#"+this_dom_id+" input[type=checkbox]").on('change',function(){
            var flag = $(this).is(':checked');
            var this_div = $(this).parent().parent().parent().parent();
            var top_div = this_div.parent();
            var parentid = this_div.attr('parent_id');
            var id = $(this).val();
            var firstbox_nochildren_op = false;
            if(id == -1){
                if(flag){
                    if(parentid == 0){
                        $('#'+this_dom_id+'.cascadebox').find('input[type=checkbox]').prop('checked',true);
                        $('#'+this_dom_id+'.cascadebox li[has_children=1]').attr('children_select_all',1);
                        if(oppose_flag){
                            $('#'+oppose_box_id+'.cascadebox').find('input[type=checkbox]').prop('checked',false);
                            $('#'+oppose_box_id+'.cascadebox li[has_children=1]').attr('children_select_all',0);
                            $('#'+oppose_box_id+'.cascadebox .clear_header').trigger('click');
                        }
                    }else{
                        this_div.find('input[type=checkbox]').prop('checked',true);
                        if(parentid){
                            $("#"+this_dom_id+".cascadebox li[v="+parentid+"]").find('input[type=checkbox][value='+parentid+']').prop('checked',true);
                        }
                        this_div.find('li').each(function () {
                            var this_li = $(this);
                            var has_children = this_li.attr('has_children');
                            var this_id = this_li.attr('v');

                            if(has_children){
                                var children_div = top_div.parent().find('div[parent_id="'+this_id+'"]');
                                children_div.find('input[type=checkbox]').prop('checked',false);//先全部取消
                                children_div.find('input[type=checkbox][value="-1"]').trigger('click');
                            }
                        });

                        if(oppose_flag){
                            var this_div_oppose = $('#'+oppose_box_id+'.cascadebox div[parent_id='+parentid+']');
                            var top_div_oppose = this_div_oppose.parent();
                            this_div_oppose.find('input[type=checkbox]').prop('checked',false);
                            if(parentid){
                                $("#"+oppose_box_id+".cascadebox li[v="+parentid+"]").find('input[type=checkbox][value='+parentid+']').prop('checked',false);
                                $("#"+oppose_box_id+".cascadebox_header span[v="+parentid+"]").trigger('click');
                            }
                            this_div_oppose.find('li').each(function () {
                                var this_li = $(this);
                                var has_children = this_li.attr('has_children');
                                var this_id = this_li.attr('v');

                                if(has_children){
                                    var children_div = top_div_oppose.parent().find('div[parent_id="'+this_id+'"]');
                                    children_div.find('input[type=checkbox]').prop('checked',false);
                                }
                            });
                        }
                    }


                }else{
                    if(parentid == 0){
                        $('#'+this_dom_id+'.cascadebox').find('input[type=checkbox]').prop('checked',false);
                        $('#'+this_dom_id+'.cascadebox li[has_children=1]').attr('children_select_all',0);
                    }else{
                        this_div.find('input[type=checkbox]').prop('checked',false);
                        if(parentid){
                            $("#"+this_dom_id+".cascadebox li[v="+parentid+"]").find('input[type=checkbox][value='+parentid+']').prop('checked',false);
                        }
                        this_div.find('li').each(function () {
                            var this_li = $(this);
                            var has_children = this_li.attr('has_children');
                            var this_id = this_li.attr('v');
                            if(has_children){
                                var children_div = top_div.parent().find('div[parent_id="'+this_id+'"]');
                                children_div.find('input[type=checkbox]').prop('checked',true);//先全部勾选
                                children_div.find('input[type=checkbox][value="-1"]').trigger('click');
                            }
                        });
                    }

                }
            }else{
                var has_children = $(this).parent().parent().attr('has_children');
                if(has_children == 1){
                    var children_all_checkbox  =  top_div.parent().find('div[parent_id='+id+']').find('input[type=checkbox][value="-1"]');
                    children_all_checkbox.trigger('click');
                    if(oppose_flag){
                        if(flag){
                            var top_div_oppose = $('#'+oppose_box_id+'.cascadebox div[parent_id='+parentid+']').parent();
                            var the_checkbox_oppose = top_div_oppose.find('input[type=checkbox][value='+id+']');
                            var the_checkbox_oppose_flag = the_checkbox_oppose.is(':checked');
                            if(the_checkbox_oppose_flag){
                                the_checkbox_oppose.trigger('click');
                            }
                        }
                    }
                }else{
                    if(parentid == 0){
                        firstbox_nochildren_op = true;
                    }else{
                        firstbox_nochildren_op = false;
                    }
                    if(oppose_flag){
                        if(flag){
                            var top_div_oppose = $('#'+oppose_box_id+'.cascadebox div[parent_id='+parentid+']').parent();
                            var the_checkbox_oppose = top_div_oppose.find('input[type=checkbox][value='+id+']');
                            var the_checkbox_oppose_flag = the_checkbox_oppose.is(':checked');
                            if(the_checkbox_oppose_flag){
                                the_checkbox_oppose.trigger('click');
                            }
                        }
                    }
                }

            }

            if(parentid != 0){
                if(oppose_flag){
                    var top_div_oppose = $('#'+oppose_box_id+'.cascadebox div[parent_id='+parentid+']').parent();
                }else{
                    var top_div_oppose = null;
                }
                that.change_all(top_div,parentid,id,flag,oppose_flag,top_div_oppose);
            }

            if(firstbox_nochildren_op){
                if(flag){
                    if(that.selected_highlight_flag) $(this).parent().parent().addClass('selected');

                    var this_all_flag = true;
                    this_div.find('input[type=checkbox]').each(function () {
                        if($(this).val() == -1) return;
                        if(!$(this).is(':checked')) this_all_flag = false;
                    });
                    if(this_all_flag) this_div.find('input[type=checkbox][value="-1"]').prop('checked',true);
                    var text = $(this).parent().next('label').html();

                    if($("#"+this_dom_id+" .cascadebox_header a").length == 0){
                        $('#'+this_dom_id+' .cascadebox_header').append('<a class="clear_header">清空全部已选</a>');
                    }

                    $('#'+this_dom_id+' .cascadebox_header').append("<div><label>"+text+"</label><span v="+id+">x</span></div>");

                    $("#"+this_dom_id+" .cascadebox_header span").on('click',function(){
                        var obj = $(this);
                        var id = obj.attr('v');
                        var span_div = obj.parent();
                        var header_div = span_div.parent();
                        if(header_div.find('div').length < 2){
                            header_div.find('a').remove();
                        }
                        header_div.prev(".cascadebox_list").find('input[type=checkbox][value='+id+']').trigger('click');
                        span_div.remove();
                    });

                    $("#"+this_dom_id+" .cascadebox_header a").on('click',function(){
                        var obj = $(this);
                        var span_div = obj.parent();
                        span_div.prev('.cascadebox_list').find('input[type=checkbox]').prop('checked',false);
                        span_div.html('');
                        $("#"+this_dom_id+" .selected").removeClass('selected');
                    });
                }else{
                    if(that.selected_highlight_flag) $(this).parent().parent().removeClass('selected');

                    this_div.find('input[type=checkbox][value="-1"]').prop('checked',false);
                    $('#'+this_dom_id+' .cascadebox_header').find('span[v='+id+']').parent().remove();
                }

            }else{
                that.showChecked();
            }

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
            $("#"+this_dom_id+".cascadebox").find('input[type=checkbox][value='+this.old_selected[i]+']').trigger('click');
        }
        $('#'+this_dom_id+'.cascadebox li.selected').each(function () {
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
        var this_dom_id = this.dom_id;
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
            var o = $("#"+this_dom_id+" div[col="+_col+"]");
            if(o.length > 0){
                o.hide();
            }else{
                break;
            }
        }
        $("#"+this_dom_id+" div[outer_parent_id="+id+"]").attr('col',col*1+1).removeClass('hide').show();
        $("#"+this_dom_id+" div[parent_id="+id+"]").attr('col',col*1+1).removeClass('hide').show();
        this.setWidth();
    },
    showChecked:function(){
        var this_dom_id = this.dom_id;
        var html = '<a class="clear_header">清空全部已选</a>';
        var top_box = $("#"+this_dom_id).find('div[parent_id=0]');
        var top_box_all_flag = top_box.find('input[type=checkbox][value="-1"]').is(':checked');
        var all_select_first_box = false;
        if(top_box_all_flag){
            //如果顶级选项全选，并且所有选项都有复选框，那么直接显示所有顶级选项
            var all_has_checkbox = true;
            top_box.find('li').each(function () {
                if($(this).attr('v') == undefined || $(this).attr('v') == -1) return;
                var checkbox_input = $(this).find('input');
                if(checkbox_input.length == 1){
                    var text = checkbox_input.parent().next('label').html();
                    var id = checkbox_input.val();
                    html += "<div><label>"+text+"</label><span v="+id+">x</span></div>";
                }else{
                    all_has_checkbox = false;
                }

            });
            if(all_has_checkbox){
                all_select_first_box = true;
            }else{
                all_select_first_box = false;
            }
        }else{
            all_select_first_box = false;
        }

        if(!all_select_first_box){
            html = '<a class="clear_header">清空全部已选</a>';
            $("#"+this_dom_id+" input:checked").not('.hide2 input:checked').each(function(i,e){
                var obj = $(this);
                var parent_ul = obj.parent().parent().parent();
                var text = obj.parent().next('label').html();
                var id = obj.val();
                if(id == -1) return;//如果是全选选项，跳过
                var all_flag = parent_ul.find('input[type=checkbox][value="-1"]').is(':checked');
                var parent_id = parent_ul.parent().attr('parent_id');
                var checkbox_input = $('#'+this_dom_id+'.cascadebox li[v='+parent_id+']').find('input');

                if(all_flag && parent_id != 0 && checkbox_input.length == 1) return;//如果给box的全选被选中，且父级有checkbox，则不显示，直接显示父级

                html += "<div><label>"+text+"</label><span v="+id+">x</span></div>";
            });

        }


        $("#"+this_dom_id+" .cascadebox_header").html(html);
        $("#"+this_dom_id+" .cascadebox_header span").on('click',function(){
            var obj = $(this);
            var id = obj.attr('v');
            var span_div = obj.parent();
            var header_div = span_div.parent();
            if(header_div.find('div').length < 2){
                header_div.find('a').remove();
            }
            header_div.prev(".cascadebox_list").find('input[type=checkbox][value='+id+']').trigger('click');
            span_div.remove();
        });

        $("#"+this_dom_id+" .cascadebox_header a").on('click',function(){
            var obj = $(this);
            var span_div = obj.parent();
            span_div.prev('.cascadebox_list').find('input[type=checkbox]').prop('checked',false);
            span_div.html('');
            $("#"+this_dom_id+" .selected").removeClass('selected');
        });


        //选中背景加深
        if(this.selected_highlight_flag){
            //注意：如果选项数据很多，以下两句代码会导致很卡！
            $("#"+this.dom_id+" .selected").removeClass('selected');
            var that = this;
            $("#"+this.dom_id+" input:checked").each(function(){
                that.selected($(this).parent().parent());
            });
        }


    },
    selected:function(obj){
        $(obj).addClass('selected');
        var top_div = $(obj).parent().parent();
        var parentid = top_div.attr('parent_id');
        if(parentid){
            this.selected("#"+this.dom_id+" li[v="+parentid+"]");
        }
    },
    change_all:function (top_div,parentid,id, op_flag, oppose_flag, top_div_oppose) {

        var parent_li = $("#"+this.dom_id+".cascadebox li[v="+parentid+"]");
        var parent_top_div = parent_li.parent().parent();
        var parent_parentid = parent_top_div.attr('parent_id');

        if(op_flag){
            var top_all_flag = true;
            top_div.find('input[type=checkbox]').each(function () {
                if($(this).val() != -1){
                    if(!$(this).is(':checked')){
                        top_all_flag = false;
                    }
                }

            });

            top_div.find('li').each(function () {
                if($(this).attr('has_children') != undefined)
                    if($(this).attr('children_select_all') == 0)
                        top_all_flag = false;
            });

            if(top_all_flag){
                top_div.find('input[type=checkbox][value="-1"]').prop('checked',true);
                parent_li.find('input[type=checkbox][value='+parentid+']').prop('checked',true);
                if(parent_li.attr('children_select_all') != undefined)
                    parent_li.attr('children_select_all',1);
            }else{
                if(parent_li.attr('children_select_all') != undefined)
                    parent_li.attr('children_select_all',0);
            }
            if(oppose_flag){
                var parent_li_oppose = $("#"+this.oppose_box_id+".cascadebox li[v="+parentid+"]");
                top_div_oppose.find('input[type=checkbox][value="-1"]').prop('checked',false);
                if(parent_li_oppose.attr('children_select_all') != undefined)
                    parent_li_oppose.attr('children_select_all',0);
            }
        }else{

            if(parent_li.attr('children_select_all') != undefined)
                parent_li.attr('children_select_all',0);
            top_div.find('input[type=checkbox][value="-1"]').prop('checked',false);
            parent_li.find('input[type=checkbox][value='+parentid+']').prop('checked',false);
            parent_li.parent().find('input[type=checkbox][value="-1"]').prop('checked',false);

        }
        if(parentid !== 0 && parentid !== undefined){
            this.change_all(parent_top_div,parent_parentid,parentid, op_flag, oppose_flag, top_div_oppose);
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
        var this_dom_id = this.dom_id;
        //先清空数据
        $('#'+this_dom_id+'.clear_header').trigger('click');

        //显示设置数据
        for(var i=0; i< select_data.length; i++){
            $('#'+this_dom_id+'.cascadebox').find('input[type=checkbox][value='+select_data[i]+']').trigger('click');
        }
        $('#'+this_dom_id+'.cascadebox li.selected').each(function () {
            $(this).trigger('click');
        });

    },
    set_data_only:function (select_data) {
        var this_dom_id = this.dom_id;
        var html = '<a class="clear_header">清空全部已选</a>';
        var the_cascadebox_list_div = $("#"+this_dom_id+" .cascadebox_list");
        for(var i=0; i< select_data.length; i++){
            var the_checkbox = the_cascadebox_list_div.find('input[type=checkbox][value="'+select_data[i]+'"]');
            the_checkbox.prop('checked',true);
            var text = the_checkbox.parent().next().html();
            html += "<div><label>"+text+"</label><span v="+select_data[i]+">x</span></div>";

        }

        $("#"+this_dom_id+" .cascadebox_header").html(html);

        $("#"+this_dom_id+" .cascadebox_header span").on('click',function(){
            var obj = $(this);
            var id = obj.attr('v');
            var span_div = obj.parent();
            var header_div = span_div.parent();
            if(header_div.find('div').length < 2){
                header_div.find('a').remove();
            }
            header_div.prev(".cascadebox_list").find('input[type=checkbox][value='+id+']').trigger('click');
            span_div.remove();
        });

        $("#"+this_dom_id+" .cascadebox_header a").on('click',function(){
            var obj = $(this);
            var span_div = obj.parent();
            span_div.prev('.cascadebox_list').find('input[type=checkbox]').prop('checked',false);
            span_div.html('');
            $("#"+this_dom_id+" .selected").removeClass('selected');
        });


    },
    add_val:function (val) {
        $('#'+this.dom_id+'.cascadebox').find('input[type=checkbox][value='+val+']').trigger('click');
    },
    del_val:function (val) {
        $('#'+this.dom_id+' .cascadebox_header').find('span[v='+val+']').trigger('click');
    },
    show_item:function (val){
        var the_show_item = $('#'+this.dom_id+'.cascadebox li[v='+val+']');
        the_show_item.show();
    },
    hide_item:function (val) {
        var the_hide_item = $('#'+this.dom_id+'.cascadebox li[v='+val+']');
        if(the_hide_item.is(':checked')) the_hide_item.trigger('click');
        the_hide_item.hide();
        if(the_hide_item.attr('has_children') == 1)
            this.hide_all_children(val);
    },
    hide_all_children:function (val) {
        var child_div = $('#'+this.dom_id+'.cascadebox div[parent_id='+val+']');
        var outer_child_top_div = child_div.parent();
        outer_child_top_div.hide();
        var that = this;
        var the_all_checkbox = child_div.find('input[type=checkbox][value="-1"]');
        var the_all_check_flag = the_all_checkbox.is(':checked');
        if(the_all_check_flag){
            the_all_checkbox.trigger('click');
        }else{
            child_div.find('input[type=checkbox]:checked').trigger('click');
        }
        child_div.find('input[type=checkbox]').each(function () {
            var this_li = $(this).parent().parent();
            if(this_li.attr('has_children') == 1){
                that.hide_all_children(this_li.attr('v'));
            }

        });
    },
    hide_item_only:function (val) {
        var the_hide_item = $('#'+this.dom_id+'.cascadebox li[v='+val+']');
        the_hide_item.hide();
        if(the_hide_item.attr('has_children') == 1)
            this.hide_all_children_only(val);
    },
    hide_all_children_only:function (val) {
        var child_div = $('#'+this.dom_id+'.cascadebox div[parent_id='+val+']');
        var outer_child_top_div = child_div.parent();
        outer_child_top_div.hide();
        var that = this;
        child_div.find('input[type=checkbox]').each(function () {
            var this_li = $(this).parent().parent();
            if(this_li.attr('has_children') == 1){
                that.hide_all_children(this_li.attr('v'));
            }

        });
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
 * @param selected_highlight_flag [是否开启选中颜色加深，可以为空(不传)，默认为true。注意，选项太多的时候，开启会导致卡顿]
 * @param oppose_div_id [对立cascadebox的div的id，可以为空(不传)，默认为null]
 * @returns {_cascadebox} [返回cascadeBox实例]
 */
function cascadeBox(id, name, data, selected, header_data, all_flag, selected_highlight_flag, oppose_div_id){
    var obj = new _cascadebox();
    obj.init(id, name, data, selected, header_data, all_flag, selected_highlight_flag, oppose_div_id);
    obj.makeHtml();
    return obj;
}
