/// <reference types="react" />
export interface LogViewerProps {
    /** String or String Array data being sent by the consumer*/
    data?: string | string[];
    /** Consumer may turn off the visibility on the toolbar */
    hasToolbar?: boolean;
    /** Flag to enable or disable line numbers on the log viewer. */
    hasLineNumbers?: boolean;
    /** Width of the log viewer. */
    width?: number | string;
    /** Height of the log viewer. */
    height?: number | string;
    /** Rows rendered outside of view. The more rows are rendered, the higher impact on performance */
    overScanCount?: number;
    /** Toolbar rendered in the log viewer header */
    toolbar?: React.ReactNode;
    /** Content displayed while the log viewer is loading */
    loadingContent?: React.ReactNode;
    /** Flag indicating that log viewer is dark themed */
    theme?: 'dark' | 'light';
    /** Row index to scroll to */
    scrollToRow?: number;
    /** The width of index when the line numbers is shown, set by char numbers */
    initialIndexWidth?: number;
    /** Number of rows to display in the log viewer */
    itemCount?: number;
    /** Flag indicating that log viewer is wrapping text or not */
    isTextWrapped?: boolean;
    /** Component rendered in the log viewer console window header */
    header?: React.ReactNode;
    /** Component rendered in the log viewer console window footer */
    footer?: React.ReactNode;
    /** Callback function when scrolling the window.
     * scrollDirection is the direction of scroll, could be 'forward'|'backward'.
     * scrollOffset and scrollOffsetToBottom are the offset of the current position to the top or the bottom.
     * scrollUpdateWasRequested is false when the scroll event is cause by the user interaction in the browser, else it's true.
     * @example onScroll={({scrollDirection, scrollOffset, scrollOffsetToBottom, scrollUpdateWasRequested})=>{}}
     */
    onScroll?: ({ scrollDirection, scrollOffset, scrollOffsetToBottom, scrollUpdateWasRequested }: {
        scrollDirection: 'forward' | 'backward';
        scrollOffset: number;
        scrollOffsetToBottom: number;
        scrollUpdateWasRequested: boolean;
    }) => void;
    /** Forwarded ref */
    innerRef?: React.RefObject<any>;
    /** Flag to enable or disable the use of classes (instead of inline styles) for ANSI coloring/formatting. */
    useAnsiClasses?: boolean;
    /** The maximum char length for fast row height estimation.
     * For wrapped lines in Chrome based browsers, lines over this length will actually be rendered to the dom and
     * measured to prevent a bug where one line can overlap another.
     */
    fastRowHeightEstimationLimit?: number;
}
export declare const LogViewer: import("react").ForwardRefExoticComponent<LogViewerProps & import("react").RefAttributes<any>>;
//# sourceMappingURL=LogViewer.d.ts.map