/// <reference types="react" />
import AnsiUp from '../ansi_up/ansi_up';
import { searchedKeyWordType } from './utils/utils';
interface LogViewerRowProps {
    index: number;
    style?: React.CSSProperties;
    data: {
        parsedData: string[] | null;
        rowInFocus: searchedKeyWordType;
        searchedWordIndexes: searchedKeyWordType[];
    };
    ansiUp: AnsiUp;
}
export declare const LogViewerRow: React.FunctionComponent<LogViewerRowProps>;
export {};
//# sourceMappingURL=LogViewerRow.d.ts.map