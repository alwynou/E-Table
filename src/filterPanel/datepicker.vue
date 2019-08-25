<template>
  <el-date-picker
    v-bind="$attrs"
    v-on="$listeners"
    v-model="dateValue"
    type="daterange"
    v-if="showPopper"
    v-focus
    popper-class="e-filter-datepicker"
    class="e-filter-datepicker"
    @change="change"
  ></el-date-picker>
</template>

<script>
import mixinFilter from "./minix.js";
export default {
  mixins: [mixinFilter],
  data() {
    return {
      dateValue: []
    };
  },
  methods: {
    change(value) {
      this.$emit("filterChange", value, this.columnObj, this.column);
    },
    reInit(){
      this.dateValue = [];
    }
  },
};
</script>

<style lang="scss" >
.e-filter-datepicker.el-date-editor.el-range-editor {
  position: absolute;
  height: 0px;
  padding: 0px;
  opacity: 0;
  left: -175px;
  overflow: hidden;
  &.el-input__inner {
    line-height: 0px;
    border: 0px;
    padding: 0px;
  }
}
.el-popper.e-filter-datepicker .popper__arrow {
  display: none;
}
</style>