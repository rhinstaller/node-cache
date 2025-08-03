"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LogViewerSearch = void 0;
const tslib_1 = require("tslib");
const jsx_runtime_1 = require("react/jsx-runtime");
const react_1 = require("react");
const constants_1 = require("./utils/constants");
const react_core_1 = require("@patternfly/react-core");
const LogViewerContext_1 = require("./LogViewerContext");
const utils_1 = require("./utils/utils");
const LogViewerSearch = (_a) => {
    var _b;
    var { placeholder = 'Search', minSearchChars = 1 } = _a, props = tslib_1.__rest(_a, ["placeholder", "minSearchChars"]);
    const [indexAdjuster, setIndexAdjuster] = (0, react_1.useState)(0);
    const { searchedWordIndexes, scrollToRow, setSearchedInput, setCurrentSearchedItemCount, setRowInFocus, setSearchedWordIndexes, currentSearchedItemCount, searchedInput, itemCount } = (0, react_1.useContext)(LogViewerContext_1.LogViewerToolbarContext);
    const { parsedData } = (0, react_1.useContext)(LogViewerContext_1.LogViewerContext);
    const defaultRowInFocus = { rowIndex: constants_1.DEFAULT_FOCUS, matchIndex: constants_1.DEFAULT_MATCH };
    /* Defaulting the first focused row that contain searched keywords */
    (0, react_1.useEffect)(() => {
        if (hasFoundResults) {
            setIndexAdjuster(1);
        }
        else {
            setIndexAdjuster(0);
        }
    }, [searchedWordIndexes]);
    /* Updating searchedResults context state given changes in searched input */
    (0, react_1.useEffect)(() => {
        let foundKeywordIndexes = [];
        const adjustedSearchedInput = (0, utils_1.escapeString)(searchedInput);
        if (adjustedSearchedInput !== '' && adjustedSearchedInput.length >= minSearchChars) {
            foundKeywordIndexes = (0, utils_1.searchForKeyword)(adjustedSearchedInput, parsedData, itemCount || parsedData.length);
            if (foundKeywordIndexes.length !== 0) {
                setSearchedWordIndexes(foundKeywordIndexes);
                scrollToRow(foundKeywordIndexes[constants_1.DEFAULT_SEARCH_INDEX]);
                setCurrentSearchedItemCount(constants_1.DEFAULT_INDEX);
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
        setCurrentSearchedItemCount(constants_1.DEFAULT_INDEX);
        setSearchedWordIndexes([]);
        setRowInFocus(defaultRowInFocus);
    };
    /* Moving focus over to next row containing searched word */
    const handleNextSearchItem = () => {
        const adjustedSearchedItemCount = (currentSearchedItemCount + constants_1.NUMBER_INDEX_DELTA) % searchedWordIndexes.length;
        setCurrentSearchedItemCount(adjustedSearchedItemCount);
        scrollToRow(searchedWordIndexes[adjustedSearchedItemCount]);
    };
    /* Moving focus over to next row containing searched word */
    const handlePrevSearchItem = () => {
        let adjustedSearchedItemCount = currentSearchedItemCount - constants_1.NUMBER_INDEX_DELTA;
        if (adjustedSearchedItemCount < constants_1.DEFAULT_INDEX) {
            adjustedSearchedItemCount += searchedWordIndexes.length;
        }
        setCurrentSearchedItemCount(adjustedSearchedItemCount);
        scrollToRow(searchedWordIndexes[adjustedSearchedItemCount]);
    };
    return ((0, jsx_runtime_1.jsx)(react_core_1.SearchInput, Object.assign({ placeholder: placeholder, value: searchedInput, resultsCount: `${currentSearchedItemCount + indexAdjuster} / ${hasFoundResults ? searchedWordIndexes.length : 0}` }, props, { onChange: (event, input) => {
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
exports.LogViewerSearch = LogViewerSearch;
exports.LogViewerSearch.displayName = 'LogViewerSearch';
//# sourceMappingURL=LogViewerSearch.js.map