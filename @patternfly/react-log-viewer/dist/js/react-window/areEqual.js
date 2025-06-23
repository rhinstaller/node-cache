"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.areEqual = void 0;
const tslib_1 = require("tslib");
const shallowDiffers_1 = tslib_1.__importDefault(require("./shallowDiffers"));
// Custom comparison function for React.memo().
// It knows to compare individual style props and ignore the wrapper object.
// See https://reactjs.org/docs/react-api.html#reactmemo
function areEqual(prevProps, nextProps) {
    const { style: prevStyle } = prevProps, prevRest = tslib_1.__rest(prevProps, ["style"]);
    const { style: nextStyle } = nextProps, nextRest = tslib_1.__rest(nextProps, ["style"]);
    return !(0, shallowDiffers_1.default)(prevStyle, nextStyle) && !(0, shallowDiffers_1.default)(prevRest, nextRest);
}
exports.areEqual = areEqual;
//# sourceMappingURL=areEqual.js.map