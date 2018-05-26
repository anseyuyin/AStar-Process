export declare function setState(ehtml: HTMLElement, color: string, g?: number, h?: number): void;
export declare function batState(States: {
    ehtml: HTMLElement;
    color: string;
    g: number;
    h: number;
}[]): void;
export interface Icommand {
    execute(): any;
    undo(): any;
}
export declare class stateData {
    color: string;
    g: number;
    h: number;
    constructor(color: string, g?: number, h?: number);
}
export declare class rectSetCommand implements Icommand {
    htmle: HTMLElement;
    sta: stateData;
    private lastSta;
    constructor(htmle: HTMLElement, sta: stateData);
    execute(): void;
    undo(): void;
}
export declare class batchCommand implements Icommand {
    private comds;
    addComd(comd: Icommand): void;
    execute(): void;
    undo(): void;
}
export declare class commandMgr {
    private static _instance;
    static readonly Instance: commandMgr;
    readonly index: number;
    readonly length: number;
    private currIdx;
    private coms;
    execute(com: Icommand): void;
    undo(): void;
    recovery(): void;
    clear(): void;
}
