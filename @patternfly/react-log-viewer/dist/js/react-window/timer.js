"use strict";
// Animation frame based implementation of setTimeout.
// Inspired by Joe Lambert, https://gist.github.com/joelambert/1002116#file-requesttimeout-js
Object.defineProperty(exports, "__esModule", { value: true });
exports.requestTimeout = exports.cancelTimeout = void 0;
const hasNativePerformanceNow = typeof performance === 'object' && typeof performance.now === 'function';
const now = hasNativePerformanceNow ? () => performance.now() : () => Date.now();
function cancelTimeout(timeoutID) {
    cancelAnimationFrame(timeoutID.id);
}
exports.cancelTimeout = cancelTimeout;
function requestTimeout(callback, delay) {
    const start = now();
    function tick() {
        if (now() - start >= delay) {
            callback.call(null);
        }
        else {
            timeoutID.id = requestAnimationFrame(tick);
        }
    }
    const timeoutID = {
        id: requestAnimationFrame(tick)
    };
    return timeoutID;
}
exports.requestTimeout = requestTimeout;
//# sourceMappingURL=timer.js.map