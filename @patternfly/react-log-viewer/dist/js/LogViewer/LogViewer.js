"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LogViewer = void 0;
const tslib_1 = require("tslib");
const jsx_runtime_1 = require("react/jsx-runtime");
const react_1 = require("react");
const LogViewerContext_1 = require("./LogViewerContext");
const react_styles_1 = require("@patternfly/react-styles");
const LogViewerRow_1 = require("./LogViewerRow");
const utils_1 = require("./utils/utils");
const react_window_1 = require("../react-window");
const log_viewer_1 = tslib_1.__importDefault(require("./css/log-viewer"));
const ansi_up_1 = tslib_1.__importDefault(require("../ansi_up/ansi_up"));
let canvas;
const getCharNums = (windowWidth, font) => {
    // if given, use cached canvas for better performance
    // else, create new canvas
    canvas = canvas || document.createElement('canvas');
    const context = canvas.getContext('2d');
    context.font = font;
    const oneChar = context.measureText('a');
    return Math.floor(windowWidth / oneChar.width);
};
const LogViewerBase = (0, react_1.memo)((_a) => {
    var { data = '', hasLineNumbers = true, height = 600, overScanCount = 10, loadingContent = '', toolbar, width, theme = 'light', scrollToRow = 0, itemCount = undefined, header, footer, onScroll, innerRef, isTextWrapped = true, initialIndexWidth, useAnsiClasses, fastRowHeightEstimationLimit = 5000 } = _a, props = tslib_1.__rest(_a, ["data", "hasLineNumbers", "height", "overScanCount", "loadingContent", "toolbar", "width", "theme", "scrollToRow", "itemCount", "header", "footer", "onScroll", "innerRef", "isTextWrapped", "initialIndexWidth", "useAnsiClasses", "fastRowHeightEstimationLimit"]);
    const [searchedInput, setSearchedInput] = (0, react_1.useState)('');
    const [rowInFocus, setRowInFocus] = (0, react_1.useState)({ rowIndex: scrollToRow, matchIndex: 0 });
    const [searchedWordIndexes, setSearchedWordIndexes] = (0, react_1.useState)([]);
    const [currentSearchedItemCount, setCurrentSearchedItemCount] = (0, react_1.useState)(0);
    const [lineHeight, setLineHeight] = (0, react_1.useState)(0);
    const [charNumsPerLine, setCharNumsPerLine] = (0, react_1.useState)(0);
    const [indexWidth, setIndexWidth] = (0, react_1.useState)(0);
    const [resizing, setResizing] = (0, react_1.useState)(false);
    const [loading, setLoading] = (0, react_1.useState)(true);
    const [listKey, setListKey] = (0, react_1.useState)(1);
    /* Parse data every time it changes */
    const parsedData = (0, react_1.useMemo)(() => (0, utils_1.parseConsoleOutput)(data), [data]);
    const isChrome = (0, react_1.useMemo)(() => navigator.userAgent.indexOf('Chrome') !== -1, []);
    const ansiUp = new ansi_up_1.default();
    // eslint-disable-next-line camelcase
    ansiUp.escape_html = false;
    // eslint-disable-next-line camelcase
    ansiUp.use_classes = useAnsiClasses;
    const ref = (0, react_1.useRef)(null);
    const logViewerRef = innerRef || ref;
    const containerRef = (0, react_1.useRef)(null);
    let resizeTimer = null;
    (0, react_1.useEffect)(() => {
        if (containerRef && containerRef.current) {
            window.addEventListener('resize', callbackResize);
            setLoading(false);
            createDummyElements();
            ansiUp.resetStyles();
        }
        return () => window.removeEventListener('resize', callbackResize);
    }, [containerRef.current]);
    const callbackResize = () => {
        if (!resizing) {
            setResizing(true);
        }
        if (resizeTimer) {
            clearTimeout(resizeTimer);
        }
        resizeTimer = setTimeout(() => {
            setResizing(false);
            createDummyElements();
        }, 100);
    };
    (0, react_1.useEffect)(() => {
        setLoading(resizing);
    }, [resizing]);
    const dataToRender = (0, react_1.useMemo)(() => ({
        parsedData,
        logViewerRef,
        rowInFocus,
        searchedWordIndexes
    }), [parsedData, logViewerRef, rowInFocus, searchedWordIndexes]);
    (0, react_1.useEffect)(() => {
        if (logViewerRef && logViewerRef.current) {
            logViewerRef.current.resetAfterIndex(0);
        }
    }, [parsedData]);
    (0, react_1.useEffect)(() => {
        if (scrollToRow && parsedData.length) {
            setRowInFocus({ rowIndex: scrollToRow, matchIndex: 0 });
            // only in this way (setTimeout) the scrollToItem will work
            setTimeout(() => {
                if (logViewerRef && logViewerRef.current) {
                    logViewerRef.current.scrollToItem(scrollToRow, 'center');
                }
            }, 1);
        }
    }, [parsedData, scrollToRow]);
    const createDummyElements = () => {
        // create dummy elements
        const dummyIndex = document.createElement('span');
        dummyIndex.className = (0, react_styles_1.css)(log_viewer_1.default.logViewerIndex);
        const dummyText = document.createElement('span');
        dummyText.className = (0, react_styles_1.css)(log_viewer_1.default.logViewerText);
        const dummyListItem = document.createElement('div');
        dummyListItem.className = (0, react_styles_1.css)(log_viewer_1.default.logViewerListItem);
        const dummyList = document.createElement('div');
        dummyList.className = (0, react_styles_1.css)(log_viewer_1.default.logViewerList);
        // append dummy elements
        dummyListItem.appendChild(dummyIndex);
        dummyListItem.appendChild(dummyText);
        dummyList.appendChild(dummyListItem);
        containerRef.current.appendChild(dummyList);
        // compute styles
        const dummyIndexStyles = getComputedStyle(dummyIndex);
        const dummyTextStyles = getComputedStyle(dummyText);
        setLineHeight(parseFloat(dummyTextStyles.lineHeight));
        const lineWidth = hasLineNumbers
            ? containerRef.current.clientWidth -
                (parseFloat(dummyTextStyles.paddingLeft) +
                    parseFloat(dummyTextStyles.paddingRight) +
                    parseFloat(dummyIndexStyles.width))
            : containerRef.current.clientWidth -
                (parseFloat(dummyTextStyles.paddingLeft) + parseFloat(dummyTextStyles.paddingRight));
        const charNumsPerLine = getCharNums(lineWidth, `${dummyTextStyles.fontWeight} ${dummyTextStyles.fontSize} ${dummyTextStyles.fontFamily}`);
        setCharNumsPerLine(charNumsPerLine);
        setIndexWidth(parseFloat(dummyIndexStyles.width));
        // remove dummy elements from the DOM tree
        containerRef.current.removeChild(dummyList);
        setListKey((listKey) => listKey + 1);
    };
    const scrollToRowInFocus = (searchedRowIndex) => {
        setRowInFocus(searchedRowIndex);
        logViewerRef.current.scrollToItem(searchedRowIndex.rowIndex, 'center');
        // use this method to scroll to the right
        // if the keyword is out of the window when wrapping text
        if (!isTextWrapped) {
            setTimeout(() => {
                const element = containerRef.current.querySelector('.pf-v6-c-log-viewer__string.pf-m-current');
                element && element.scrollIntoView({ block: 'nearest', inline: 'center' });
            }, 1);
        }
    };
    (0, react_1.useEffect)(() => {
        setListKey((listKey) => listKey + 1);
    }, [isTextWrapped]);
    const computeRowHeight = (rowText, estimatedHeight) => {
        const logViewerList = containerRef.current.firstChild.firstChild;
        // early return with the estimated height if the log viewer list hasn't been rendered yet,
        // this will be called again once it has been rendered and the correct height will be set
        if (!logViewerList) {
            return estimatedHeight;
        }
        const dummyText = document.createElement('span');
        dummyText.className = (0, react_styles_1.css)(log_viewer_1.default.logViewerText);
        dummyText.innerHTML = rowText;
        logViewerList.appendChild(dummyText);
        const computedHeight = dummyText.clientHeight;
        logViewerList.removeChild(dummyText);
        return computedHeight;
    };
    const guessRowHeight = (rowIndex) => {
        if (!isTextWrapped) {
            return lineHeight;
        }
        // strip ansi escape code before estimate the row height
        const rowText = (0, utils_1.stripAnsi)(parsedData[rowIndex]);
        // get the row numbers of the current text
        const numRows = Math.ceil(rowText.length / charNumsPerLine);
        // multiply by line height to get the total height
        const heightGuess = lineHeight * (numRows || 1);
        // because of a bug in react-window (which seems to be limited to chrome) we need to
        // actually compute row height in long lines to prevent them from overflowing.
        // related issue https://github.com/bvaughn/react-window/issues/593
        if (rowText.length > fastRowHeightEstimationLimit && isChrome && isTextWrapped) {
            return computeRowHeight(rowText, heightGuess);
        }
        return heightGuess;
    };
    const createList = (parsedData) => ((0, jsx_runtime_1.jsx)(react_window_1.VariableSizeList, Object.assign({ outerClassName: (0, react_styles_1.css)(log_viewer_1.default.logViewerScrollContainer), innerClassName: (0, react_styles_1.css)(log_viewer_1.default.logViewerList), height: containerRef.current.clientHeight, width: containerRef.current.clientWidth, itemSize: guessRowHeight, itemCount: typeof itemCount === 'undefined' ? parsedData.length : itemCount, itemData: dataToRender, ref: logViewerRef, overscanCount: overScanCount, onScroll: onScroll, isTextWrapped: isTextWrapped, hasLineNumbers: hasLineNumbers, indexWidth: indexWidth, ansiUp: ansiUp }, { children: LogViewerRow_1.LogViewerRow }), listKey));
    return ((0, jsx_runtime_1.jsx)(LogViewerContext_1.LogViewerContext.Provider, Object.assign({ value: {
            parsedData,
            searchedInput
        } }, { children: (0, jsx_runtime_1.jsxs)("div", Object.assign({ className: (0, react_styles_1.css)(log_viewer_1.default.logViewer, hasLineNumbers && log_viewer_1.default.modifiers.lineNumbers, !isTextWrapped && log_viewer_1.default.modifiers.nowrap, initialIndexWidth && log_viewer_1.default.modifiers.lineNumberChars, theme === 'dark' && log_viewer_1.default.modifiers.dark) }, (initialIndexWidth && {
            style: {
                '--pf-v6-c-log-viewer--line-number-chars': initialIndexWidth + 1
            }
        }), props, { children: [toolbar && ((0, jsx_runtime_1.jsx)(LogViewerContext_1.LogViewerToolbarContext.Provider, Object.assign({ value: {
                        itemCount,
                        searchedInput,
                        rowInFocus,
                        searchedWordIndexes,
                        currentSearchedItemCount,
                        scrollToRow: scrollToRowInFocus,
                        setRowInFocus,
                        setSearchedInput,
                        setSearchedWordIndexes,
                        setCurrentSearchedItemCount
                    } }, { children: (0, jsx_runtime_1.jsx)("div", Object.assign({ className: (0, react_styles_1.css)(log_viewer_1.default.logViewerHeader) }, { children: toolbar })) }))), header, (0, jsx_runtime_1.jsx)("div", Object.assign({ className: (0, react_styles_1.css)(log_viewer_1.default.logViewerMain), style: { height, width }, ref: containerRef }, { children: loading ? (0, jsx_runtime_1.jsx)("div", { children: loadingContent }) : createList(parsedData) })), footer] })) })));
}, react_window_1.areEqual);
exports.LogViewer = (0, react_1.forwardRef)((props, ref) => ((0, jsx_runtime_1.jsx)(LogViewerBase, Object.assign({ innerRef: ref }, props))));
exports.LogViewer.displayName = 'LogViewer';
//# sourceMappingURL=LogViewer.js.map