import './style/index.scss'
import event from './mixins/Event.js'
import select from './mixins/select.js'
import methods from './mixins/methods.js'
import editCell from './mixins/editCell.js'
import directives from './mixins/directives.js'
import headFilter from './mixins/headFilter.js'
import cellRender from './components/cellRender.js'
import columnHeader from './components/columnHeader.js'
import indexAndSelection from './components/indexAndSelection.js'
import { hasOwn, mergeOptions, isArray } from '@utils/index.js'
import { isObject } from 'core-js/fn/object'

export default {
	name: 'ETable',

	mixins: [headFilter, methods, editCell, select, event, directives],

	inheritAttrs: false,

	render(h) {
		const _this = this
		function columnRender(col, h) {
			if (!hasOwn(col, 'childrens')) {
				if (col.hidden === true) return null

				return h('el-table-column', {
					props: {
						...col,
					},
					key: col.prop,
					scopedSlots: {
						header:
							!col.defaultHeader &&
							(props => {
								return columnHeader.call(_this, props, h, col)
							}),
						default: props => cellRender.call(_this, props, h, col),
					},
				})
			} else {
				if (col.hidden === true) return
				if (isArray(col.childrens) && col.childrens.length) {
					return h(
						'el-table-column',
						{
							attrs: {
								...col,
								label: col.label || col.prop,
							},
						},
						[
							...col.childrens.map(column => {
								return columnRender(column, h)
							}),
						]
					)
				}
			}
		}

		const tableRender = h(
			'el-table',
			{
				ref: 'elTable',
				props: {
					...this.$attrs,
					rowStyle: this.rowStyle_,
					cellClassName: this.cellClassName_,
					rowClassName: this.rowClassName_,
				},
				class: {
					'e-table': true,
				},
				on: {
					...this.$listeners,
					...this.eListeners,
				},

				scopedSlots: {
					empty: function () {
						return _this.$slots.empty
					},
				},
			},
			[
				...indexAndSelection.call(this, h), // index and selection

				this.columns.map(function (col) {
					// render column
					return columnRender(col, h)
				}),

				this.$slots.default, //  slot columns

				this.$slots.append && h('div', { slot: 'append' }, this.$slots.append), // slot append
			]
		)

		const hasPaginationTemp = () => {
			const defPaginationOpt = {
				background: true,
				layout: 'prev, pager, next',
				total: 0,
			}
			const onList = Object.keys(this.$listeners)
				.filter(name => /^(pagination-)/.test(name))
				.reduce((on, name) => {
					on[name.replace(/^(pagination-)/, '')] = this.$listeners[name]
					return on
				}, {})

			const paginationRender = h('ElPagination', {
				props: {
					...defPaginationOpt,
					...(isObject(this.pagination) ? this.pagination : {}),
				},
				on: onList,
			})

			return h('div', { class: ['e-table-pagination'] }, [
				tableRender,
				paginationRender,
			])
		}

		return this.pagination ? hasPaginationTemp() : tableRender
	},

	computed: {
		eListeners() {
			return {
				'cell-click': this.cellClick,
				'row-click': this.rowClick,
				'selection-change': this.selectionChange,
				'sort-change': this.sortChange,
			}
		},
		hasLeftFixed() {
			return this.columns.some(
				c => hasOwn(c, 'fixed') && (c.fixed === 'left' || c.fixed === true)
			)
		},
		maxSelectionRow() {
			if (this.selectionRow.length == 0) return null
			return this.selectionRow.reduce((start, end) => {
				return start.rowIndex > end.rowIndex ? start : end
			})
		},
		minSelectionRow() {
			if (this.selectionRow.length == 0) return null
			return this.selectionRow.reduce((start, end) => {
				return start.rowIndex < end.rowIndex ? start : end
			})
		},
	},

	methods: {
		rowStyle_({ row, rowIndex }) {
			Object.defineProperty(row, 'rowIndex', {
				value: rowIndex,
				writable: true,
				enumerable: false,
			})
			return this.rowStyle
				? this.rowStyle.call(null, {
						row,
						rowIndex,
				  })
				: null
		},

		rowClassName_({ row, rowIndex }) {
			let rowName = this.rowClassName
				? this.rowClassName.call(null, {
						row,
						column,
						rowIndex,
						columnIndex,
				  })
				: ''
			var findRow = this.selectionRow.find(c => c.rowIndex == row.rowIndex)
			if (findRow) {
				rowName = 'current-row ' + rowName
			}
			return rowName
		},

		cellClassName_({ row, column, rowIndex, columnIndex }) {
			let cellName = this.cellClassName
				? this.cellClassName.call(null, {
						row,
						column,
						rowIndex,
						columnIndex,
				  })
				: ''
			if (this.isEditCell(row, column)) {
				cellName += ' edit-cell'
				if (this.editX === row.rowIndex && this.editY === column.property) {
					cellName += ' edit-active'
				}
			}
			return cellName
		},

		attrsFilter() {
			for (let c = 0; c < this.columns.length; c++) {
				this.traversalCol(this.columns[c])
			}
		},

		traversalCol(c) {
			if (!hasOwn(c, 'childrens') || !Array.isArray(c['childrens'])) {
				//当默认表头过滤和自定义过滤同时存在时 根据defaultHeader 显示哪个过滤
				if (hasOwn(c, 'filters') && !c.defaultHeader) {
					delete c['filters']
				}
			} else {
				if (Array.isArray(c['childrens']) && c['childrens'].length > 0) {
					for (let cc = 0; cc < c.childrens.length; cc++) {
						this.traversalCol(c.childrens[cc])
					}
				}
			}
		},
	},

	created() {
		this.tableConfig = mergeOptions(this.tableConfig, this.config)
		this.attrsFilter()
		console.log(this.$root['$options']['components']['ETable'])
	},

	props: {
		columns: {
			type: Array,
			default: function () {
				return []
			},
		},
		config: Object,
		rowStyle: Function,
		rowClassName: Function,
		cellClassName: Function,
		getFilters: Function,
		pagination: [Object, Boolean],
	},

	data() {
		return {
			reLayoutTimer: null,

			filterLoads: [],
			filtedList: {},
			filterPanels: {},
			headFCNs: [],
			selectionRow: [],
			editX: null,
			editY: null,
			editMap: [],

			tableConfig: {
				index: true,
				selection: true,
			},
		}
	},

	watch: {
		'$attrs.data': function (n) {
			this.editMap = []
		},
	},
}
