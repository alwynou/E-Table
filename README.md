# E-Table
基于Element UI 表格组件封装的，添加一些实用功能，如可自定义编辑单元格，自定义下拉筛选（可异步获取数据），快捷选中数据等功能。

### 使用方式

```html
<template>
    <e-table
      :data="tableData"
      columns="tableColumns">
   </e-table>
</template>

<script>
export default{
    data(){
        return {
            tableData:[{
            date: '2016-05-02',
            name: '王小虎',
            address: '上海市普陀区金沙江路 1518 弄'
          }, {
            date: '2016-05-04',
            name: '王小虎',
            address: '上海市普陀区金沙江路 1517 弄'
          }],
          columns:[{
              prop:'date',
              label:'日期',
              width:250
          },{
              prop:'name',
              label:'姓名',
              width:250
          },{
              prop:'address',
              label:'地址',
              width:250
          }]
        }
    }
}
</script>
```

这就是`e-table`的基本用法，可以看出来和`el-table`的区别就在于把`el-table-column`的插槽形式转化为了`columns`数组对象集合的形式。 所以他的书写格式只要把`el-table-column`上可配置项写成键值对插入到对应的`columns`数组对象中,就可以生效。所以这些属性就不一一列举, `el-table`上的属性一样可以直接写在`e-table`标签上。


当然也增加了一些属性，如下
### `e-table`增加属性
| 参数       | 说明                                                      | 类型     | 可选值           | 默认值 |
| ---------- | --------------------------------------------------------- | -------- | ---------------- | ------ |
| columns    | 所有列的对象集合数组                                      | Array    | -                | -      |
| config     | 表格配置对象,可以对索引列,checkBox列是否可以筛选,进行控制 | Object   | 见config属性说明 | -      |
| getFilters | 获取筛选数据的总控制中心，必须返回一个`resolve`的`Promis` | Function | -                | -      |

#### `config`属性
| 参数      | 说明                                                         | 类型           | 可选值     | 默认值 |
| --------- | ------------------------------------------------------------ | -------------- | ---------- | ------ |
| index     | 控制显示索引列,当为Object时可以添加`el-table-column`中的属性 | Boolean/Object | -          | false  |
| selection | 控制显示check多选列的显示                                    | Boolean/Object | -          | false  |
| filter    | 控制所有列自定义筛选是否可用                                 | Boolean        | true/false | true   |

### `e-table`增加事件
| 事件名            | 说明                     | 参数                       |
| ----------------- | ------------------------ | -------------------------- |
| e-filter-change   | 筛选数据变化时触发       | value, column, filtedList  |
| cell-value-change | 编辑单元格数据变化时触发 | value,row,column,columnObj |


### `columns`中增加的属性

| 参数               | 说明                                                                                 | 类型       | 可选值                                | 默认值                 |
| ------------------ | ------------------------------------------------------------------------------------ | ---------- | ------------------------------------- | ---------------------- |
| defaultHeader      | 是否使用`el-table`默认列表头,如果要使用默认表头必须设为true                          | Boolean    | true/false                            | true                   |
| filter             | 是否开启自定义筛选                                                                   | Boolean    | true/false                            | false                  |
| filterType         | 内置下拉筛选类型                                                                     | String     | 'selection' / 'single' / 'datePicker' | 'selection'            |
|                    |
| filterComponent    | 自定义下拉筛选组件（后面细讲用法）                                                   | Compontent | -                                     | -                      |
| filterAttrs        | 筛选组件可接收的属性对象                                                             | Object     | -                                     | -                      |
| filterListeners    | 筛选组件触发事件接受对象                                                             | Object     | -                                     | -                      |
| getFilters         | 当前列筛选获取筛选数据函数，必须返回一个`resolve`的`Promise`                         | Function   | -                                     | -                      |
| edit               | 控制是否可编辑                                                                       | Boolean    | true/false                            | false                  |
| editType           | 内置编辑类型                                                                         | String     | 'default'/'selection'                 | 'default'              |
| editControl        | 控制这一列中每一行是否可编辑，必须返回`true`or`false`,接受参数：（value,row,column） | Function   | true                                  | -                      |
| editAttrs          | 编辑组件可接收的属性对象                                                             | Object     | -                                     | -                      |
| editListeners      | 编辑组件触发的事件接受对象                                                           | Object     | -                                     | -                      |
| editComponent      | 自定义编辑组件                                                                       | Component  | -                                     | -                      |
| renderCell         | 自定义渲染单元格Function，接收参数（h,value,row,column）                             | Function   | -                                     | -                      |
| formatter          | 格式化显示单元格内容，接收参数（value,row,column）                                   | Function   | -                                     | -                      |
| filterTransition   | 下拉筛选popoverc出现动画                                                             | String     | -                                     | 'el-falel-zoom-in-top' |
| filterPopperClass  | 下拉筛选popover添加类名                                                              | String     | -                                     | -                      |
| filterPlacement    | 下拉筛选出现相对位置                                                                 | String     | 同`el-popover`组件参数                | 'bottom'               |
| filterVisibleArrow | 是否显示下拉筛选箭头                                                                 | Boolean    | true/false/                           | false                  |
| hidden             | 控制是否显示该列                                                                     | Boolean    | true/false                            | false                  |

### slot 插槽

同`el-table`的插槽

####  `filterComponent`具体使用
```javascript
<script>
import myComponent from "./myComponent.vue"

columns:[{
    prop:'custom',
    label:'自定义组件',
    filterComponent: myComponent,
    filterAttrs:{
        size:'mini',
        //...
    },
    filterListeners:{
        focus:(e)=>{
            //code
        },
        //...
      }
    },
]
</script>
```
 你可以自定义下拉组件，和内置下拉筛选组件一样接受如下`props`，也可以通过`filterAttrs`增加属性，`filterListeners`可以接受你组件的事件响应。
 
 - **filters**  ：通过`getfilters`传入的数据
 - **filtedList**   ：当前已筛选数据（Array）
 - **column** ：column对象
 - **columnObj** ： `columns`里面的自身对象
 - **showPopover** ： 下拉popover的显示状态 true/false

如果数据改变应当给父级相应一个事件，这样才能让内部知道你的数据变了，才能在`e-filter-change`获取你最新数据。

事件：**`this.$emit('filterChange',newValue,columnObj,column)`**
 
 
 - filterChange： 事件名
 - newValue: 最新的筛选数据
 - columnObj：`columns`里面的自身对象
 - column： column对象

 表格内部操作删除了筛选该列的数据时应做出响应，还有每次点击下拉筛选时应该保持数据一直，可以这样做（仅供参考）

-  实时监听是否已被筛选，可以使用`computed`计算，列如：
```javascript
computed: {
        isFilted() {
            let colKey = this.column.columnKey || this.column.property || this.column.id
            if (this.filtedList.hasOwnProperty(colKey) && this.filtedList[colKey].value) {
                let value = this.filtedList[colKey].value;
                if (value.length == 0) {
                    return false
                }
                return true
            }
         return false
 }
```

- 监听下拉状态,新传入的`filters`,和`isFilted`,做出响应 用`watch`属性

```javascript
 watch: {
        showPopper: {
            immediate: true,
            handler(n) {
                //做你自己的逻辑处理
            }
        },
        filters: {
            immediate: true,
            handler(n) {
                this.filterValues = [...n];  //filterValue 为你组件的绑定的值 
            }
        },
        isFilted(n) {
            if (!n) { //如果已经清除当前筛选状态
                this.reInit ? this.reInit() : null //reInit 为将你组件绑定的值初始化，例如为重置为 []
            }
        }
    }
```

> 为什么不直接将`filtedList`直接作为绑定值有如下原因
>  - 每个组件可能绑定的默认值类型不一样 而`filtedList`为方面操作全部转为`Array`
>  - 会直接操作修改父级数据不是，Vue倡导的，因保持`props`的单向数据流
>  - 可以更灵活的使用组件


#### `editComponent`的具体使用

> 示例参考`filterComponent`, 相对于`filterComponent`使用就简单许多了，同理，会接受如下`props`，也可以通过`editAttrs`增加属性，`editListeners`可以接受你组件的响应事件

 - **value_** ： 当前单元格内的值（注意**_**）
 - **column**：当前列对象
 - **row**：当前行数据对象
 - **columnObj**：`columns`中自身对象

当你改变原数据时也应该通知父级,不然原数据无法更改。（不应该直接将`value_`作为你组件绑定的值，而应该caopy一份，例如在`data`里面重新什么一个属性将`value_`的值赋给他）

事件：**`this.$emit('change',value)`** 

>如果你只是基于`elementUI`可编辑类组件经行二次修改的话通过`$listeners`属性你或许都可以不写这个事件，因 为基本都会有这个change事件响应。
>
>不过`change`事件就不能在`editListeners`获取到了,不过你可以在`cell-value-change`的table事件中获取。

---- 

### 部分效果
![编辑-选择](https://raw.githubusercontent.com/Lozvoe/E-Table/master/src/image/%E7%BC%96%E8%BE%91-%E9%80%89%E6%8B%A9.gif)
![筛选](https://github.com/Lozvoe/E-Table/blob/master/src/image/%E7%AD%9B%E9%80%89.gif?raw=true)

