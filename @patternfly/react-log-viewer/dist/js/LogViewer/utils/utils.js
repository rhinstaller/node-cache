"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.escapeTextForHtml = exports.splitAnsi = exports.stripAnsi = exports.isAnsi = exports.ansiRegex = exports.escapeString = exports.parseConsoleOutput = exports.searchForKeyword = exports.isArrayOfString = void 0;
const isArrayOfString = (array) => {
    for (const str in array) {
        if (typeof str !== 'string') {
            return false;
        }
    }
    return true;
};
exports.isArrayOfString = isArrayOfString;
/*
  Function responsible for searching throughout logger component, need to setup for proper use anywhere.
  It should take an array, and return an array of indexes where the searchedInput is found throughout the data array.
  Should always be searching an array of strings. Look into lazy log for ideas.
*/
const searchForKeyword = (searchedInput, parsedData, itemCount) => {
    const searchResults = [];
    const regex = new RegExp(searchedInput, 'ig');
    parsedData.map((row, index) => {
        const rawRow = (0, exports.stripAnsi)(row);
        if (regex.test(rawRow) && index < itemCount) {
            const numMatches = rawRow.match(regex).length;
            for (let i = 1; i <= numMatches; i++) {
                searchResults.push({ rowIndex: index, matchIndex: i });
            }
        }
    });
    if (searchResults.length > 0) {
        return [...searchResults];
    }
    else if (searchResults.length <= 0) {
        return [{ rowIndex: -1, matchIndex: 0 }];
    }
};
exports.searchForKeyword = searchForKeyword;
const parseConsoleOutput = (data) => {
    const stringToSplitWith = '\n';
    const parsedData = Array.isArray(data) ? data.join(stringToSplitWith) : data;
    const stringSplitting = parsedData.toString();
    const cleanString = stringSplitting.split(stringToSplitWith);
    return cleanString;
};
exports.parseConsoleOutput = parseConsoleOutput;
const escapeString = (inputString) => inputString.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&'); // eslint-disable-line
exports.escapeString = escapeString;
/* eslint-disable-next-line no-control-regex */
const ansiRegexString = `[\u001b\u009b][[()#;?]*(?:[0-9]{1,4}(?:;[0-9]{0,4})*)?[0-9A-PRZcf-nqry=><]`;
exports.ansiRegex = new RegExp(ansiRegexString, 'g');
const isAnsi = (inputString) => inputString.match(exports.ansiRegex);
exports.isAnsi = isAnsi;
const stripAnsi = (inputString) => inputString.replace(exports.ansiRegex, '');
exports.stripAnsi = stripAnsi;
const splitAnsi = (inputString) => inputString.split(new RegExp(`(${ansiRegexString})`, 'g'));
exports.splitAnsi = splitAnsi;
const escapeTextForHtml = (inputString) => inputString.replace(/[&<>"']/gm, str => {
    if (str === '&') {
        return '&amp;';
    }
    if (str === '<') {
        return '&lt;';
    }
    if (str === '>') {
        return '&gt;';
    }
    if (str === '"') {
        return '&quot;';
    }
    if (str === "'") {
        return '&#x27;';
    }
});
exports.escapeTextForHtml = escapeTextForHtml;
//# sourceMappingURL=utils.js.map