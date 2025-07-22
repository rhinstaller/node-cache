export interface TimeoutID {
    id: number;
}
export declare function cancelTimeout(timeoutID: TimeoutID): void;
export declare function requestTimeout(callback: Function, delay: number): TimeoutID;
//# sourceMappingURL=timer.d.ts.map