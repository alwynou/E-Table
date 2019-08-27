export default {
    methods: {
        cellClick(row, column, cell, event) {
            this.$emit('cell-click', row, column, event)
            if (!this.isEditCell(row, column)) {
                return
            }
            event.stopPropagation();
            this.editX = row.rowIndex;
            this.editY = column.property;
        },
        isEditCell(row, column) {
            return this.editMap.some(e => e.x === row.rowIndex && e.y === column.property)
        },
        setEditMap(obj) {
            if (this.editMap.some(e => e.x === obj.x && e.y === obj.y)) return;
            this.editMap.push(obj)
        },
       
    },
    watch: {
        editX(n) {
            if (n !== null) {
                window.addEventListener('click', this.cancelEdit)
            } else {
                window.removeEventListener('click', this.cancelEdit)
            }
        },
    }
}