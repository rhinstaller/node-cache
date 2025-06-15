import React, { memo, useContext } from 'react';
import { LOGGER_LINE_NUMBER_INDEX_DELTA } from './utils/constants';
import { css } from '@patternfly/react-styles';
import styles from './css/log-viewer';
import { LogViewerContext } from './LogViewerContext';
import { escapeString, escapeTextForHtml, isAnsi, splitAnsi } from './utils/utils';
export const LogViewerRow = memo(({ index, style, data, ansiUp }) => {
    const { parsedData, searchedWordIndexes, rowInFocus } = data;
    const context = useContext(LogViewerContext);
    const getData = (index) => (parsedData ? parsedData[index] : null);
    const getRowIndex = (index) => index + LOGGER_LINE_NUMBER_INDEX_DELTA;
    /** Helper function for applying the correct styling for styling rows containing searched keywords */
    const handleHighlight = (matchCounter) => {
        const searchedWordResult = searchedWordIndexes.filter(searchedWord => searchedWord.rowIndex === index);
        if (searchedWordResult.length !== 0) {
            if (rowInFocus.rowIndex === index && rowInFocus.matchIndex === matchCounter) {
                return styles.modifiers.current;
            }
            return styles.modifiers.match;
        }
        return '';
    };
    const getFormattedData = () => {
        const rowText = getData(index);
        let matchCounter = 0;
        if (context.searchedInput) {
            const splitAnsiString = splitAnsi(rowText);
            const regEx = new RegExp(`(${escapeString(context.searchedInput)})`, 'ig');
            const composedString = [];
            splitAnsiString.forEach(str => {
                matchCounter = 0;
                if (isAnsi(str)) {
                    composedString.push(str);
                }
                else {
                    const splitString = str.split(regEx);
                    splitString.forEach((substr) => {
                        if (substr.match(regEx)) {
                            matchCounter += 1;
                            composedString.push(`<span class="${css(styles.logViewerString, handleHighlight(matchCounter))}">${substr}</span>`);
                        }
                        else {
                            composedString.push(escapeTextForHtml(substr));
                        }
                    });
                }
            });
            return composedString.join('');
        }
        return escapeTextForHtml(rowText);
    };
    return (React.createElement("div", { style: style, className: css(styles.logViewerListItem) },
        React.createElement("span", { className: css(styles.logViewerIndex) }, getRowIndex(index)),
        React.createElement("span", { className: css(styles.logViewerText), style: { width: 'fit-content' }, dangerouslySetInnerHTML: { __html: ansiUp.ansi_to_html(getFormattedData()) } })));
});
LogViewerRow.displayName = 'LogViewerRow';
//# sourceMappingURL=LogViewerRow.js.map