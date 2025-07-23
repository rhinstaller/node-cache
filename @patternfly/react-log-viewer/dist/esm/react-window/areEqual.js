import { __rest } from "tslib";
import shallowDiffers from './shallowDiffers';
// Custom comparison function for React.memo().
// It knows to compare individual style props and ignore the wrapper object.
// See https://reactjs.org/docs/react-api.html#reactmemo
export function areEqual(prevProps, nextProps) {
    const { style: prevStyle } = prevProps, prevRest = __rest(prevProps, ["style"]);
    const { style: nextStyle } = nextProps, nextRest = __rest(nextProps, ["style"]);
    return !shallowDiffers(prevStyle, nextStyle) && !shallowDiffers(prevRest, nextRest);
}
//# sourceMappingURL=areEqual.js.map