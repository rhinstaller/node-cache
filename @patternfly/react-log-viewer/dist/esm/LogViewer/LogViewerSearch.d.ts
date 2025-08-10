/// <reference types="react" />
import { SearchInputProps } from '@patternfly/react-core';
export interface LogViewerSearchProps extends SearchInputProps {
    /** Place holder text inside of searchbar */
    placeholder: string;
    /** Minimum number of characters required for searching */
    minSearchChars: number;
}
export declare const LogViewerSearch: React.FunctionComponent<LogViewerSearchProps>;
//# sourceMappingURL=LogViewerSearch.d.ts.map