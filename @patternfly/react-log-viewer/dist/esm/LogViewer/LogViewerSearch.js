import { __rest } from "tslib";
import { jsx as _jsx } from "react/jsx-runtime";
import { useContext, useEffect, useState } from 'react';
import { NUMBER_INDEX_DELTA, DEFAULT_FOCUS, DEFAULT_INDEX, DEFAULT_SEARCH_INDEX, DEFAULT_MATCH } from './utils/constants';
import { SearchInput } from '@patternfly/react-core';
import { LogViewerToolbarContext, LogViewerContext } from './LogViewerContext';
import { escapeString, searchForKeyword } from './utils/utils';
export const LogViewerSearch = (_a) => {
    var _b;
    var { placeholder = 'Search', minSearchChars = 1 } = _a, props = __rest(_a, ["placeholder", "minSearchChars"]);
    const [indexAdjuster, setIndexAdjuster] = useState(0);
    const { searchedWordIndexes, scrollToRow, setSearchedInput, setCurrentSearchedItemCount, setRowInFocus, setSearchedWordIndexes, currentSearchedItemCount, searchedInput, itemCount } = useContext(LogViewerToolbarContext);
    const { parsedData } = useContext(LogViewerContext);
    const defaultRowInFocus = { rowIndex: DEFAULT_FOCUS, matchIndex: DEFAULT_MATCH };
    /* Defaulting the first focused row that contain searched keywords */
    useEffect(() => {
        if (hasFoundResults) {
            setIndexAdjuster(1);
        }
        else {
            setIndexAdjuster(0);
        }
    }, [searchedWordIndexes]);
    /* Updating searchedResults context state given changes in searched input */
    useEffect(() => {
        let foundKeywordIndexes = [];
        const adjustedSearchedInput = escapeString(searchedInput);
        if (adjustedSearchedInput !== '' && adjustedSearchedInput.length >= minSearchChars) {
            foundKeywordIndexes = searchForKeyword(adjustedSearchedInput, parsedData, itemCount || parsedData.length);
            if (foundKeywordIndexes.length !== 0) {
                setSearchedWordIndexes(foundKeywordIndexes);
                scrollToRow(foundKeywordIndexes[DEFAULT_SEARCH_INDEX]);
                setCurrentSearchedItemCount(DEFAULT_INDEX);
            }
        }
        if (!adjustedSearchedInput) {
            setRowInFocus(defaultRowInFocus);
        }
    }, [searchedInput]);
    const hasFoundResults = searchedWordIndexes.length > 0 && ((_b = searchedWordIndexes[0]) === null || _b === void 0 ? void 0 : _b.rowIndex) !== -1;
    /* Clearing out the search input */
    const handleClear = () => {
        setSearchedInput('');
        setCurrentSearchedItemCount(DEFAULT_INDEX);
        setSearchedWordIndexes([]);
        setRowInFocus(defaultRowInFocus);
    };
    /* Moving focus over to next row containing searched word */
    const handleNextSearchItem = () => {
        const adjustedSearchedItemCount = (currentSearchedItemCount + NUMBER_INDEX_DELTA) % searchedWordIndexes.length;
        setCurrentSearchedItemCount(adjustedSearchedItemCount);
        scrollToRow(searchedWordIndexes[adjustedSearchedItemCount]);
    };
    /* Moving focus over to next row containing searched word */
    const handlePrevSearchItem = () => {
        let adjustedSearchedItemCount = currentSearchedItemCount - NUMBER_INDEX_DELTA;
        if (adjustedSearchedItemCount < DEFAULT_INDEX) {
            adjustedSearchedItemCount += searchedWordIndexes.length;
        }
        setCurrentSearchedItemCount(adjustedSearchedItemCount);
        scrollToRow(searchedWordIndexes[adjustedSearchedItemCount]);
    };
    return (_jsx(SearchInput, Object.assign({ placeholder: placeholder, value: searchedInput, resultsCount: `${currentSearchedItemCount + indexAdjuster} / ${hasFoundResults ? searchedWordIndexes.length : 0}` }, props, { onChange: (event, input) => {
            props.onChange && props.onChange(event, input);
            setSearchedInput(input);
        }, onNextClick: (event) => {
            props.onNextClick && props.onNextClick(event);
            handleNextSearchItem();
        }, onPreviousClick: (event) => {
            props.onPreviousClick && props.onPreviousClick(event);
            handlePrevSearchItem();
        }, onClear: (event) => {
            props.onClear && props.onClear(event);
            handleClear();
        } })));
};
LogViewerSearch.displayName = 'LogViewerSearch';
//# sourceMappingURL=LogViewerSearch.js.map