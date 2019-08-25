<template>
  <el-select v-on="$listeners" v-bind="$attrs" v-model="value" filterable >
    <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value"></el-option>
  </el-select>
</template>

<script>
import mixinCell from "./minix.js";
export default {
  mixins: [mixinCell],
  props:{
      options:Array
  },
};
</script>