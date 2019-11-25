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
    private calcH;
    private cupPoints;
    private findAddNeighbor;
    outFilter: (x: any, y: any) => boolean;
    private filterNeighbor;
    private listHas;
}
