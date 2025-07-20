"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const memoize_one_1 = tslib_1.__importDefault(require("memoize-one"));
const react_1 = require("react");
const timer_1 = require("./timer");
const IS_SCROLLING_DEBOUNCE_INTERVAL = 150;
const defaultItemKey = (index, _data) => index;
// In DEV mode, this Set helps us only log a warning once per component instance.
// This avoids spamming the console every time a render happens.
let devWarningsTagName = null;
if (process.env.NODE_ENV !== 'production') {
    if (typeof window !== 'undefined' && typeof window.WeakSet !== 'undefined') {
        devWarningsTagName = new WeakSet();
    }
}
function createListComponent({ getItemOffset, getEstimatedTotalSize, getItemSize, getOffsetForIndexAndAlignment, getStartIndexForOffset, getStopIndexForStartIndex, initInstanceProps, shouldResetStyleCacheOnItemSizeChange, validateProps }) {
    var _a;
    return _a = class List extends react_1.PureComponent {
            // Always use explicit constructor for React components.
            // It produces less code after transpilation. (#26)
            // eslint-disable-next-line no-useless-constructor
            constructor(props) {
                super(props);
                this._instanceProps = initInstanceProps(this.props, this);
                this._resetIsScrollingTimeoutId = null;
                this.state = {
                    instance: this,
                    isScrolling: false,
                    scrollDirection: 'forward',
                    scrollOffset: typeof this.props.initialScrollOffset === 'number' ? this.props.initialScrollOffset : 0,
                    scrollOffsetToBottom: -1,
                    scrollUpdateWasRequested: false
                };
                this._callOnItemsRendered = (0, memoize_one_1.default)((overscanStartIndex, overscanStopIndex, visibleStartIndex, visibleStopIndex) => this.props.onItemsRendered({
                    overscanStartIndex,
                    overscanStopIndex,
                    visibleStartIndex,
                    visibleStopIndex
                }));
                this._callOnScroll = (0, memoize_one_1.default)((scrollDirection, scrollOffset, scrollOffsetToBottom, scrollUpdateWasRequested) => this.props.onScroll({
                    scrollDirection,
                    scrollOffset,
                    scrollOffsetToBottom,
                    scrollUpdateWasRequested
                }));
                // Lazily create and cache item styles while scrolling,
                // So that pure component sCU will prevent re-renders.
                // We maintain this cache, and pass a style prop rather than index,
                // So that List can clear cached styles and force item re-render if necessary.
                this._getItemStyle = (index) => {
                    const { itemSize } = this.props;
                    const itemStyleCache = this._getItemStyleCache(shouldResetStyleCacheOnItemSizeChange && itemSize);
                    let style;
                    // eslint-disable-next-line no-prototype-builtins
                    if (itemStyleCache.hasOwnProperty(index)) {
                        style = itemStyleCache[index];
                    }
                    else {
                        const offset = getItemOffset(this.props, index, this._instanceProps);
                        const size = getItemSize(this.props, index, this._instanceProps);
                        itemStyleCache[index] = style = {
                            position: 'absolute',
                            top: offset,
                            height: size
                        };
                    }
                    return style;
                };
                this._getItemStyleCache = (0, memoize_one_1.default)(() => ({}));
                this._onScrollVertical = (event) => {
                    const { clientHeight, scrollHeight, scrollTop } = event.currentTarget;
                    this.setState(prevState => {
                        if (prevState.scrollOffset === scrollTop) {
                            // Scroll position may have been updated by cDM/cDU,
                            // In which case we don't need to trigger another render,
                            // And we don't want to update state.isScrolling.
                            return null;
                        }
                        // Prevent Safari's elastic scrolling from causing visual shaking when scrolling past bounds.
                        const scrollOffset = Math.max(0, Math.min(scrollTop, scrollHeight - clientHeight));
                        const scrollOffsetToBottom = scrollHeight - scrollTop - clientHeight;
                        return {
                            isScrolling: true,
                            scrollDirection: prevState.scrollOffset < scrollOffset ? 'forward' : 'backward',
                            scrollOffset,
                            scrollOffsetToBottom,
                            scrollUpdateWasRequested: false
                        };
                    }, this._resetIsScrollingDebounced);
                };
                this._outerRefSetter = (ref) => {
                    const { outerRef } = this.props;
                    this._outerRef = ref;
                    if (typeof outerRef === 'function') {
                        outerRef(ref);
                        // eslint-disable-next-line no-prototype-builtins
                    }
                    else if (outerRef != null && typeof outerRef === 'object' && outerRef.hasOwnProperty('current')) {
                        outerRef.current = ref;
                    }
                };
                this._resetIsScrollingDebounced = () => {
                    if (this._resetIsScrollingTimeoutId !== null) {
                        (0, timer_1.cancelTimeout)(this._resetIsScrollingTimeoutId);
                    }
                    this._resetIsScrollingTimeoutId = (0, timer_1.requestTimeout)(this._resetIsScrolling, IS_SCROLLING_DEBOUNCE_INTERVAL);
                };
                this._resetIsScrolling = () => {
                    this._resetIsScrollingTimeoutId = null;
                    this.setState({ isScrolling: false }, () => {
                        // Clear style cache after state update has been committed.
                        // This way we don't break pure sCU for items that don't use isScrolling param.
                        this._getItemStyleCache(-1);
                    });
                };
            }
            static getDerivedStateFromProps(nextProps, prevState) {
                validateSharedProps(nextProps, prevState);
                validateProps(nextProps);
                return null;
            }
            scrollTo(scrollOffset) {
                scrollOffset = Math.max(0, scrollOffset);
                this.setState(prevState => {
                    if (prevState.scrollOffset === scrollOffset) {
                        return null;
                    }
                    return {
                        scrollDirection: prevState.scrollOffset < scrollOffset ? 'forward' : 'backward',
                        scrollOffset,
                        scrollUpdateWasRequested: true
                    };
                }, this._resetIsScrollingDebounced);
            }
            scrollToItem(index, align = 'auto') {
                const { itemCount } = this.props;
                const { scrollOffset } = this.state;
                index = Math.max(0, Math.min(index, itemCount - 1));
                this.scrollTo(getOffsetForIndexAndAlignment(this.props, index, align, scrollOffset, this._instanceProps));
            }
            scrollToBottom() {
                const outerRef = this._outerRef;
                const { scrollHeight, clientHeight } = outerRef;
                this.scrollTo(scrollHeight - clientHeight);
            }
            onTextSelectionStart() {
                if (this._outerRef) {
                    this._outerRef.style.overflowY = 'hidden';
                }
            }
            onTextSelectionStop() {
                if (this._outerRef) {
                    this._outerRef.style.overflowY = 'auto';
                }
            }
            componentDidMount() {
                const { initialScrollOffset } = this.props;
                if (typeof initialScrollOffset === 'number' && this._outerRef != null) {
                    const outerRef = this._outerRef;
                    outerRef.scrollTop = initialScrollOffset;
                }
                const innerRef = this._outerRef.firstChild; // innerRef will be 'pf-v5-c-log-viewer__list'
                ['mousedown', 'touchstart'].forEach(event => {
                    innerRef.addEventListener(event, this.onTextSelectionStart.bind(this));
                });
                // set mouseup event listener on the whole document
                // because the cursor could be out side of the log window when the mouse is up
                // in that case the window would not be able to scroll up and down because overflow-Y is not set back to 'auto'
                ['mouseup', 'touchend'].forEach(event => {
                    document.addEventListener(event, this.onTextSelectionStop.bind(this));
                });
                this._callPropsCallbacks();
            }
            componentDidUpdate() {
                const { scrollOffset, scrollUpdateWasRequested } = this.state;
                if (scrollUpdateWasRequested && this._outerRef != null) {
                    const outerRef = this._outerRef;
                    outerRef.scrollTop = scrollOffset;
                }
                this._callPropsCallbacks();
            }
            componentWillUnmount() {
                if (this._resetIsScrollingTimeoutId !== null) {
                    (0, timer_1.cancelTimeout)(this._resetIsScrollingTimeoutId);
                }
                const innerRef = this._outerRef.firstChild; // innerRef will be 'pf-v5-c-log-viewer__list'
                ['mousedown', 'touchstart'].forEach(event => {
                    innerRef.removeEventListener(event, this.onTextSelectionStart.bind(this));
                });
                ['mouseup', 'touchend'].forEach(event => {
                    document.removeEventListener(event, this.onTextSelectionStop.bind(this));
                });
            }
            render() {
                const { children, outerClassName, innerClassName, height, innerRef, innerElementType, innerTagName, itemCount, itemData, itemKey = defaultItemKey, outerElementType, outerTagName, style, useIsScrolling, width, isTextWrapped, hasLineNumbers, indexWidth, ansiUp } = this.props;
                const { isScrolling } = this.state;
                const onScroll = this._onScrollVertical;
                const [startIndex, stopIndex] = this._getRangeToRender();
                const items = [];
                if (itemCount > 0) {
                    for (let index = startIndex; index <= stopIndex; index++) {
                        items.push((0, react_1.createElement)(children, {
                            data: itemData,
                            key: itemKey(index, itemData),
                            index,
                            isScrolling: useIsScrolling ? isScrolling : undefined,
                            style: this._getItemStyle(index),
                            ansiUp
                        }));
                    }
                }
                // Read this value AFTER items have been created,
                // So their actual sizes (if variable) are taken into consideration.
                const estimatedTotalSize = getEstimatedTotalSize(this.props, this._instanceProps);
                return (0, react_1.createElement)(outerElementType || outerTagName || 'div', {
                    className: outerClassName,
                    onScroll,
                    ref: this._outerRefSetter,
                    tabIndex: 0,
                    style: Object.assign({ height, paddingTop: 0, paddingBottom: 0, WebkitOverflowScrolling: 'touch', overflowX: isTextWrapped ? 'hidden' : 'auto' }, style)
                }, (0, react_1.createElement)(innerElementType || innerTagName || 'div', {
                    className: innerClassName,
                    ref: innerRef,
                    style: {
                        height: estimatedTotalSize > height ? estimatedTotalSize : height,
                        /* eslint-disable-next-line no-nested-ternary */
                        width: isTextWrapped ? (hasLineNumbers ? width - indexWidth : width) : 'auto',
                        pointerEvents: isScrolling ? 'none' : undefined
                    }
                }, items));
            }
            _callPropsCallbacks() {
                if (typeof this.props.onItemsRendered === 'function') {
                    const { itemCount } = this.props;
                    if (itemCount > 0) {
                        const [overscanStartIndex, overscanStopIndex, visibleStartIndex, visibleStopIndex] = this._getRangeToRender();
                        this._callOnItemsRendered(overscanStartIndex, overscanStopIndex, visibleStartIndex, visibleStopIndex);
                    }
                }
                if (typeof this.props.onScroll === 'function') {
                    const { scrollDirection, scrollOffset, scrollOffsetToBottom, scrollUpdateWasRequested } = this.state;
                    this._callOnScroll(scrollDirection, scrollOffset, scrollOffsetToBottom, scrollUpdateWasRequested);
                }
            }
            _getRangeToRender() {
                const { itemCount, overscanCount } = this.props;
                const { isScrolling, scrollDirection, scrollOffset } = this.state;
                if (itemCount === 0) {
                    return [0, 0, 0, 0];
                }
                const startIndex = getStartIndexForOffset(this.props, scrollOffset, this._instanceProps);
                const stopIndex = getStopIndexForStartIndex(this.props, startIndex, scrollOffset, this._instanceProps);
                // Overscan by one item in each direction so that tab/focus works.
                // If there isn't at least one extra item, tab loops back around.
                const overscanBackward = !isScrolling || scrollDirection === 'backward' ? Math.max(1, overscanCount) : 1;
                const overscanForward = !isScrolling || scrollDirection === 'forward' ? Math.max(1, overscanCount) : 1;
                return [
                    Math.max(0, startIndex - overscanBackward),
                    Math.max(0, Math.min(itemCount - 1, stopIndex + overscanForward)),
                    startIndex,
                    stopIndex
                ];
            }
        },
        _a.defaultProps = {
            itemData: undefined,
            overscanCount: 2,
            useIsScrolling: false
        },
        _a;
}
exports.default = createListComponent;
// NOTE: I considered further wrapping individual items with a pure ListItem component.
// This would avoid ever calling the render function for the same index more than once,
// But it would also add the overhead of a lot of components/fibers.
// I assume people already do this (render function returning a class component),
// So my doing it would just unnecessarily double the wrappers.
const validateSharedProps = ({ children, innerTagName, outerTagName }, { instance }) => {
    if (process.env.NODE_ENV !== 'production') {
        if (innerTagName != null || outerTagName != null) {
            if (devWarningsTagName && !devWarningsTagName.has(instance)) {
                devWarningsTagName.add(instance);
                // eslint-disable-next-line no-console
                console.warn('The innerTagName and outerTagName props have been deprecated. ' +
                    'Please use the innerElementType and outerElementType props instead.');
            }
        }
        if (children == null) {
            throw Error('An invalid "children" prop has been specified. ' +
                'Value should be a React component. ' +
                `"${children === null ? 'null' : typeof children}" was specified.`);
        }
    }
};
//# sourceMappingURL=createListComponent.js.map