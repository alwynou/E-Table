import ETable from './e-table.js'

const install = function (Vue) {
    Vue.component(ETable.name, ETable)
}

if (typeof window !== 'undefined' && window.Vue) {
    install(window.Vue)
}

export default {
    install,
    ETable
}