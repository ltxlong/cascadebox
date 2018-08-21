# cascadebox
js多级联动多选checkbox插件
![image](https://github.com/ltxlong/cascadebox/blob/master/cascadebox%E6%88%AA%E5%9B%BE.png)

# 使用说明
```html
<div id='cascadebox'></div> //这个div的id随便取名
```
- 参数1：插入cascadebox的div的id；
- 参数2：checkbox的name；
- 参数3：cascadebox所有选择项的数据；
- 参数4：预设选中的数据，可以为空(不传)或[]；
- 参数5：各级别名称，可以无限级，如果为空(不传)或[]，默认为3个级别，名称为['一级选项','二级选项','三级选项']
- 参数6：是否开启全选模式，可以为空(不传)，默认为true
- data的格式为：包含每个level数组，即data.push(level_arr)；如果想用本插件，但是数据格式不一致的，可以自己写js转换下就行了

- data节点参数说明：
- id:选项的id值 (必须)
- name:选项显示名称 (必须)
- parent_id:选项的父id，没有父选项或者顶级选项可以没有这个参数 (可选)
- level:选项的等级，顶级选项的level为0 (必须)
- no_checkbox:是否带复选框,true为不带，如果想默认带复选框，不带这个参数即可 (可选)

- cascadebox最终选中值：
- 以父级为优先，即如果一个项，如果它有子级，并且子级全选了，那么最终显示选中值为该项。
- 如果子级不全选，则只显示选中的子级
- 想要不以父级为优先，即父级节点的no_checkbox参数为true，不显示复选框即可

- 获取选中的项：obj.get_data()方法
- 重新设置选中的项：obj.set_data(select_arr)方法
- 增加选中项：obj.add_val(id)方法
- 删除选中项：obj.del_val(id)方法
```js
var pre_select_data = ["c_1", "c_2", "c_3", "c_4", "c_5", "c_6", "c_7", "c_8", "c_9"];
var cascadebox_header = [];
//var cascadebox_header = ['省份','城市','区县'];
//var obj = cascadeBox('cascadebox','checkboxname',data,[],[],true); //初始化插件，返回cascadeBox实例
var obj = cascadeBox('cascadebox','checkboxname',data,pre_select_data,cascadebox_header,true);

var select_data = obj.get_data();
```
![image](https://github.com/ltxlong/cascadebox/blob/master/cascadebox%E8%AF%B4%E6%98%8E%E5%9B%BE.png)

本插件开发源于业务上要移植今日头条的广告页面，要用到这一功能。

# 感谢 
本插件在 [tntreebox](https://github.com/binwind8/tntreebox) 的基础上进行重构，优化并且增加了很多新功能

