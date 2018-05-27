export function setState(ehtml:HTMLElement,color:string ,g=-1,h=-1 ){
    let sta = new stateData (color,g,h);
    commandMgr.Instance.execute(new rectSetCommand(ehtml,sta));
}

export function batState( States:{ehtml:HTMLElement,color:string ,g:number,h:number}[]){
    let batc = new batchCommand();
    States.forEach(sub =>{
        let sta = new stateData (sub.color,sub.g,sub.h);
        batc.addComd(new rectSetCommand(sub.ehtml,sta));
    });
    commandMgr.Instance.execute(batc);
}

//命令模式 接口
export interface Icommand{
    execute();
    undo();
}

export class stateData{
    constructor(public color:string ,public g=0,public h=0){
    }
}

export class rectSetCommand implements Icommand{
    private lastSta:stateData;
    constructor(public htmle:HTMLElement, public sta:stateData){
        let g_ = this.htmle.getElementsByClassName("class_g")[0];
        let h_ = this.htmle.getElementsByClassName("class_h")[0];
        this.lastSta = new stateData(htmle.style.background,Number(g_.textContent),Number(h_.textContent));
    }

    execute(){
        this.htmle.style.background = this.sta.color;
        let f_text = this.htmle.getElementsByClassName("class_f")[0];
        let g_text = this.htmle.getElementsByClassName("class_g")[0];
        let h_text = this.htmle.getElementsByClassName("class_h")[0];
        f_text.textContent = `${this.sta.g + this.sta.h}`;
        g_text.textContent = `${this.sta.g}`;
        h_text.textContent = `${this.sta.h}`;
        (f_text as HTMLElement).style.display = this.sta.g + this.sta.h < 0 ? "none" : "";
        (g_text as HTMLElement).style.display = this.sta.g  < 0 ? "none" : "";
        (h_text as HTMLElement).style.display = this.sta.h  < 0 ? "none" : "";

    }

    undo(){
        this.htmle.style.background = this.lastSta.color;
        let f_text = this.htmle.getElementsByClassName("class_f")[0];
        let g_text = this.htmle.getElementsByClassName("class_g")[0];
        let h_text = this.htmle.getElementsByClassName("class_h")[0];
        f_text.textContent = `${this.lastSta.g + this.lastSta.h}`;
        g_text.textContent = `${this.lastSta.g}`;
        h_text.textContent = `${this.lastSta.h}`;
        (f_text as HTMLElement).style.display = this.lastSta.g + this.lastSta.h < 0 ? "none" : "";
        (g_text as HTMLElement).style.display = this.lastSta.g  < 0 ? "none" : "";
        (h_text as HTMLElement).style.display = this.lastSta.h  < 0 ? "none" : "";
    }
}

export class batchCommand implements Icommand{
    private comds:Icommand[] = [];
    addComd(comd:Icommand){
        this.comds.push(comd);
    }
    execute(){
        this.comds.forEach(element => {
            if(element) element.execute();
        });
    }

    undo(){
        this.comds.forEach(element => {
            if(element) element.undo();
        });
    }
}

export class commandMgr{
    private static _instance:commandMgr;
    static get Instance(){
        if(!this._instance){
            this._instance = new commandMgr();
            document["commandMgr"] = this._instance;// 暴露出去
        }
        return this._instance;
    }

    get index(){return this.currIdx;};
    get length(){return this.coms.length;};
    private currIdx = -1;
    private coms:Icommand[] =[];

    execute(com:Icommand){
        if(!com) return;
        this.coms.push(com);
        com.execute();
        this.currIdx = this.coms.length - 1;
    }

    undo(){
        if(this.currIdx < 0)return;
        let com = this.coms[this.currIdx];
        if(!com) return;
        com.undo();
        this.currIdx --;
    }

    recovery(){
        if(this.currIdx >= this.coms.length - 1)return;
        this.currIdx++;
        let com = this.coms[this.currIdx];
        if(!com) return;
        com.execute();
    }

    clear(){
        this.coms.length = 0;
        this.currIdx = -1;
    }
}