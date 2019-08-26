import Vue from "vue";
import './style/index.scss';

import {
    getmaxAndminObj,
    hasOwn,
    isFunction,
    isObject,
    mergeOptions,
    isHasValue
} from "@utils/index.js"

import FilterPanel from "./filterPanel/index.js"

import defaultC from "./editCell/default.vue"
import selection from "./editCell/selection.vue"

const editComponents = {
    default: defaultC,
    selection: selection
}


export default {

    name: 'ETable',

    inheritAttrs: false,

    render(h) {
        const _this = this;

        const columnRender = function (col, h) {
            if (!hasOwn(col, 'childrens')) {
                if (col.hidden === true) return;

                return h('el-table-column', {
                    props: {
                        ...col
                    },
                    key: col['column-key'] || col.prop,
                    scopedSlots: {
                        header: col.defaultHeader ? null : function (props) {
                            let {
                                column,
                                $index
                            } = props;

                            let colKey = column.columnKey || column.property || column.id;

                            return h('span', {
                                class: {
                                    'e-custom-header': true
                                }
                            }, [(col.label || col.prop),
                                (function () {
                                    if (_this.tableConfig.filter === false || col.filter !== true) return;

                                    return h('transition', {
                                        attrs: {
                                            name: 'el-fade-in-linear',
                                            appear: true
                                        }
                                    }, [h('span', { // filter button
                                        class: {
                                            'e-filter-btn': true
                                        }
                                    }, [h('i', { // icon
                                        class: {
                                            'e-filter-tag': true,
                                            'active': _this.headFCNs.some(hn => hn === colKey),
                                                'el-icon-loading': _this.filterLoads.some(fl => fl === colKey),
                                                'el-icon-arrow-down': !_this.filterLoads.some(fl => fl === colKey),
                                                'filted': hasOwn(_this.filtedList, colKey) && _this.filtedList[colKey].value,

                                        },
                                        on: {
                                            click: e => {
                                                e.stopPropagation();
                                                _this.headFilterBtnClick(col, column, e)
                                            }
                                        },
                                    })])])

                                })()
                            ])
                        },
                        default: function (props) { //custom table cell
                            let {
                                row,
                                column
                            } = props;

                            let funControl = isFunction(col.editControl) ? col.editControl.call(null, row[col.prop], row, column) : true,
                                isCan = (_this.tableConfig.cellEdit !== false && col.edit && funControl) ? true : false;

                            isCan ? _this.setEditMap({
                                x: row.rowIndex,
                                y: column.property
                            }) : null;

                            if (isCan && _this.editX === row.rowIndex && _this.editY === column.property) {
                                let options = {
                                    attrs: {
                                        ...col.editAttrs
                                    },
                                    props: {
                                        value_: row[col.prop],
                                        column: column,
                                        columnObj: col,
                                        row: row
                                    },
                                    on: {
                                        ...col.editListeners,
                                        change: (v) => {
                                            row[col.prop] = v
                                            _this.$emit('cell-value-change', v, row, column, col)
                                        }
                                    },
                                    nativeOn: {
                                        click: (e) => {
                                            e.stopPropagation()
                                        }
                                    },
                                    directives: [{
                                        name: 'focus'
                                    }]
                                };

                                if (col.editComponent && typeof col.editComponent === 'object') {
                                    return h(col.editComponent, options)
                                } else {
                                    return h(editComponents[col.editType || 'default'], options)
                                }

                            } else {
                                if (col.renderCell && typeof col.renderCell === 'function') { //custom cell render
                                    return col.renderCell.call(_this._renderProxy, h, {
                                        value: row[col.prop],
                                        row: row,
                                        column: column,
                                    })
                                } else { //default cell render
                                    return h('span', {
                                        domProps: {
                                            innerHTML: (col.formatter && typeof col.formatter === 'function') ?
                                                col.formatter(row[col.prop]) : row[col.prop]
                                        }
                                    })
                                }
                            }
                        }
                    }
                })
            } else {
                if (Array.isArray(col.childrens) && col.childrens.length > 0) {
                    return h('el-table-column', {
                        attrs: {
                            label: col.label || col.prop
                        }
                    }, [...col.childrens.map(function (column) {
                        return columnRender(column, h)
                    })])
                }
                console.error(`[ETable warn] childrens need Array and can't be empty`)
                return null;
            }

        }

        const indAndSel = function () {
            let indSel = [],
                config = _this.tableConfig;
            const indSelTemp = function (name) {
                let indSelattrs = {
                    type: name,
                    fixed: _this.hasLeftFixed || config[name].fixed || false
                }
                if (isObject(config[name])) {
                    indSelattrs = {
                        ...config[name],
                        ...indSelattrs
                    }
                }
                return h('el-table-column', {
                    attrs: {
                        ...indSelattrs
                    },
                    // scopedSlots: {
                    //     head: name === 'index' ? function (props) {
                    //         return h('span', '1')
                    //     } : null
                    // }
                })
            }
            if (config.index !== false) {
                indSel.push(indSelTemp('index', config))
            }
            if (config.selection !== false) {
                indSel.push(indSelTemp('selection', config))
            }
            return indSel
        }

        return h('el-table', {
            ref: 'elTable',
            props: {
                ...this.$attrs,
                rowStyle: this.rowStyle_,
                cellClassName: this.cellClassName_,
                rowClassName: this.rowClassName_,
            },
            class: {
                'e-table': true,
            },
            on: {
                ...this.$listeners,
                ...this.eListeners
            },
            directives: this.tableConfig.scroll === true ? [{
                name: 'autoScroll'
            }] : null,
            scopedSlots: {
                empty: function () {
                    return _this.$slots.empty
                },
                append: function () {
                    return _this.$slots.append
                }
            },
        }, [...indAndSel(), // index and selection
            this.columns.map(function (col) { // render column
                return columnRender(col, h)
            }),
            this.$slots.default //  slot columns
        ])
    },


    computed: {
        eListeners() {
            return {
                'cell-click': this.cellClick,
                'row-click': this.rowClick,
                'selection-change': this.selectionChange,
                'sort-change': this.sortChange
            }
        },
        hasLeftFixed() {
            return this.columns.some(
                c => hasOwn(c, 'fixed') && (c.fixed === "left" || c.fixed === true)
            );
        },
        maxSelectionRow() {
            if (this.selectionRow.length == 0) return null;
            return this.selectionRow.reduce((start, end) => {
                return start.rowIndex > end.rowIndex ? start : end;
            });
        },
        minSelectionRow() {
            if (this.selectionRow.length == 0) return null;
            return this.selectionRow.reduce((start, end) => {
                return start.rowIndex < end.rowIndex ? start : end;
            });
        },
    },

    directives: {
        focus: {
            inserted(el) {
                let Element = el.querySelector('input')
                if (Element) {
                    Element.focus()
                }
            }
        },
        autoScroll: {
            componentUpdated(el) {
                let warp = el.querySelector('.el-table__body-wrapper'),
                    body = warp.querySelector('.el-table__body'),
                    timer = null;
                warp.addEventListener("DOMMouseScroll", wheel, false);
                warp.onmousewheel = wheel

                function wheel(event) {
                    let e = event || window.event,
                        H = warp.clientHeight,
                        bH = body.clientHeight,
                        W = warp.clientWidth,
                        bW = body.clientWidth,
                        delta = 0;
                    if (W >= bW) return;
                    if (e.wheelDelta) {
                        delta = e.wheelDelta / 120;
                    } else if (e.detail) {
                        delta = -e.detail / 3;
                    }
                    if (delta > 0) { // up
                        if (warp.scrollLeft > 0) {
                            e.preventDefault();
                            let t = 0;
                            timer ? clearInterval(timer) : null;
                            timer = setInterval(() => {
                                warp.scrollLeft -= 5;
                                t += 1;
                                if (t >= 150) {
                                    clearInterval(timer);
                                }
                            }, 1)
                        }
                    } else { // down
                        if (H >= bH || H + warp.scrollTop == bH) {
                            e.preventDefault();
                            let t = 0;
                            timer ? clearInterval(timer) : null;
                            timer = setInterval(() => {
                                warp.scrollLeft += 5;
                                t += 1;
                                if (t >= 150) {
                                    clearInterval(timer);
                                }
                            }, 1)
                        }
                    }
                }
            }
        }
    },

    methods: {
        sortChange({
            column,
            prop,
            order
        }) {
            let colKey = column.columnKey || column.property || column.id
            this.closeFilterPanel(colKey);
            this.editMap = [];
            this.$emit('sort-change', {
                column,
                prop,
                order
            })
        },

        rowClick(row, column, event) {
            this.$emit('row-click', row, column, event)
            if (hasOwn(this.$attrs, 'highlight-current-row') ||
                !this.tableConfig.selection ||
                this.isEditCell(row, column))
                return;

            let refsElTable = this.$refs.elTable;
            if (this.CtrlDown) {
                refsElTable.toggleRowSelection(row);
                return;
            }
            let findRow = this.selectionRow.find(c => c.rowIndex === row.rowIndex);
            if (
                this.shiftOrAltDown &&
                this.selectionRow.length > 0
            ) {
                let maxAndmin = getmaxAndminObj(
                    row,
                    this.maxSelectionRow,
                    this.minSelectionRow
                );
                refsElTable.clearSelection();
                for (let index = maxAndmin.min; index <= maxAndmin.max; index++) {
                    refsElTable.toggleRowSelection(this.$attrs.data[index], true);
                }
            } else {
                if (findRow && this.selectionRow.length === 1) {
                    refsElTable.toggleRowSelection(row, false);
                    return;
                }
                refsElTable.clearSelection();
                refsElTable.toggleRowSelection(row);
            }
        },

        rowStyle_({
            row,
            rowIndex
        }) {
            Object.defineProperty(row, "rowIndex", {
                value: rowIndex,
                writable: true,
                enumerable: false
            });
            return this.rowStyle ? this.rowStyle.call(null, {
                row,
                rowIndex
            }) : null
        },

        rowClassName_({
            row,
            rowIndex
        }) {
            let rowName = this.rowClassName ? this.rowClassName.call(null, {
                row,
                column,
                rowIndex,
                columnIndex
            }) : ""
            var findRow = this.selectionRow.find(c => c.rowIndex == row.rowIndex);
            if (findRow) {
                rowName = "current-row " + rowName;
            }
            return rowName;
        },

        cellClick(row, column, cell, event) {
            this.$emit('cell-click', row, column, event)
            if (!this.isEditCell(row, column)) {
                // this.cancelEdit();
                return
            }
            event.stopPropagation();
            this.editX = row.rowIndex;
            this.editY = column.property;
        },

        selectionChange(arr) {
            this.selectionRow = arr;
            this.$emit("selection-change", arr);
        },

        cancelEdit() {
            this.editX = null;
            this.editY = null;
        },

        cellClassName_({
            row,
            column,
            rowIndex,
            columnIndex
        }) {
            let cellName = this.cellClassName ? this.cellClassName.call(null, {
                row,
                column,
                rowIndex,
                columnIndex
            }) : ""
            if (this.isEditCell(row, column)) {
                cellName += " edit-cell"
                if (this.editX === row.rowIndex && this.editY === column.property) {
                    cellName += " edit-active"
                }
            }
            return cellName
        },

        setEditMap(obj) {
            if (this.editMap.some(e => e.x === obj.x && e.y === obj.y)) return;
            this.editMap.push(obj)
        },

        isEditCell(row, column) {
            return this.editMap.some(e => e.x === row.rowIndex && e.y === column.property)
        },

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

        keyDown(event) {
            let key = event.keyCode;
            if (key == 17) this.CtrlDown = true;
            if (key == 16 || key == 18) this.shiftOrAltDown = true;
        },

        keyUp(event) {
            let key = event.keyCode;
            if (key == 17) this.CtrlDown = false;
            if (key == 16 || key == 18) this.shiftOrAltDown = false;
        },

        attrsFilter() {
            for (let c = 0; c < this.columns.length; c++) {
                this.traversalCol(this.columns[c]);
            }
        },
        traversalCol(c) {
            if (!hasOwn(c, "childrens") || !Array.isArray(c["childrens"])) {
                //filter header init
                if (!c.defaultHeader) {
                    let filName = ["filters"];
                    filName.forEach(f => {
                        if (hasOwn(c, f)) {
                            delete c[f];
                        }
                    });
                }
            } else {
                if (Array.isArray(c["childrens"]) && c["childrens"].length > 0) {
                    for (let cc = 0; cc < c.childrens.length; cc++) {
                        this.traversalCol(c.childrens[cc]);
                    }
                }
            }
        },

        /**Methods */
        closeFilterPanel(key) {
            if (hasOwn(this.filterPanels, key)) {
                this.filterPanels[key].doClose()
                return
            }
            console.error(`${key} is not exit`)
        },
        clearFiltedColumn(key, callback = function () {}) {
            if (hasOwn(this.filtedList, key)) {
                this.$delete(this.filtedList, key);
                callback(true)
                return
            }
            callback(false)
        },
        clearAllFiltedColumn() {
            this.filtedList = {};
        }
    },

    created() {
        this.tableConfig = mergeOptions(this.tableConfig, this.config);
        this.attrsFilter();
    },

    mounted() {
        window.addEventListener("keydown", this.keyDown, false);
        window.addEventListener("keyup", this.keyUp, false);
    },

    updated() {
        if (this.reLayoutTimer) clearTimeout(this.reLayoutTimer);
        this.reLayoutTimer = setTimeout(() => {
            this.$refs.elTable ? this.$refs.elTable.doLayout() : null;
        }, 300);
    },

    beforeDestroy() {
        window.removeEventListener("keydown", this.keyDown);
        window.removeEventListener("keyup", this.keyUp);
    },

    props: {
        columns: {
            type: Array,
            default: function () {
                return []
            }
        },
        config: Object,
        rowStyle: Function,
        rowClassName: Function,
        cellClassName: Function,
        getFilters: Function

    },

    data() {
        return {
            reLayoutTimer: null,

            filterLoads: [],
            filtedList: {},
            filterPanels: {},
            headFCNs: [],
            selectionRow: [],
            editX: null,
            editY: null,
            editMap: [],

            tableConfig: {
                index: true,
                selection: true,
            }
        }
    },

    watch: {
        editX(n) {
            if (n !== null) {
                window.addEventListener('click', this.cancelEdit)
            } else {
                window.removeEventListener('click', this.cancelEdit)
            }
        },
        "$attrs.data": function (n) {
            this.editMap = []
        }
    }

}