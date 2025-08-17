/// <reference types="react" />
import { searchedKeyWordType } from './utils/utils';
export declare const useLogViewerContext: () => LogViewerContextInterface;
interface LogViewerContextInterface {
    parsedData: string[];
    searchedInput: string;
}
export declare const LogViewerContext: import("react").Context<LogViewerContextInterface>;
interface LogViewerToolbarContextProps {
    searchedWordIndexes: searchedKeyWordType[];
    rowInFocus: searchedKeyWordType;
    searchedInput: string;
    itemCount: number;
    currentSearchedItemCount: number;
    scrollToRow: (searchedRow: searchedKeyWordType) => void;
    setRowInFocus: (index: searchedKeyWordType) => void;
    setSearchedInput: (input: string) => void;
    setSearchedWordIndexes: (indexes: searchedKeyWordType[]) => void;
    setCurrentSearchedItemCount: (index: number) => void;
}
export declare const LogViewerToolbarContext: import("react").Context<LogViewerToolbarContextProps>;
export {};
//# sourceMappingURL=LogViewerContext.d.ts.map