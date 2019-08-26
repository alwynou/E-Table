export default {
    props: {
        value_: [String, Number],
        column: Object,
        row: Object,
        columnObj: Object 
    },
    data(){
        return {
            value:this.value_,
        }
    },
}