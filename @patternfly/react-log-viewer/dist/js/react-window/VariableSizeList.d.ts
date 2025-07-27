/// <reference types="react" />
import { ScrollToAlign, ListProps } from './createListComponent';
export declare const VariableSizeList: {
    new (props: ListProps): {
        _instanceProps: any;
        _outerRef?: HTMLDivElement;
        _resetIsScrollingTimeoutId: import("./timer").TimeoutID;
        state: import("./createListComponent").State;
        scrollTo(scrollOffset: number): void;
        scrollToItem(index: number, align?: ScrollToAlign): void;
        scrollToBottom(): void;
        onTextSelectionStart(): void;
        onTextSelectionStop(): void;
        componentDidMount(): void;
        componentDidUpdate(): void;
        componentWillUnmount(): void;
        render(): import("react").CElement<{
            className: any;
            onScroll: (event: import("react").SyntheticEvent<HTMLDivElement, Event>) => void;
            ref: (ref: any) => void;
            tabIndex: number;
            style: any;
        }, any>;
        _callOnItemsRendered: (overscanStartIndex: number, overscanStopIndex: number, visibleStartIndex: number, visibleStopIndex: number) => void;
        _callOnScroll: (scrollDirection: "forward" | "backward", scrollOffset: number, scrollOffsetToBottom: number, scrollUpdateWasRequested: boolean) => any;
        _callPropsCallbacks(): void;
        _getItemStyle: (index: number) => Object;
        _getItemStyleCache: (itemSize?: any) => {
            [key: number]: Object;
        };
        _getRangeToRender(): [number, number, number, number];
        _onScrollVertical: (event: import("react").SyntheticEvent<HTMLDivElement, Event>) => void;
        _outerRefSetter: (ref: any) => void;
        _resetIsScrollingDebounced: () => void;
        _resetIsScrolling: () => void;
        context: unknown;
        setState<K extends keyof import("./createListComponent").State>(state: import("./createListComponent").State | ((prevState: Readonly<import("./createListComponent").State>, props: Readonly<ListProps>) => import("./createListComponent").State | Pick<import("./createListComponent").State, K>) | Pick<import("./createListComponent").State, K>, callback?: () => void): void;
        forceUpdate(callback?: () => void): void;
        readonly props: Readonly<ListProps>;
        refs: {
            [key: string]: import("react").ReactInstance;
        };
        shouldComponentUpdate?(nextProps: Readonly<ListProps>, nextState: Readonly<import("./createListComponent").State>, nextContext: any): boolean;
        componentDidCatch?(error: Error, errorInfo: import("react").ErrorInfo): void;
        getSnapshotBeforeUpdate?(prevProps: Readonly<ListProps>, prevState: Readonly<import("./createListComponent").State>): any;
        componentWillMount?(): void;
        UNSAFE_componentWillMount?(): void;
        componentWillReceiveProps?(nextProps: Readonly<ListProps>, nextContext: any): void;
        UNSAFE_componentWillReceiveProps?(nextProps: Readonly<ListProps>, nextContext: any): void;
        componentWillUpdate?(nextProps: Readonly<ListProps>, nextState: Readonly<import("./createListComponent").State>, nextContext: any): void;
        UNSAFE_componentWillUpdate?(nextProps: Readonly<ListProps>, nextState: Readonly<import("./createListComponent").State>, nextContext: any): void;
    };
    defaultProps: {
        itemData: any;
        overscanCount: number;
        useIsScrolling: boolean;
    };
    getDerivedStateFromProps(nextProps: ListProps, prevState: import("./createListComponent").State): import("./createListComponent").State;
    contextType?: import("react").Context<any>;
};
//# sourceMappingURL=VariableSizeList.d.ts.map