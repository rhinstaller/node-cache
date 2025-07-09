"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LogViewerToolbarContext = exports.LogViewerContext = exports.useLogViewerContext = void 0;
const react_1 = require("react");
const useLogViewerContext = () => (0, react_1.useContext)(exports.LogViewerContext);
exports.useLogViewerContext = useLogViewerContext;
exports.LogViewerContext = (0, react_1.createContext)(null);
exports.LogViewerToolbarContext = (0, react_1.createContext)(null);
//# sourceMappingURL=LogViewerContext.js.map