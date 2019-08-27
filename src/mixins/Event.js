export default {
    methods: {
        sortChange({
            column,
            prop,
            order
        }) {
            let colKey = column.columnKey || column.property || column.id
            this.closeFilterPanel(colKey);

            this.editMap = [];
            this.cancelEdit();

            this.$emit('sort-change', {
                column,
                prop,
                order
            })
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
}