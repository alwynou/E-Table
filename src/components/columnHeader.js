import { hasOwn } from "@utils/index.js";

export default function (props, h, col) {
  const _this = this;
  let { column } = props;

  let colKey = column.property;

  return h(
    "span",
    {
      class: {
        "e-custom-header": true,
      },
    },
    [
      col.label || col.prop,
      (function () {
        if (_this.tableConfig.filter === false || col.filter !== true) return;

        return h(
          "transition",
          {
            attrs: {
              name: "el-fade-in-linear",
              appear: true,
            },
          },
          [
            h(
              "span",
              {
                // filter button
                class: {
                  "e-filter-btn": true,
                },
              },
              [
                h("i", {
                  // icon
                  class: {
                    "e-filter-tag": true,
                    active: _this.headFCNs.some((hn) => hn === colKey),
                    "el-icon-loading": _this.filterLoads.some(
                      (fl) => fl === colKey
                    ),
                    "el-icon-arrow-down": !_this.filterLoads.some(
                      (fl) => fl === colKey
                    ),
                    filted:
                      hasOwn(_this.filtedList, colKey) &&
                      _this.filtedList[colKey].value,
                  },
                  on: {
                    click: (e) => {
                      e.stopPropagation();
                      _this.headFilterBtnClick(col, column, e);
                    },
                  },
                }),
              ]
            ),
          ]
        );
      })(),
    ]
  );
}
