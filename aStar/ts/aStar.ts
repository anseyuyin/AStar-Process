namespace findPath{
    class node {
        parent: node;
        x: number;
        y: number;
        Gcost: number;
        Hcost: number;
        get F() { return this.Gcost + this.Hcost; };
        constructor(x: number, y: number, G: number, H: number, p: node = null) {
            this.x = x; this.y = y; this.Gcost = G; this.Hcost = H; this.parent = p;
        }
    }
    
    class nodePool {
        private static nodelist: node[] = [];
        static new_node(x: number, y: number, G: number, H: number, p: node = null) {
            let n = this.nodelist.pop();
            if (n) {
                n.x = x; n.y = y; n.Gcost = G; n.Hcost = H; n.parent = p;
            } else {
                n = new node(x, y, G, H, p);
            }
            return n;
        }
        static delete_node(n: node) {
            if (!n) return;
            n.parent = null;
            n.x = n.y = n.Gcost = n.Hcost = 0;
            this.nodelist.push(n);
        }
    }
    
    /**
     * A* pathFind Pathfinding Algorithm 
     */
    export class aStar {
        private openList: node[] = [];
        private closeList: node[] = [];
        private endx: number;
        private endy: number;
    
        /**
         * 寻找获取 start点 到 end点 的最短路径 ，计算返回是否成功 ， outPath ： 路径坐标数组[x,y,x1,y1...]
         * Find the shortest path between "start" "end" two points 
         * 
         * @argument start_x coordinate x of Start Point 
         * @argument start_y coordinate y of Start Point 
         * @argument end_x coordinate y of End Point 
         * @argument end_y coordinate y of End Point 
         * @argument outPath Calculation result of Path , format is [x,y,x1,y1,x2,y2.........]
         */
        findPath(start_x: number, start_y: number, end_x: number, end_y: number, outPath: number[]): boolean {
            let result = false;
            this.endx = end_x; this.endy = end_y;
            //将起点加入close表
            let orgH = this.calcH(start_x, start_y, end_x, end_y);
            this.closeList.push(nodePool.new_node(start_x, start_y, 0, orgH));
            let endNode: node;
            let cout = 0;
            let lastLen = 0;
            //jump out "while" when the closelist not have any new add
            while (lastLen < this.closeList.length) {
                lastLen = this.closeList.length;
                //获取close表的最后一个节点S
                let snode = this.closeList[this.closeList.length - 1];
                //获取S点周围所有符合加入条件的点，加入open列表
                this.findAddNeighbor(snode);
                //计算open列表F值最低的格子T
                let minFnode: node;
                let minIdx = 0;
                for (var i = this.openList.length - 1; i >= 0; i--) {
                    let n = this.openList[i];
                    if (!n) continue;
                    if (n.x == end_x && n.y == end_y) {
                        endNode = n;
                        break;
                    }
                    if (!minFnode || n.F < minFnode.F || (minFnode.F == n.F && n.Gcost < minFnode.Gcost)) {
                        minFnode = n;
                        minIdx = i;
                    }
                    if (i == 0) {
                        this.openList.splice(minIdx, 1); //openlist 中删除
                    }
                }
    
                if (endNode) break;  //找到了 目标点
                if (!minFnode) continue;
                //T从open表中删除加入close表
                this.closeList.push(minFnode);
                //console.error(`while ${cout++} _ :x: ${minFnode.x}  y :${minFnode.y} `);
            }
    
            if (endNode) {
                while (endNode) {
                    outPath.push(endNode.y); //y
                    outPath.push(endNode.x); //x
                    endNode = endNode.parent;
                }
                outPath.reverse();
                result = true;
            }
            //清理
            this.openList.forEach(n => {
                if (n) nodePool.delete_node(n);
            });
            this.closeList.forEach(n => {
                if (n) nodePool.delete_node(n);
            });
            this.openList.length = 0;
            this.closeList.length = 0;
    
            return result;
        }
    
        private calcH(now_x: number, now_y: number, end_x: number, end_y: number): number {
            return Math.abs(end_x - now_x) + Math.abs(end_y - now_y);
        }
    
        private cupPoints: { x: number, y: number }[] = [{ x: 0, y: 0 }, { x: 0, y: 0 }, { x: 0, y: 0 }, { x: 0, y: 0 }];
        private findAddNeighbor(n: node) {
            this.cupPoints[0].x = n.x - 1; this.cupPoints[0].y = n.y;    //left
            this.cupPoints[1].x = n.x; this.cupPoints[1].y = n.y - 1; //top
            this.cupPoints[2].x = n.x + 1; this.cupPoints[2].y = n.y;    //right
            this.cupPoints[3].x = n.x; this.cupPoints[3].y = n.y + 1; //botoom
    
            for (var i = 0; i < this.cupPoints.length; i++) {
                let point = this.cupPoints[i];
                if (this.filterNeighbor(point.x, point.y)) {
                    let H = this.calcH(point.x, point.y, this.endx, this.endy);
                    this.openList.unshift(nodePool.new_node(point.x, point.y, n.Gcost + 1, H, n));
                }
            }
        }
    
        /**
         * 外部 合法验证接口
         * Verify the validity of this coordinate externally , if validity need return "true"
         * @argument x x of coordinate
         * @argument y y of coordinate
         */
        outFilter: (x:number, y:number) => boolean;
    
        private filterNeighbor(x: number, y: number): boolean {
            let result = true;
            if (this.listHas(this.openList, x, y) || this.listHas(this.closeList, x, y))
                return false;
    
            if (this.outFilter && !this.outFilter(x, y))
                return false;
    
            return result;
        }
    
        private listHas(ns: node[], x: number, y: number) {
            for (var i = 0; i < ns.length; i++) {
                let n = ns[i];
                if (n.x == x && n.y == y)
                    return true;
            }
            return false;
        }
    }
}
