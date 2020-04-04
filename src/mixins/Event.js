export default {
  methods: {
    sortChange({ column, prop, order }) {
      let colKey = column.columnKey || column.property || column.id;
      this.closeFilterPanel(colKey);

      this.editMap = [];
      this.cancelEdit();

      this.$emit("sort-change", {
        column,
        prop,
        order,
      });
    },

    keyDown(event) {
      let key = event.keyCode;
      switch (key) {
        case 17:
          this.CtrlDown = true;
          break;
        case 16 || 18:
          this.shiftOrAltDown = true;
          break;
        case 27:
          this.EscDown = true;
          break;
      }
    },

    keyUp(event) {
      let key = event.keyCode;
      switch (key) {
        case 17:
          this.CtrlDown = false;
          break;
        case 16 || 18:
          this.shiftOrAltDown = false;
          break;
        case 27:
          this.EscDown = false;
          this.editX !== null && this.cancelEdit();
          break;
      }
    },
  },
  mounted() {
    window.addEventListener("keydown", this.keyDown, false);
    window.addEventListener("keyup", this.keyUp, false);
  },

  updated() {
    if (this.reLayoutTimer) clearTimeout(this.reLayoutTimer);
    this.reLayoutTimer = setTimeout(() => {
      //this.$refs.elTable ? this.$refs.elTable.doLayout() : null;
    }, 100);
  },

  beforeDestroy() {
    window.removeEventListener("keydown", this.keyDown);
    window.removeEventListener("keyup", this.keyUp);
  },
};
