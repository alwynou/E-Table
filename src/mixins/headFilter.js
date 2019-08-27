import Vue from "vue";

import FilterPanel from "@/filterPanel/index.js"
import {
    hasOwn,
    isHasValue
} from "@utils/index.js"

export default {
    methods: {
        async headFilterBtnClick(columnObj, column, event) {
            let colKey = column.columnKey || column.property || column.id;

            if (this.filterLoads.some(fd => fd === colKey)) return; //已在loading状态点击无效
            const target = event.target;
            let cell = target.tagName === 'I' ? target : target.parentNode,
                filterPanel = this.filterPanels[colKey],
                filtersData = [];
            cell = cell.querySelector('.e-filter-tag') || cell;

            if (filterPanel && this.headFCNs.some(f => f === colKey)) { // 已经存在过滤面板且已打开面板
                filterPanel.doClose()
                return
            }

            this.filterLoads.push(colKey) //显示loading

            try { //await异步获取过滤数据时 捕获异常
                if (columnObj.getFilters && typeof columnObj.getFilters === 'function') {
                    filtersData = (await columnObj.getFilters(columnObj, column)) || []
                } else if (this.getFilters) {
                    filtersData = (await this.getFilters(columnObj, column)) || []
                }
            } catch (error) {
                this.filterLoads.splice(this.filterLoads.findIndex(fd => fd === colKey), 1)
                console.error(`[ETable warn]${error}`)
                return
            }

            if (filterPanel) { //存在但当前未打开
                this.filters = filtersData;
                filterPanel.filtedList = this.filtedList;
                filterPanel.filters = filtersData;
                this.filterLoads.splice(this.filterLoads.findIndex(fd => fd === colKey), 1);
                filterPanel.doShow();
                return
            }

            if (!filterPanel) { //不存在过滤面板
                filterPanel = new Vue(FilterPanel)
                this.filterPanels[colKey] = filterPanel
                filterPanel.reference = cell
                filterPanel.columnId = colKey
                filterPanel.column = column
                filterPanel.columnObj = columnObj
                filterPanel.table = this._self
                filterPanel.filters = filtersData,
                    filterPanel.filtedList = this.filtedList,
                    filterPanel.$mount(document.createElement('div'));
                this.filterLoads.splice(this.filterLoads.findIndex(fd => fd === colKey), 1)
                filterPanel.doShow()
            }

        },

        setHeadFCN(id) {
            if (this.headFCNs.length === 1) {
                this.filterPanels[this.headFCNs[0]].doClose()
            }
            this.headFCNs.push(id);
        },

        closeHeadFCN(id) {
            let index = this.headFCNs.findIndex(h => h === id)
            if (index >= 0) {
                this.headFCNs.splice(index, 1)
            }
        },

        filterChange(value, columnObj, column) {
            let colKey = column.columnKey || column.property || column.id;
            if (!isHasValue(value)) {
                hasOwn(this.filtedList, colKey) ?
                    this.$delete(this.filtedList, colKey) :
                    null;
            } else {
                this.$set(this.filtedList, colKey, {
                    columnObj: columnObj,
                    value: Array.isArray(value) ? value : [value],
                    key: colKey
                });
            }
            this.$emit("e-filter-change", value, column, this.filtedList);
        },
    }
}