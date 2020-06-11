export default {
	props: {
		filters: {
			type: Array,
			default: function() {
				return []
			},
		},
		filtedList: Object,
		columnObj: Object,
		column: Object,
		showPopper: Boolean,
	},
	data() {
		return {
			filterValues: [],
		}
	},
	directives: {
		focus: {
			inserted(el) {
				let Element = el.querySelector('input')
				if (Element) {
					Element.focus()
				}
			},
		},
	},
	computed: {
		isFilted() {
			let colKey = this.column.property
			if (
				this.filtedList.hasOwnProperty(colKey) &&
				this.filtedList[colKey].value
			) {
				let value = this.filtedList[colKey].value
				if (value.length == 0) {
					return false
				}
				return true
			}
			return false
		},
	},
	watch: {
		showPopper: {
			immediate: true,
			handler(n) {
				n ? (this.showPopverPanel ? this.showPopverPanel() : null) : null
				if (n && !this.isFilted) {
					this.reInit ? this.reInit() : null
				}
			},
		},
		filters: {
			immediate: true,
			handler(n) {
				this.filterValues = [...n]
			},
		},
		isFilted(n) {
			if (!n) {
				this.reInit && this.reInit()
			}
		},
	},
}
