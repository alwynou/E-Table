import {
    isFunction
} from "@utils/index.js"

import defaultC from "@/editCell/default.vue"
import selection from "@/editCell/selection.vue"
const editComponents = {
    default: defaultC,
    selection: selection
}


export default function (props, h, col) { //custom table cell
    const _this = this;
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