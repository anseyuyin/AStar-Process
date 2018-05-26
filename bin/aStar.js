System.register([], function (exports_1, context_1) {
    "use strict";
    var __moduleName = context_1 && context_1.id;
    var node, nodePool, aStar;
    return {
        setters: [],
        execute: function () {
            node = (function () {
                function node(x, y, G, H, p) {
                    if (p === void 0) { p = null; }
                    this.x = x;
                    this.y = y;
                    this.Gcost = G;
                    this.Hcost = H;
                    this.parent = p;
                }
                Object.defineProperty(node.prototype, "F", {
                    get: function () { return this.Gcost + this.Hcost; },
                    enumerable: true,
                    configurable: true
                });
                ;
                return node;
            }());
            nodePool = (function () {
                function nodePool() {
                }
                nodePool.new_node = function (x, y, G, H, p) {
                    if (p === void 0) { p = null; }
                    var n = this.nodelist.pop();
                    if (n) {
                        n.x = x;
                        n.y = y;
                        n.Gcost = G;
                        n.Hcost = H;
                        n.parent = p;
                    }
                    else {
                        n = new node(x, y, G, H, p);
                    }
                    return n;
                };
                nodePool.delete_node = function (n) {
                    if (!n)
                        return;
                    n.parent = null;
                    n.x = n.y = n.Gcost = n.Hcost = 0;
                    this.nodelist.push(n);
                };
                nodePool.nodelist = [];
                return nodePool;
            }());
            aStar = (function () {
                function aStar() {
                    this.openList = [];
                    this.closeList = [];
                    this.onNodeAct = function (x, y, g, h, colorNum) { };
                    this.onNodeActBat = function (act) { };
                    this.cupPoints = [{ x: 0, y: 0 }, { x: 0, y: 0 }, { x: 0, y: 0 }, { x: 0, y: 0 }];
                }
                aStar.prototype.findPath = function (start_x, start_y, end_x, end_y, outPath) {
                    var result = false;
                    this.endx = end_x;
                    this.endy = end_y;
                    var orgH = this.calcH(start_x, start_y, end_x, end_y);
                    this.closeList.push(nodePool.new_node(start_x, start_y, 0, orgH));
                    this.onNodeAct(start_x, start_y, 0, orgH, 0);
                    var endNode;
                    var cout = 0;
                    var lastLen = 0;
                    while (lastLen < this.closeList.length) {
                        lastLen = this.closeList.length;
                        var snode = this.closeList[this.closeList.length - 1];
                        this.findAddNeighbor(snode);
                        var minFnode = void 0;
                        var minIdx = 0;
                        for (var i = this.openList.length - 1; i >= 0; i--) {
                            var n = this.openList[i];
                            if (!n)
                                continue;
                            if (n.x == end_x && n.y == end_y) {
                                endNode = n;
                                break;
                            }
                            if (!minFnode || n.F < minFnode.F) {
                                minFnode = n;
                                minIdx = i;
                            }
                            if (i == 0) {
                                this.openList.splice(minIdx, 1);
                            }
                        }
                        if (endNode)
                            break;
                        if (!minFnode)
                            continue;
                        this.onNodeAct(minFnode.x, minFnode.y, minFnode.Gcost, minFnode.Hcost, 2);
                        this.closeList.push(minFnode);
                        this.onNodeAct(minFnode.x, minFnode.y, minFnode.Gcost, minFnode.Hcost, 0);
                    }
                    if (endNode) {
                        while (endNode) {
                            outPath.push(endNode.y);
                            outPath.push(endNode.x);
                            endNode = endNode.parent;
                        }
                        outPath.reverse();
                        result = true;
                    }
                    this.openList.forEach(function (n) {
                        if (n)
                            nodePool.delete_node(n);
                    });
                    this.closeList.forEach(function (n) {
                        if (n)
                            nodePool.delete_node(n);
                    });
                    this.openList.length = 0;
                    this.closeList.length = 0;
                    return result;
                };
                aStar.prototype.calcH = function (now_x, now_y, end_x, end_y) {
                    return Math.abs(end_x - now_x) + Math.abs(end_y - now_y);
                };
                aStar.prototype.findAddNeighbor = function (n) {
                    this.cupPoints[0].x = n.x - 1;
                    this.cupPoints[0].y = n.y;
                    this.cupPoints[1].x = n.x;
                    this.cupPoints[1].y = n.y - 1;
                    this.cupPoints[2].x = n.x + 1;
                    this.cupPoints[2].y = n.y;
                    this.cupPoints[3].x = n.x;
                    this.cupPoints[3].y = n.y + 1;
                    var bat = [];
                    for (var i = 0; i < this.cupPoints.length; i++) {
                        var point = this.cupPoints[i];
                        if (this.filterNeighbor(point.x, point.y)) {
                            var H = this.calcH(point.x, point.y, this.endx, this.endy);
                            this.openList.push(nodePool.new_node(point.x, point.y, n.Gcost + 1, H, n));
                            bat.push({ x: point.x, y: point.y, g: n.Gcost + 1, h: H, colorNum: 1 });
                        }
                    }
                    this.onNodeActBat(bat);
                };
                aStar.prototype.filterNeighbor = function (x, y) {
                    var result = true;
                    if (this.listHas(this.openList, x, y) || this.listHas(this.closeList, x, y))
                        return false;
                    if (this.outFilter && !this.outFilter(x, y))
                        return false;
                    return result;
                };
                aStar.prototype.listHas = function (ns, x, y) {
                    for (var i = 0; i < ns.length; i++) {
                        var n = ns[i];
                        if (n.x == x && n.y == y)
                            return true;
                    }
                    return false;
                };
                return aStar;
            }());
            exports_1("aStar", aStar);
        }
    };
});
//# sourceMappingURL=aStar.js.map