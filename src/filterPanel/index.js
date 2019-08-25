import selection from "./selection.vue"
import single from "./single.vue"
import datePicker from "./datepicker.vue"
const filterComponents = {
    selection,
    single,
    datePicker
}

export default {
    render(h) {
        let _this = this
        return h('el-popover', {
            props: {
                reference: this.reference,
                popperClass: 'e-popover ' + (_this.columnObj.filterPopperClass || ""),
                transition: _this.columnObj.filterTransition || 'el-zoom-in-top',
                visibleArrow: !!_this.columnObj.filterVisibleArrow || false,
                placement: _this.columnObj.filterPlacement || 'bottom'
            },
            on: {
                hide: this.hide,
                show: this.show,
            },
            ref: "filterPane",
            scopedSlots: {
                default: function (props) {
                    let options = {
                        attrs: {
                            ..._this.columnObj.filterAttrs
                        },
                        props: {
                            filters: _this.filters,
                            filtedList: _this.filtedList,
                            column: _this.column,
                            columnObj: _this.columnObj,
                            showPopper: _this.showPopper
                        },
                        on: {
                            ..._this.columnObj.filterListeners,
                            filterChange: _this.filterChange
                        }
                    };
                    if (_this.columnObj.filterComponent && typeof _this.columnObj.filterComponent === 'object') {
                        return h(_this.columnObj.filterComponent, options)
                    }
                    return h(filterComponents[_this.columnObj.filterType || 'selection'], options)
                }
            }
        })
    },
    data() {
        return {
            reference: null,
            showPopper: false,
        }
    },
    methods: {
        filterChange(value, columnObj, column) {
            this.table.filterChange(value, columnObj, column)
            this.doClose()
        },
        
        hide() {
            this.showPopper = false
            this.table.closeHeadFCN(this.columnId);
            this.table.$emit('filter-panel-hide', this.column, this.columnObj)
        },
        show() {
            this.showPopper = true
            this.table.setHeadFCN(this.columnId);
            this.table.$emit('filter-panel-show', this.column, this.columnObj)
        },

        doShow() {
            this.$refs.filterPane.doShow();
        },
        doClose() {
            this.$refs.filterPane.doClose();
        },
    },
    mounted() {
        this.reference.removeEventListener('click', this.$refs.filterPane.doToggle)
    },
}