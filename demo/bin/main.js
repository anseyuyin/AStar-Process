System.register(["./aStar.js", "./command.js"], function (exports_1, context_1) {
    "use strict";
    var aStar_js_1, command_js_1, map_temp, main;
    var __moduleName = context_1 && context_1.id;
    return {
        setters: [
            function (aStar_js_1_1) {
                aStar_js_1 = aStar_js_1_1;
            },
            function (command_js_1_1) {
                command_js_1 = command_js_1_1;
            }
        ],
        execute: function () {
            map_temp = [[1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
                [1, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 1],
                [1, 0, 1, 0, 0, 0, 1, 0, 0, 1, 1, 1, 0, 0, 1],
                [1, 0, 1, 0, 0, 0, 0, 0, 1, 0, 0, 0, 1, 0, 1],
                [1, 0, 1, 0, 0, 0, 0, 0, 1, 0, 1, 0, 1, 0, 1],
                [1, 0, 1, 0, 0, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1],
                [1, 0, 1, 0, 0, 0, 1, 0, 1, 0, 1, 1, 1, 0, 1],
                [1, 0, 0, 1, 1, 1, 1, 0, 1, 0, 0, 0, 0, 0, 1],
                [1, 0, 0, 0, 0, 0, 1, 0, 1, 1, 1, 1, 1, 1, 1],
                [1, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 1],
                [1, 0, 1, 0, 1, 0, 1, 0, 0, 0, 0, 0, 0, 1, 1],
                [1, 0, 0, 1, 0, 0, 1, 0, 0, 0, 0, 0, 1, 0, 1],
                [1, 0, 0, 1, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 1],
                [1, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 1],
                [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1]];
            main = (function () {
                function main() {
                    this.rootContain = document.getElementById("rootcont");
                    this.slideBar = document.getElementById("play_sb");
                    this.btn_left = document.getElementById("btn_left");
                    this.btn_center = document.getElementById("btn_center");
                    this.btn_right = document.getElementById("btn_right");
                    this.timeRate = 1000;
                    this.slideRangeMax = 10000;
                    this.cdate = new Date();
                    this.AS = new aStar_js_1.aStar();
                    this.points = [];
                    this.paths = [];
                    this.DivMap = {};
                    this.color_start = "#11ee11";
                    this.color_end = "#ee1111";
                    this.color_open = "#7777aa";
                    this.color_close = "#aa7777";
                    this.color_minSelect = "#77aa77";
                    this.color_click = "#eeee11";
                    this.color_0 = "#dddddd";
                    this.color_1 = "#555555";
                    this.mapSize = map_temp.length;
                    this.size = 40;
                    this.gap = 2;
                    this.lastTime = -1;
                    this.playSpeed = 1;
                    this.progressNum = 0;
                    this._isStop = false;
                    this.lastPerc = -1;
                    this.init();
                }
                main.prototype.playFun_Smooth = function () {
                    if (this.isStop)
                        return;
                    var cInst = command_js_1.commandMgr.Instance;
                    var delta = (Date.now() / this.timeRate) - this.lastTime;
                    this.progressNum += delta * this.slideRangeMax / (cInst.length * this.playSpeed * 0.3);
                    this.progressNum = this.progressNum > this.slideRangeMax ? this.slideRangeMax : this.progressNum;
                    if (this.progressNum < this.slideRangeMax) {
                        requestAnimationFrame(this.playFun_Smooth.bind(this));
                    }
                    this.commandsMoveByPercent(this.progressNum / this.slideRangeMax);
                    this.slideBar.value = this.progressNum.toString();
                    this.lastTime = Date.now() / this.timeRate;
                };
                Object.defineProperty(main.prototype, "isStop", {
                    get: function () { return this._isStop; },
                    set: function (v) {
                        this._isStop = v;
                        if (this.btn_center)
                            this.btn_center.value = v ? "▷" : "||";
                    },
                    enumerable: true,
                    configurable: true
                });
                ;
                main.prototype.autoPlay = function () {
                    this.isStop = false;
                    this.lastTime = Date.now() / this.timeRate;
                    this.playFun_Smooth();
                };
                main.prototype.adjustSlideByComLen = function () {
                    this.progressNum = (command_js_1.commandMgr.Instance.index + 1) / command_js_1.commandMgr.Instance.length * this.slideRangeMax;
                    this.slideBar.value = this.progressNum.toString();
                };
                main.prototype.commandsMoveByPercent = function (perc) {
                    if (this.lastPerc == perc)
                        return;
                    perc = perc < 0 ? 0 : perc > 1 ? 1 : perc;
                    var num = command_js_1.commandMgr.Instance.index + 1;
                    var len = command_js_1.commandMgr.Instance.length;
                    if (perc == num / len)
                        return;
                    var temp = perc - num / len;
                    var f = Math.floor(Math.abs(temp * len));
                    for (var i = 0; i < f; i++) {
                        if (temp > 0) {
                            command_js_1.commandMgr.Instance.recovery();
                        }
                        else {
                            command_js_1.commandMgr.Instance.undo();
                        }
                    }
                    if (perc == 1)
                        command_js_1.commandMgr.Instance.recovery();
                    this.lastPerc = perc;
                };
                main.prototype.colorByNum = function (num) {
                    switch (num) {
                        case 0: return this.color_close;
                        case 1: return this.color_open;
                        case 2: return this.color_minSelect;
                    }
                };
                ;
                main.prototype.init = function () {
                    var _this = this;
                    this.slideBar.onmousedown = this.slideBar.ontouchstart = function () {
                        _this.isStop = true;
                    };
                    this.slideBar.onchange = function () {
                        _this.progressNum = Number(_this.slideBar.value);
                        var perp = Number(_this.slideBar.value) / _this.slideRangeMax;
                        _this.commandsMoveByPercent(perp);
                    };
                    this.slideBar.oninput = function () {
                        _this.progressNum = Number(_this.slideBar.value);
                        var perp = Number(_this.slideBar.value) / _this.slideRangeMax;
                        _this.commandsMoveByPercent(perp);
                    };
                    this.btn_center.onclick = function () {
                        if (_this.isStop) {
                            _this.autoPlay();
                        }
                        else {
                            _this.isStop = true;
                        }
                    };
                    this.btn_left.onclick = function () {
                        _this.isStop = true;
                        command_js_1.commandMgr.Instance.undo();
                        _this.adjustSlideByComLen();
                    };
                    this.btn_right.onclick = function () {
                        _this.isStop = true;
                        command_js_1.commandMgr.Instance.recovery();
                        _this.adjustSlideByComLen();
                    };
                    this.AS.onNodeAct = function (x, y, g, h, num) {
                        var tdiv = _this.DivMap[x + "_" + y];
                        command_js_1.setState(tdiv, _this.colorByNum(num), g, h);
                    };
                    this.AS.onNodeActBat = function (acts) {
                        var temp = [];
                        acts.forEach(function (sub) {
                            if (sub) {
                                var tdiv = _this.DivMap[sub.x + "_" + sub.y];
                                temp.push({ ehtml: tdiv, color: _this.colorByNum(sub.colorNum), g: sub.g, h: sub.h });
                            }
                        });
                        command_js_1.batState(temp);
                    };
                    this.AS.outFilter = function (x, y) {
                        return map_temp[y][x] != null && map_temp[y][x] == 0;
                    };
                    this.rootContain.style.width = this.rootContain.style.height = this.mapSize * (this.size + this.gap) - this.gap + "px";
                    for (var y = 0; y < this.mapSize; y++) {
                        var li = document.createElement("li");
                        li.style.display = "flex";
                        li.style.position = "relative";
                        li.style.height = this.size + "px";
                        li.style.width = this.rootContain.style.width;
                        li.style.top = y * this.gap + "px";
                        this.rootContain.appendChild(li);
                        for (var x = 0; x < this.mapSize; x++) {
                            this.genCell(li, x, y);
                        }
                    }
                };
                main.prototype.setText = function (own, testColor, className, type) {
                    var subfont = document.createElement("font");
                    subfont.style.position = "absolute";
                    subfont.style.color = testColor;
                    subfont.size = "0.3";
                    subfont.textContent = "-1";
                    subfont.style.display = "none";
                    subfont.className = className;
                    switch (type) {
                        case 0:
                            subfont.style.right = "50%";
                            subfont.style.top = "0px";
                            subfont.size = "0.5";
                            break;
                        case 1:
                            subfont.style.left = "0px";
                            subfont.style.bottom = "0px";
                            break;
                        case 2:
                            subfont.style.right = "0px";
                            subfont.style.bottom = "0px";
                            break;
                    }
                    own.appendChild(subfont);
                };
                main.prototype.genCell = function (li, x, y) {
                    var _this = this;
                    var subDiv = document.createElement("div");
                    subDiv.style.position = "relative";
                    subDiv.style.width = this.size + "px";
                    subDiv.style.height = this.size + "px";
                    subDiv.style.left = x * this.gap + "px";
                    subDiv.style.background = map_temp[y][x] == 0 ? this.color_0 : this.color_1;
                    li.appendChild(subDiv);
                    this.setText(subDiv, "#ffff00", "class_f", 0);
                    this.setText(subDiv, "#00ff00", "class_g", 1);
                    this.setText(subDiv, "#ff0000", "class_h", 2);
                    this.DivMap[x + "_" + y] = subDiv;
                    subDiv["pos"] = { x: x, y: y };
                    subDiv.onclick = function () {
                        if (map_temp[subDiv["pos"].y][subDiv["pos"].x] == 1)
                            return;
                        if (_this.points.length <= 0) {
                            if (command_js_1.commandMgr.Instance.length > 0) {
                                _this.commandsMoveByPercent(0);
                                command_js_1.commandMgr.Instance.clear();
                                _this.isStop = true;
                                _this.progressNum = 0;
                                _this.slideBar.value = "0";
                            }
                            command_js_1.setState(subDiv, _this.color_start);
                        }
                        else
                            command_js_1.setState(subDiv, _this.color_end);
                        _this.points.push(subDiv["pos"]);
                        if (_this.points.length >= 2) {
                            _this.paths.length = 0;
                            var result = _this.AS.findPath(_this.points[0].x, _this.points[0].y, _this.points[1].x, _this.points[1].y, _this.paths);
                            if (!result) {
                                console.warn("find path fail!");
                            }
                            for (var i = 0; i < _this.paths.length; i += 2) {
                                var x_1 = _this.paths[i];
                                var y_1 = _this.paths[i + 1];
                                command_js_1.setState(_this.DivMap[x_1 + "_" + y_1], _this.color_click);
                            }
                            _this.paths.length = 0;
                            _this.points.length = 0;
                            _this.commandsMoveByPercent(0);
                            _this.autoPlay();
                        }
                    };
                };
                return main;
            }());
            exports_1("main", main);
        }
    };
});
//# sourceMappingURL=main.js.map