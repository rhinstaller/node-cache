"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LogViewerRow = void 0;
const tslib_1 = require("tslib");
const react_1 = tslib_1.__importStar(require("react"));
const constants_1 = require("./utils/constants");
const react_styles_1 = require("@patternfly/react-styles");
const log_viewer_1 = tslib_1.__importDefault(require("./css/log-viewer"));
const LogViewerContext_1 = require("./LogViewerContext");
const utils_1 = require("./utils/utils");
exports.LogViewerRow = (0, react_1.memo)(({ index, style, data, ansiUp }) => {
    const { parsedData, searchedWordIndexes, rowInFocus } = data;
    const context = (0, react_1.useContext)(LogViewerContext_1.LogViewerContext);
    const getData = (index) => (parsedData ? parsedData[index] : null);
    const getRowIndex = (index) => index + constants_1.LOGGER_LINE_NUMBER_INDEX_DELTA;
    /** Helper function for applying the correct styling for styling rows containing searched keywords */
    const handleHighlight = (matchCounter) => {
        const searchedWordResult = searchedWordIndexes.filter(searchedWord => searchedWord.rowIndex === index);
        if (searchedWordResult.length !== 0) {
            if (rowInFocus.rowIndex === index && rowInFocus.matchIndex === matchCounter) {
                return log_viewer_1.default.modifiers.current;
            }
            return log_viewer_1.default.modifiers.match;
        }
        return '';
    };
    const getFormattedData = () => {
        const rowText = getData(index);
        let matchCounter = 0;
        if (context.searchedInput) {
            const splitAnsiString = (0, utils_1.splitAnsi)(rowText);
            const regEx = new RegExp(`(${(0, utils_1.escapeString)(context.searchedInput)})`, 'ig');
            const composedString = [];
            splitAnsiString.forEach(str => {
                matchCounter = 0;
                if ((0, utils_1.isAnsi)(str)) {
                    composedString.push(str);
                }
                else {
                    const splitString = str.split(regEx);
                    splitString.forEach((substr) => {
                        if (substr.match(regEx)) {
                            matchCounter += 1;
                            composedString.push(`<span class="${(0, react_styles_1.css)(log_viewer_1.default.logViewerString, handleHighlight(matchCounter))}">${substr}</span>`);
                        }
                        else {
                            composedString.push((0, utils_1.escapeTextForHtml)(substr));
                        }
                    });
                }
            });
            return composedString.join('');
        }
        return (0, utils_1.escapeTextForHtml)(rowText);
    };
    return (react_1.default.createElement("div", { style: style, className: (0, react_styles_1.css)(log_viewer_1.default.logViewerListItem) },
        react_1.default.createElement("span", { className: (0, react_styles_1.css)(log_viewer_1.default.logViewerIndex) }, getRowIndex(index)),
        react_1.default.createElement("span", { className: (0, react_styles_1.css)(log_viewer_1.default.logViewerText), style: { width: 'fit-content' }, dangerouslySetInnerHTML: { __html: ansiUp.ansi_to_html(getFormattedData()) } })));
});
exports.LogViewerRow.displayName = 'LogViewerRow';
//# sourceMappingURL=LogViewerRow.js.map