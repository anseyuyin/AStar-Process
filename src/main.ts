import { aStar } from "./aStar.js";
import { Icommand, commandMgr, setState, batState } from "./command.js";

//temp map data
var map_temp = [[1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
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

export class main {
    constructor() {
        this.init();
    }

    private rootContain = document.getElementById("rootcont");
    private slideBar: HTMLInputElement = document.getElementById("play_sb") as HTMLInputElement;
    private btn_left: HTMLInputElement = document.getElementById("btn_left") as HTMLInputElement;
    private btn_center: HTMLInputElement = document.getElementById("btn_center") as HTMLInputElement;
    private btn_right: HTMLInputElement = document.getElementById("btn_right") as HTMLInputElement;
    private timeRate = 1000;
    private slideRangeMax = 10000;
    private cdate: Date = new Date();
    private AS = new aStar();
    private points: { x: number, y: number }[] = [];
    private paths: number[] = [];
    private DivMap: { [key: string]: HTMLDivElement } = {};

    //生成地图
    private color_start = `#11ee11`;
    private color_end = `#ee1111`;

    private color_open = `#7777aa`;
    private color_close = `#aa7777`;
    private color_minSelect = `#77aa77`;

    private color_click = `#eeee11`;
    private color_0 = "#dddddd";
    private color_1 = "#555555";
    private mapSize = map_temp.length;
    private size = 40;
    private gap = 2;

    private lastTime = -1;
    private playSpeed = 1;  // /s
    private progressNum = 0;
    playFun_Smooth() {
        if (this.isStop) return;
        let cInst = commandMgr.Instance;
        let delta = (Date.now() / this.timeRate) - this.lastTime;
        this.progressNum += delta * this.slideRangeMax / (cInst.length * this.playSpeed * 0.3);
        this.progressNum = this.progressNum > this.slideRangeMax ? this.slideRangeMax : this.progressNum;
        if (this.progressNum < this.slideRangeMax) {
            requestAnimationFrame(this.playFun_Smooth.bind(this));
        }
        this.commandsMoveByPercent(this.progressNum / this.slideRangeMax);
        this.slideBar.value = this.progressNum.toString();
        this.lastTime = Date.now() / this.timeRate;
    }


    private _isStop = false;
    private get isStop() { return this._isStop; };
    private set isStop(v) {
        this._isStop = v;
        if (this.btn_center) this.btn_center.value = v ? "▷" : "||";
    }

    autoPlay() {
        this.isStop = false;
        this.lastTime = Date.now() / this.timeRate;
        this.playFun_Smooth();
    }

    adjustSlideByComLen() {
        this.progressNum = (commandMgr.Instance.index + 1) / commandMgr.Instance.length * this.slideRangeMax;
        this.slideBar.value = this.progressNum.toString();
    }

    private lastPerc = -1;
    //0 - 1 
    commandsMoveByPercent(perc: number) {
        if (this.lastPerc == perc) return;
        perc = perc < 0 ? 0 : perc > 1 ? 1 : perc;  //keep range in 0-1
        let num = commandMgr.Instance.index + 1;
        let len = commandMgr.Instance.length;
        if (perc == num / len) return;
        let temp = perc - num / len;
        //console.error(`-------: temp${temp.toFixed(4)} perc:${perc.toFixed(4)}`);
        let f = Math.floor(Math.abs(temp * len));

        for (var i = 0; i < f; i++) {
            if (temp > 0) {
                commandMgr.Instance.recovery();
            } else {
                commandMgr.Instance.undo();
            }
        }
        if (perc == 1) commandMgr.Instance.recovery();
        this.lastPerc = perc;
    }

    colorByNum(num: number) {
        switch (num) {
            case 0: return this.color_close; //for in closelist
            case 1: return this.color_open;   //for in openlist
            case 2: return this.color_minSelect; //for selected min
            // case 3: return this.color_ff; 
        }
    };

    init() {
        this.slideBar.onmousedown = this.slideBar.ontouchstart = () => {
            this.isStop = true;
        }

        this.slideBar.onchange = () => {
            this.progressNum = Number(this.slideBar.value);
            let perp = Number(this.slideBar.value) / this.slideRangeMax;
            this.commandsMoveByPercent(perp);
        }

        this.slideBar.oninput = () => {
            this.progressNum = Number(this.slideBar.value);
            let perp = Number(this.slideBar.value) / this.slideRangeMax;
            this.commandsMoveByPercent(perp);
        }

        this.btn_center.onclick = () => {
            if (this.isStop) {
                this.autoPlay();
            } else {
                this.isStop = true;
            }
        }

        this.btn_left.onclick = () => {
            this.isStop = true;
            commandMgr.Instance.undo();
            this.adjustSlideByComLen();
        }

        this.btn_right.onclick = () => {
            this.isStop = true;
            commandMgr.Instance.recovery();
            this.adjustSlideByComLen();
        }

        //
        this.AS.onNodeAct = (x, y, g, h, num) => {
            let tdiv = this.DivMap[`${x}_${y}`];
            setState(tdiv, this.colorByNum(num), g, h);
        }

        this.AS.onNodeActBat = (acts) => {
            let temp: { ehtml: HTMLElement, color: string, g: number, h: number }[] = [];
            acts.forEach(sub => {
                if (sub) {
                    let tdiv = this.DivMap[`${sub.x}_${sub.y}`];
                    temp.push({ ehtml: tdiv, color: this.colorByNum(sub.colorNum), g: sub.g, h: sub.h });
                }
            });
            batState(temp);
        }

        //地图筛选
        this.AS.outFilter = (x, y) => {
            return map_temp[y][x] != null && map_temp[y][x] == 0;
        }
        this.rootContain.style.width = this.rootContain.style.height = `${this.mapSize * (this.size + this.gap) - this.gap}px`;
        for (var y = 0; y < this.mapSize; y++) {
            //if(y!=0 )continue;
            let li = document.createElement(`li`);
            li.style.display = `flex`;
            li.style.position = `relative`;
            li.style.height = `${this.size}px`;
            li.style.width = this.rootContain.style.width;
            li.style.top = `${y * this.gap}px`;
            this.rootContain.appendChild(li);
            for (var x = 0; x < this.mapSize; x++) {
                this.genCell(li, x, y);
            }
        }
    }

    // type:[0:top 1:bLeft 2:bRight]
    setText(own: HTMLElement, testColor: string, className: string, type: number) {
        let subfont = document.createElement(`font`);
        subfont.style.position = "absolute";
        subfont.style.color = testColor;
        subfont.size = 0.3;
        subfont.textContent = "-1";
        subfont.style.display = "none";
        subfont.className = className;
        switch (type) {
            case 0: subfont.style.right = `50%`; subfont.style.top = `0px`; subfont.size = 0.5; break;
            case 1: subfont.style.left = `0px`; subfont.style.bottom = `0px`; break;
            case 2: subfont.style.right = `0px`; subfont.style.bottom = `0px`; break;
        }
        own.appendChild(subfont);
    }

    genCell(li: HTMLElement, x, y) {
        let subDiv = document.createElement("div");
        subDiv.style.position = "relative";
        subDiv.style.width = `${this.size}px`;
        subDiv.style.height = `${this.size}px`;
        subDiv.style.left = `${x * this.gap}px`;
        //subDiv.style.top = `${y * this.gap}px`;
        subDiv.style.background = map_temp[y][x] == 0 ? this.color_0 : this.color_1;
        li.appendChild(subDiv);

        this.setText(subDiv, `#ffff00`, `class_f`, 0);
        this.setText(subDiv, `#00ff00`, `class_g`, 1);
        this.setText(subDiv, `#ff0000`, `class_h`, 2);

        this.DivMap[`${x}_${y}`] = subDiv;
        subDiv["pos"] = { x: x, y: y };

        subDiv.onclick = () => {
            if (map_temp[subDiv["pos"].y][subDiv["pos"].x] == 1) return;
            if (this.points.length <= 0) {
                if (commandMgr.Instance.length > 0) {
                    //clear history when next try
                    this.commandsMoveByPercent(0);
                    commandMgr.Instance.clear();
                    this.isStop = true;
                    this.progressNum = 0;
                    this.slideBar.value = "0";
                }
                setState(subDiv, this.color_start);
            }
            else
                setState(subDiv, this.color_end);

            this.points.push(subDiv["pos"]);
            if (this.points.length >= 2) {
                //clear history 
                this.paths.length = 0;

                let result = this.AS.findPath(this.points[0].x, this.points[0].y, this.points[1].x, this.points[1].y, this.paths);
                if (!result) { console.warn(`find path fail!`) }
                for (var i = 0; i < this.paths.length; i += 2) {
                    let x = this.paths[i];
                    let y = this.paths[i + 1];
                    setState(this.DivMap[`${x}_${y}`], this.color_click);
                }

                this.paths.length = 0;
                this.points.length = 0;

                //开始 播放
                this.commandsMoveByPercent(0); //goBack to frist location
                this.autoPlay(); //start play of process

            }
        }
    }
}
