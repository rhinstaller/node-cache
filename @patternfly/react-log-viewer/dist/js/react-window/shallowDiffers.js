"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// Pulled from react-compat
// https://github.com/developit/preact-compat/blob/7c5de00e7c85e2ffd011bf3af02899b63f699d3a/src/index.js#L349
function shallowDiffers(prev, next) {
    for (const attribute in prev) {
        if (!(attribute in next)) {
            return true;
        }
    }
    for (const attribute in next) {
        if (prev[attribute] !== next[attribute]) {
            return true;
        }
    }
    return false;
}
exports.default = shallowDiffers;
//# sourceMappingURL=shallowDiffers.js.map