export declare class aStar {
    private openList;
    private closeList;
    private endx;
    private endy;
    onNodeAct: (x: any, y: any, g: any, h: any, colorNum: any) => void;
    onNodeActBat: (act: {
        x: number;
        y: number;
        g: number;
        h: number;
        colorNum: number;
    }[]) => void;
    findPath(start_x: number, start_y: number, end_x: number, end_y: number, outPath: number[]): boolean;
    private calcH(now_x, now_y, end_x, end_y);
    private cupPoints;
    private findAddNeighbor(n);
    outFilter: (x, y) => boolean;
    private filterNeighbor(x, y);
    private listHas(ns, x, y);
}
