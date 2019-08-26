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
  data() {
    return {
      value: this.value_
    };
  },
};
</script>

<style lang="scss" scoped>
</style>