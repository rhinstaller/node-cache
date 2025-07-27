import { __rest } from "tslib";
import React, { useState, useEffect, memo } from 'react';
import { LogViewerContext, LogViewerToolbarContext } from './LogViewerContext';
import { css } from '@patternfly/react-styles';
import { LogViewerRow } from './LogViewerRow';
import { parseConsoleOutput, stripAnsi } from './utils/utils';
import { VariableSizeList as List, areEqual } from '../react-window';
import styles from './css/log-viewer';
import AnsiUp from '../ansi_up/ansi_up';
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
const LogViewerBase = memo((_a) => {
    var { data = '', hasLineNumbers = true, height = 600, overScanCount = 10, loadingContent = '', toolbar, width, theme = 'light', scrollToRow = 0, itemCount = undefined, header, footer, onScroll, innerRef, isTextWrapped = true, initialIndexWidth, useAnsiClasses, fastRowHeightEstimationLimit = 5000 } = _a, props = __rest(_a, ["data", "hasLineNumbers", "height", "overScanCount", "loadingContent", "toolbar", "width", "theme", "scrollToRow", "itemCount", "header", "footer", "onScroll", "innerRef", "isTextWrapped", "initialIndexWidth", "useAnsiClasses", "fastRowHeightEstimationLimit"]);
    const [searchedInput, setSearchedInput] = useState('');
    const [rowInFocus, setRowInFocus] = useState({ rowIndex: scrollToRow, matchIndex: 0 });
    const [searchedWordIndexes, setSearchedWordIndexes] = useState([]);
    const [currentSearchedItemCount, setCurrentSearchedItemCount] = useState(0);
    const [lineHeight, setLineHeight] = useState(0);
    const [charNumsPerLine, setCharNumsPerLine] = useState(0);
    const [indexWidth, setIndexWidth] = useState(0);
    const [resizing, setResizing] = useState(false);
    const [loading, setLoading] = useState(true);
    const [listKey, setListKey] = useState(1);
    /* Parse data every time it changes */
    const parsedData = React.useMemo(() => parseConsoleOutput(data), [data]);
    const isChrome = React.useMemo(() => navigator.userAgent.indexOf('Chrome') !== -1, []);
    const ansiUp = new AnsiUp();
    // eslint-disable-next-line camelcase
    ansiUp.escape_html = false;
    // eslint-disable-next-line camelcase
    ansiUp.use_classes = useAnsiClasses;
    const ref = React.useRef();
    const logViewerRef = innerRef || ref;
    const containerRef = React.useRef();
    let resizeTimer = null;
    useEffect(() => {
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
    useEffect(() => {
        setLoading(resizing);
    }, [resizing]);
    const dataToRender = React.useMemo(() => ({
        parsedData,
        logViewerRef,
        rowInFocus,
        searchedWordIndexes
    }), [parsedData, logViewerRef, rowInFocus, searchedWordIndexes]);
    useEffect(() => {
        if (logViewerRef && logViewerRef.current) {
            logViewerRef.current.resetAfterIndex(0);
        }
    }, [parsedData]);
    useEffect(() => {
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
        dummyIndex.className = css(styles.logViewerIndex);
        const dummyText = document.createElement('span');
        dummyText.className = css(styles.logViewerText);
        const dummyListItem = document.createElement('div');
        dummyListItem.className = css(styles.logViewerListItem);
        const dummyList = document.createElement('div');
        dummyList.className = css(styles.logViewerList);
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
    useEffect(() => {
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
        dummyText.className = css(styles.logViewerText);
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
        const rowText = stripAnsi(parsedData[rowIndex]);
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
    const createList = (parsedData) => (React.createElement(List, { key: listKey, outerClassName: css(styles.logViewerScrollContainer), innerClassName: css(styles.logViewerList), height: containerRef.current.clientHeight, width: containerRef.current.clientWidth, itemSize: guessRowHeight, itemCount: typeof itemCount === 'undefined' ? parsedData.length : itemCount, itemData: dataToRender, ref: logViewerRef, overscanCount: overScanCount, onScroll: onScroll, isTextWrapped: isTextWrapped, hasLineNumbers: hasLineNumbers, indexWidth: indexWidth, ansiUp: ansiUp }, LogViewerRow));
    return (React.createElement(LogViewerContext.Provider, { value: {
            parsedData,
            searchedInput
        } },
        React.createElement("div", Object.assign({ className: css(styles.logViewer, hasLineNumbers && styles.modifiers.lineNumbers, !isTextWrapped && styles.modifiers.nowrap, initialIndexWidth && styles.modifiers.lineNumberChars, theme === 'dark' && styles.modifiers.dark) }, (initialIndexWidth && {
            style: {
                '--pf-v6-c-log-viewer--line-number-chars': initialIndexWidth + 1
            }
        }), props),
            toolbar && (React.createElement(LogViewerToolbarContext.Provider, { value: {
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
                } },
                React.createElement("div", { className: css(styles.logViewerHeader) }, toolbar))),
            header,
            React.createElement("div", { className: css(styles.logViewerMain), style: { height, width }, ref: containerRef }, loading ? React.createElement("div", null, loadingContent) : createList(parsedData)),
            footer)));
}, areEqual);
export const LogViewer = React.forwardRef((props, ref) => (React.createElement(LogViewerBase, Object.assign({ innerRef: ref }, props))));
LogViewer.displayName = 'LogViewer';
//# sourceMappingURL=LogViewer.js.map