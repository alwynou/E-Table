export default {
  directives: {
    focus: {
      inserted(el) {
        let Element = el.querySelector("input");
        if (Element) {
          Element.focus();
        }
      },
    },
    autoScroll: {
      componentUpdated(el) {
        let warp = el.querySelector(".el-table__body-wrapper"),
          body = warp.querySelector(".el-table__body"),
          timer = null;
        warp.addEventListener("DOMMouseScroll", wheel, false);
        warp.onmousewheel = wheel;

        function wheel(event) {
          let e = event || window.event,
            H = warp.clientHeight,
            bH = body.clientHeight,
            W = warp.clientWidth,
            bW = body.clientWidth,
            delta = 0;
          if (W >= bW) return;
          if (e.wheelDelta) {
            delta = e.wheelDelta / 120;
          } else if (e.detail) {
            delta = -e.detail / 3;
          }
          if (delta > 0) {
            // up
            if (warp.scrollLeft > 0) {
              e.preventDefault();
              let t = 0;
              timer ? clearInterval(timer) : null;
              timer = setInterval(() => {
                warp.scrollLeft -= 5;
                t += 1;
                if (t >= 150) {
                  clearInterval(timer);
                }
              }, 1);
            }
          } else {
            // down
            if (H >= bH || H + warp.scrollTop == bH) {
              e.preventDefault();
              let t = 0;
              timer ? clearInterval(timer) : null;
              timer = setInterval(() => {
                warp.scrollLeft += 5;
                t += 1;
                if (t >= 150) {
                  clearInterval(timer);
                }
              }, 1);
            }
          }
        }
      },
    },
  },
};
