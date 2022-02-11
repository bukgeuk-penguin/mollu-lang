import { tokenlist } from "./token";

export class repl {
    private static _repl: boolean = false
    static repl_tokenlist: tokenlist = []
    static repl_idx: number = 0
    static repl_comment: number = 0

    static isRepl() {
        return this._repl
    }
    static startRepl() {
        this.repl_comment = 0
        this.repl_idx = 0
        this.repl_tokenlist = []

        this._repl = true
    }
    static endRepl() {
        this._repl = false
    }
}