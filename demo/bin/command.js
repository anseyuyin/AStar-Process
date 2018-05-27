System.register([], function (exports_1, context_1) {
    "use strict";
    var __moduleName = context_1 && context_1.id;
    function setState(ehtml, color, g, h) {
        if (g === void 0) { g = -1; }
        if (h === void 0) { h = -1; }
        var sta = new stateData(color, g, h);
        commandMgr.Instance.execute(new rectSetCommand(ehtml, sta));
    }
    exports_1("setState", setState);
    function batState(States) {
        var batc = new batchCommand();
        States.forEach(function (sub) {
            var sta = new stateData(sub.color, sub.g, sub.h);
            batc.addComd(new rectSetCommand(sub.ehtml, sta));
        });
        commandMgr.Instance.execute(batc);
    }
    exports_1("batState", batState);
    var stateData, rectSetCommand, batchCommand, commandMgr;
    return {
        setters: [],
        execute: function () {
            stateData = (function () {
                function stateData(color, g, h) {
                    if (g === void 0) { g = 0; }
                    if (h === void 0) { h = 0; }
                    this.color = color;
                    this.g = g;
                    this.h = h;
                }
                return stateData;
            }());
            exports_1("stateData", stateData);
            rectSetCommand = (function () {
                function rectSetCommand(htmle, sta) {
                    this.htmle = htmle;
                    this.sta = sta;
                    var g_ = this.htmle.getElementsByClassName("class_g")[0];
                    var h_ = this.htmle.getElementsByClassName("class_h")[0];
                    this.lastSta = new stateData(htmle.style.background, Number(g_.textContent), Number(h_.textContent));
                }
                rectSetCommand.prototype.execute = function () {
                    this.htmle.style.background = this.sta.color;
                    var f_text = this.htmle.getElementsByClassName("class_f")[0];
                    var g_text = this.htmle.getElementsByClassName("class_g")[0];
                    var h_text = this.htmle.getElementsByClassName("class_h")[0];
                    f_text.textContent = "" + (this.sta.g + this.sta.h);
                    g_text.textContent = "" + this.sta.g;
                    h_text.textContent = "" + this.sta.h;
                    f_text.style.display = this.sta.g + this.sta.h < 0 ? "none" : "";
                    g_text.style.display = this.sta.g < 0 ? "none" : "";
                    h_text.style.display = this.sta.h < 0 ? "none" : "";
                };
                rectSetCommand.prototype.undo = function () {
                    this.htmle.style.background = this.lastSta.color;
                    var f_text = this.htmle.getElementsByClassName("class_f")[0];
                    var g_text = this.htmle.getElementsByClassName("class_g")[0];
                    var h_text = this.htmle.getElementsByClassName("class_h")[0];
                    f_text.textContent = "" + (this.lastSta.g + this.lastSta.h);
                    g_text.textContent = "" + this.lastSta.g;
                    h_text.textContent = "" + this.lastSta.h;
                    f_text.style.display = this.lastSta.g + this.lastSta.h < 0 ? "none" : "";
                    g_text.style.display = this.lastSta.g < 0 ? "none" : "";
                    h_text.style.display = this.lastSta.h < 0 ? "none" : "";
                };
                return rectSetCommand;
            }());
            exports_1("rectSetCommand", rectSetCommand);
            batchCommand = (function () {
                function batchCommand() {
                    this.comds = [];
                }
                batchCommand.prototype.addComd = function (comd) {
                    this.comds.push(comd);
                };
                batchCommand.prototype.execute = function () {
                    this.comds.forEach(function (element) {
                        if (element)
                            element.execute();
                    });
                };
                batchCommand.prototype.undo = function () {
                    this.comds.forEach(function (element) {
                        if (element)
                            element.undo();
                    });
                };
                return batchCommand;
            }());
            exports_1("batchCommand", batchCommand);
            commandMgr = (function () {
                function commandMgr() {
                    this.currIdx = -1;
                    this.coms = [];
                }
                Object.defineProperty(commandMgr, "Instance", {
                    get: function () {
                        if (!this._instance) {
                            this._instance = new commandMgr();
                            document["commandMgr"] = this._instance;
                        }
                        return this._instance;
                    },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(commandMgr.prototype, "index", {
                    get: function () { return this.currIdx; },
                    enumerable: true,
                    configurable: true
                });
                ;
                Object.defineProperty(commandMgr.prototype, "length", {
                    get: function () { return this.coms.length; },
                    enumerable: true,
                    configurable: true
                });
                ;
                commandMgr.prototype.execute = function (com) {
                    if (!com)
                        return;
                    this.coms.push(com);
                    com.execute();
                    this.currIdx = this.coms.length - 1;
                };
                commandMgr.prototype.undo = function () {
                    if (this.currIdx < 0)
                        return;
                    var com = this.coms[this.currIdx];
                    if (!com)
                        return;
                    com.undo();
                    this.currIdx--;
                };
                commandMgr.prototype.recovery = function () {
                    if (this.currIdx >= this.coms.length - 1)
                        return;
                    this.currIdx++;
                    var com = this.coms[this.currIdx];
                    if (!com)
                        return;
                    com.execute();
                };
                commandMgr.prototype.clear = function () {
                    this.coms.length = 0;
                    this.currIdx = -1;
                };
                return commandMgr;
            }());
            exports_1("commandMgr", commandMgr);
        }
    };
});
//# sourceMappingURL=command.js.map