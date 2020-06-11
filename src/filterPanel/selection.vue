<template>
  <div class="el-table-filter e-table-filter">
    <div class="e-filter-search" v-if="filters.length>5&&!isFilted">
      <el-input
        size="mini"
        v-model="searchV"
        @input.native="search"
        placeholder="搜索/筛选"
        v-focus
        v-if="showPopper"
      ></el-input>
    </div>
    <div class="el-table-filter__content">
      <el-scrollbar wrap-class="el-table-filter__wrap">
        <el-checkbox-group class="el-table-filter__checkbox-group" v-model="filted">
          <el-checkbox v-for="(filter,i) in filterValues" :key="i" :label="filter">
            <span v-html="columnObj.formatter?columnObj.formatter(filter):(filter?filter:'空白')"></span>
          </el-checkbox>
        </el-checkbox-group>
      </el-scrollbar>
    </div>
    <div class="el-table-filter__bottom">
      <button
        @click="handleConfirm"
        :class="{ 'is-disabled': filted.length === 0 }"
        :disabled="filted.length === 0"
      >{{ '筛选' }}</button>
      <button @click="handleReset">{{ '重置' }}</button>
    </div>
  </div>
</template>

<script>
import mixinFilter from "./minix.js";
// import pinyin from "pinyin-match";
export default {
  mixins: [mixinFilter],
  data() {
    return {
      filted: [],
      searchV: "",
      timer: null
    };
  },
  methods: {
    handleReset() {
      this.$emit("filterChange", [], this.columnObj, this.column);
    },

    handleConfirm() {
      if (this.filterValues.length === this.filted.length) {
        this.$emit("filterChange", ["fullSelect"], this.columnObj, this.column);
        return;
      }
      this.$emit("filterChange", this.filted, this.columnObj, this.column);
    },

    search(e) {
      let value = e.target.value;
      if (this.timer) clearTimeout(this.timer);
      this.timer = setTimeout(() => {
        this.filterValues = this.filters.filter(f => {
          return f.indexOf(value) > -1;
        });
      }, 300);
    },

    showPopverPanel() {
      let colKey = this.column.property;
      if (
        this.filtedList.hasOwnProperty(colKey) &&
        this.filtedList[colKey].value
      ) {
        let value = this.filtedList[colKey].value;
        if (value.length === 1 && value[0] === "fullSelect") {
          this.filted = this.filterValues;
          return;
        }
        this.filted = value;
      }
    },

    reInit() {
      this.filted = [];
    }
  }
};
</script>

<style lang="scss">
.e-filter-search {
  padding-bottom: 5px;
  min-width: 178px;
}
</style>


