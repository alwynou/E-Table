export default {
    props: {
        value: [String, Number],
        column: Object,
        row: Object,
        columnObj: Object
    },
    computed: {
        value_: {
            get() {
                return this.value;
            },
            set(n) {
                this.$emit('setCellValue', n)
            }
        }
    }
}