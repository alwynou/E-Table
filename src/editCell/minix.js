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
                this.$emit('setValue', n)
            }
        }
    }
}