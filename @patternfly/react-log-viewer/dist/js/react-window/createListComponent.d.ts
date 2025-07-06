/// <reference types="react" />
import { TimeoutID } from './timer';
export declare type ScrollToAlign = 'auto' | 'smart' | 'center' | 'start' | 'end';
export interface RowProps {
    data: any;
    index: number;
    isScrolling?: boolean;
    style: React.CSSProperties;
    ansiUp: any;
}
export interface ListProps {
    estimatedItemSize?: number;
    children: React.FunctionComponent<RowProps>;
    [key: string]: any;
}
export interface ItemMetadata {
    offset: number;
    size: number;
}
export interface InstanceProps {
    itemMetadataMap: {
        [index: number]: ItemMetadata;
    };
    estimatedItemSize: number;
    lastMeasuredIndex: number;
}
declare type ScrollDirection = 'forward' | 'backward';
declare type ScrollEvent = React.SyntheticEvent<HTMLDivElement>;
export interface State {
    instance: any;
    isScrolling: boolean;
    scrollDirection: ScrollDirection;
    scrollOffset: number;
    scrollOffsetToBottom: number;
    scrollUpdateWasRequested: boolean;
}
declare type GetItemOffset = (props: ListProps, index: number, instanceProps?: any) => number;
declare type GetItemSize = (props: ListProps, index?: number, instanceProps?: any) => number;
declare type GetEstimatedTotalSize = (props: ListProps, instanceProps?: any) => number;
declare type GetOffsetForIndexAndAlignment = (props: ListProps, index: number, align: ScrollToAlign, scrollOffset: number, instanceProps?: any) => number;
declare type GetStartIndexForOffset = (props: ListProps, offset: number, instanceProps?: any) => number;
declare type GetStopIndexForStartIndex = (props: ListProps, startIndex: number, scrollOffset: number, instanceProps?: InstanceProps) => number;
declare type InitInstanceProps = (props?: ListProps, instance?: any) => any;
declare type ValidateProps = (props: ListProps) => void;
export default function createListComponent({ getItemOffset, getEstimatedTotalSize, getItemSize, getOffsetForIndexAndAlignment, getStartIndexForOffset, getStopIndexForStartIndex, initInstanceProps, shouldResetStyleCacheOnItemSizeChange, validateProps }: {
    getItemOffset: GetItemOffset;
    getEstimatedTotalSize: GetEstimatedTotalSize;
    getItemSize: GetItemSize;
    getOffsetForIndexAndAlignment: GetOffsetForIndexAndAlignment;
    getStartIndexForOffset: GetStartIndexForOffset;
    getStopIndexForStartIndex: GetStopIndexForStartIndex;
    initInstanceProps: InitInstanceProps;
    shouldResetStyleCacheOnItemSizeChange: boolean;
    validateProps: ValidateProps;
}): {
    new (props: ListProps): {
        _instanceProps: any;
        _outerRef?: HTMLDivElement;
        _resetIsScrollingTimeoutId: TimeoutID | null;
        state: State;
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
            onScroll: (event: ScrollEvent) => void;
            ref: (ref: any) => void;
            tabIndex: number;
            style: any;
        }, any>;
        _callOnItemsRendered: (overscanStartIndex: number, overscanStopIndex: number, visibleStartIndex: number, visibleStopIndex: number) => void;
        _callOnScroll: (scrollDirection: ScrollDirection, scrollOffset: number, scrollOffsetToBottom: number, scrollUpdateWasRequested: boolean) => any;
        _callPropsCallbacks(): void;
        _getItemStyle: (index: number) => Object;
        _getItemStyleCache: (itemSize?: any) => {
            [key: number]: Object;
        };
        _getRangeToRender(): [number, number, number, number];
        _onScrollVertical: (event: ScrollEvent) => void;
        _outerRefSetter: (ref: any) => void;
        _resetIsScrollingDebounced: () => void;
        _resetIsScrolling: () => void;
        context: unknown;
        setState<K extends keyof State>(state: State | ((prevState: Readonly<State>, props: Readonly<ListProps>) => State | Pick<State, K>) | Pick<State, K>, callback?: () => void): void;
        forceUpdate(callback?: () => void): void;
        readonly props: Readonly<ListProps>;
        refs: {
            [key: string]: import("react").ReactInstance;
        };
        shouldComponentUpdate?(nextProps: Readonly<ListProps>, nextState: Readonly<State>, nextContext: any): boolean;
        componentDidCatch?(error: Error, errorInfo: import("react").ErrorInfo): void;
        getSnapshotBeforeUpdate?(prevProps: Readonly<ListProps>, prevState: Readonly<State>): any;
        componentWillMount?(): void;
        UNSAFE_componentWillMount?(): void;
        componentWillReceiveProps?(nextProps: Readonly<ListProps>, nextContext: any): void;
        UNSAFE_componentWillReceiveProps?(nextProps: Readonly<ListProps>, nextContext: any): void;
        componentWillUpdate?(nextProps: Readonly<ListProps>, nextState: Readonly<State>, nextContext: any): void;
        UNSAFE_componentWillUpdate?(nextProps: Readonly<ListProps>, nextState: Readonly<State>, nextContext: any): void;
    };
    defaultProps: {
        itemData: any;
        overscanCount: number;
        useIsScrolling: boolean;
    };
    getDerivedStateFromProps(nextProps: ListProps, prevState: State): State | null;
    contextType?: import("react").Context<any>;
};
export {};
//# sourceMappingURL=createListComponent.d.ts.map