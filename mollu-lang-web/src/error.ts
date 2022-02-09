import { print_string } from './io'

export class info {
    col: number
    row: number

    constructor(col: number, row: number) {
        this.col = col
        this.row = row
    }
}

let _isErrorOccurred = false
export function isErrorOccurred(): boolean {
    return _isErrorOccurred
}

export function throwerror(info: info, reason: string, errcode: number) {
    print_string(`이 부분을 몰?루겠어 (${info.col}, ${info.row})\n`)
    _isErrorOccurred = true
}

export function init() {
    _isErrorOccurred = false
}