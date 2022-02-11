import * as io from "./io";
import * as token from "./token"
import * as run from "./run"
import * as error from "./error"
import { repl } from "./repl";
import packageJson from '../package.json'

export function setEventListener(listener: (text: string) => void) {
    io.setEventListener(listener)
}

function init() {
    error.init()
}

export function startRepl() {
    init()
    repl.startRepl()
    io.print_string(`${packageJson.name} ${packageJson.version}`)
    io.print_string('Type exit or exit() to exit')
}

export function endRepl() {
    repl.endRepl()
}

export function isRepl() {
    return repl.isRepl()
}

export async function execute(code: string) {
    if (repl.isRepl()) {
        await run.runRepl(code)
    } else {
        init()

        let tokenlist = token.tokenize(code)
        await run.run(tokenlist)
    }
}