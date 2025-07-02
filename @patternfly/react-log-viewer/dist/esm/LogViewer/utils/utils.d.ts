export interface searchedKeyWordType {
    rowIndex: number;
    matchIndex: number;
}
export declare const isArrayOfString: (array: string[]) => boolean;
export declare const searchForKeyword: (searchedInput: string, parsedData: string[], itemCount: number) => searchedKeyWordType[];
export declare const parseConsoleOutput: (data: string[] | string) => string[];
export declare const escapeString: (inputString: string) => string;
export declare const ansiRegex: RegExp;
export declare const isAnsi: (inputString: string) => RegExpMatchArray;
export declare const stripAnsi: (inputString: string) => string;
export declare const splitAnsi: (inputString: string) => string[];
export declare const escapeTextForHtml: (inputString: string) => string;
//# sourceMappingURL=utils.d.ts.map