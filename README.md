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
- 参数7：是否开启选中颜色加深，可以为空(不传)，默认为true。注意，选项太多的时候，开启会导致卡顿
- 参数8：对立cascadebox的div的id(两个cascadebox有同样的选项，是对立关系，一个选项只能在其中一个cascadebox被选中)

- data的格式为：直接将每个节点push进去就行，即data.push(node_obj)；如果想用本插件，但是数据格式不一致的，可以自己写js转换下就行了

- data节点参数说明：
- id：选项的id值 (必须)
- name：选项显示名称 (必须)
- parent_id：选项的父id，顶级选项或者没有父选项可以没有这个参数 (可选)
- level：选项的等级，顶级选项的level为0 (必须)
- no_checkbox：是否带复选框,true为不带，如果想默认带复选框，不带这个参数即可 (可选)

- cascadebox最终选中值：
- 以父级为优先，即如果一个项，如果它有子级，并且子级全选了，那么最终显示选中值为该项。
- 如果子级不全选，则只显示选中的子级
- 想要不以父级为优先，即父级节点的no_checkbox参数为true，不显示复选框即可

- 获取选中的项：obj.get_data()方法
- 重新设置选中的项：obj.set_data(select_arr)方法
- 重新设置选中的项：obj.set_data_only(select_arr)方法（和set_data方法的区别是，set_data_only仅仅是显示和打钩选中项，没顾及全选和颜色加深）
- 增加选中项：obj.add_val(id)方法
- 删除选中项：obj.del_val(id)方法
- 显示某选项(包括其所有子选项)：obj.show_item(id)方法
- 隐藏某选项(包括其所有子选项,并且删除选中)：obj.hide_item(id)方法
- 隐藏某选项(包括其所有子选项,不会删除选中)：obj.hide_item_only(id)方法
```js
var pre_select_data = ["c_1", "c_2", "c_3", "c_4", "c_5", "c_6", "c_7", "c_8", "c_9"];
var cascadebox_header = [];
//var cascadebox_header = ['省份','城市','区县'];
//如果想某一级别的cascadebox_header显示父级的名称，那么只要传参为''即可。
//例如想要城市级别的cascadebox_header动态显示父级名称，即传参应为['省份','','区县']。
//var obj = cascadeBox('cascadebox','checkboxname',data); //初始化插件，返回cascadeBox实例
var obj = cascadeBox('cascadebox','checkboxname',data,pre_select_data,cascadebox_header,true,true,null);

var select_data = obj.get_data();

//两个cascadebox对立关系：
//var include_obj = cascadeBox('cascadebox_include','checkboxname_include',data,pre_select_data,cascadebox_header,true,true,'cascadebox_exclude');
//var exclude_obj = cascadeBox('cascadebox_exclude','checkboxname_exclude',data,pre_select_data,cascadebox_header,true,true,'cascadebox_include');

```

结合bootstrap，拥抱响应式：
![image](https://github.com/ltxlong/cascadebox/blob/master/%E7%BB%93%E5%90%88bootstrap1.png)
![image](https://github.com/ltxlong/cascadebox/blob/master/%E7%BB%93%E5%90%88bootstrap2.png)
![image](https://github.com/ltxlong/cascadebox/blob/master/%E7%BB%93%E5%90%88bootstrap3.png)
![image](https://github.com/ltxlong/cascadebox/blob/master/%E7%BB%93%E5%90%88bootstrap4.png)


本插件开发源于业务上要移植今日头条的广告页面，要用到这一功能。

# 感谢 
本插件在 [tntreebox](https://github.com/binwind8/tntreebox) 的基础上进行重构，优化并且增加了很多新功能

