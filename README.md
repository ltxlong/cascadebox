# cascadebox
多选联动checkbox插件
https://github.com/ltxlong/cascadebox/blob/master/cascadebox%E6%88%AA%E5%9B%BE.png

# 使用说明
<div id='cascadebox'></div>//这个div的id顺便取名

//参数1：插入cascadebox的div的id；
//参数2：checkbox的name；
//参数3：cascadebox所有选择项的数据；
//参数4：预设选中的数据，可以为空(不传)或[]；
//参数5：各级别名称，可以无限级，如果为空(不传)或[]，默认为3个级别，名称为['一级选项','二级选项','三级选项']
//参数6：是否开启全选模式，可以为空(不传)，默认为true
//data的格式为：包含每个level数组，即data.push(level_arr)；如果想用本插件，但是数据格式不一致的，可以自己写js转换下就行了
//cascadebox最终选中值：以父级为优先，即如果一个项，如果它有子级，并且子级全选了，那么最终显示选中值为该项。如果子级不全选，则只显示选中的子级
//获取选中的项：obj.get_data()方法
//重新设置选中的项：obj.set_data(select_arr)方法
//增加选中项：obj.add_val(id)方法
//删除选中项：obj.del_val(id)方法
var obj = cascadeBox('cascadebox','checkboxname',data,[],[],true);
var select_data = obj.get_data();

# 感谢 https://github.com/binwind8
本插件在 https://github.com/binwind8/tntreebox 的基础上进行重构，优化并且增加了很多新功能

