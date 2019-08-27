import {
    getmaxAndminObj,
    hasOwn,
} from "@utils/index.js"

export default {
    methods:{
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
        selectionChange(arr) {
            this.selectionRow = arr;
            this.$emit("selection-change", arr);
        },
    }
}