<template>
  <el-input v-bind="$attrs" v-on="$listeners" v-model="value"></el-input>
</template>

<script>
export default {
  props: {
    value_: [String, Number],
    column: Object,
    row: Object,
    columnObj: Object
  },
  computed: {
    value: {
      get() {
        return this.value_;
      },
      set(n) {
        this.$emit("setValue", n);
      }
    }
  }
};
</script>

<style lang="scss" scoped>
</style>