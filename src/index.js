import ETable from './e-table.js'

const install = function (Vue) {
    // if (install.installed) return;
    Vue.component(ETable.name, ETable)
}

if (typeof window !== 'undefined' && window.Vue) {
    install(window.Vue)
}

export {
    ETable
}

export default {
    install,
    ETable
}