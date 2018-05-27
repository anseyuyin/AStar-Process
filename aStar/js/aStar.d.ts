declare namespace findPath {
    class aStar {
        private openList;
        private closeList;
        private endx;
        private endy;
        findPath(start_x: number, start_y: number, end_x: number, end_y: number, outPath: number[]): boolean;
        private calcH(now_x, now_y, end_x, end_y);
        private cupPoints;
        private findAddNeighbor(n);
        outFilter: (x: number, y: number) => boolean;
        private filterNeighbor(x, y);
        private listHas(ns, x, y);
    }
}
