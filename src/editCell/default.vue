<template>
  <el-input v-on="$listeners" v-bind="$attrs"  v-model="value_" ></el-input>
</template>

<script>
import mixinCell from "./minix.js";
export default {
  mixins: [mixinCell]
};
</script>

<style lang="scss" scoped>
</style>