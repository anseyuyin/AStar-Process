declare namespace findPath {
    class aStar {
        private openList;
        private closeList;
        private endx;
        private endy;
        findPath(start_x: number, start_y: number, end_x: number, end_y: number, outPath: number[]): boolean;
        private calcH;
        private cupPoints;
        private findAddNeighbor;
        outFilter: (x: number, y: number) => boolean;
        private filterNeighbor;
        private listHas;
    }
}
