import * as io from "./io";
import * as token from "./token"
import * as run from "./run"
import * as error from "./error"

export function setEventListener(listener: (text: string) => void) {
    io.setEventListener(listener)
}

function init() {
    error.init()
}

export function execute(code: string) {
    init()

    let tokenlist = token.tokenize(code)
    run.run(tokenlist)
}