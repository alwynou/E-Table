<template>
  <transition name="el-zoom-in-top">
    <div class="el-table-filter">
      <ul class="el-table-filter__list">
        <li
          class="el-table-filter__list-item"
          :class="{ 'is-active': filted === undefined || filted === null }"
          @click="handleSelect(null)"
        >{{ '全部' }}</li>
        <li
          class="el-table-filter__list-item"
          v-for="(filter,i) in filterValues"
          :key="filter+i"
          :label="filter"
          :class="{ 'is-active': isActive(filter) }"
          @click="handleSelect(filter)"
        >
          <span v-html="columnObj.formatter?columnObj.formatter(filter):filter"></span>
        </li>
      </ul>
    </div>
  </transition>
</template>

<script>
import mixinFilter from "./minix.js";
export default {
  mixins: [mixinFilter],
  data() {
    return {
      filted: null
    };
  },
  methods: {
    isActive(filter) {
      return filter === this.filted;
    },
    handleSelect(value) {
      value ? (this.filted = value) : null;
      this.$emit("filterChange", value, this.columnObj, this.column);
    },
    reInit() {
      this.filted = null;
    }
  }
};
</script>

<style lang="scss" >
</style>