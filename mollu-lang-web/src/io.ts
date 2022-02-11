import * as readline from 'readline'

let rl: readline.Interface | undefined
let _env: 'node' | 'web' = 'web'
export function setEnvironment(env: 'node' | 'web') {
    _env = env
    if (env === 'node') {
        rl = readline.createInterface({
            input: process.stdin,
            output: process.stdout
        })
    }
}

export async function input_number(): Promise<number> {
    return new Promise<number>((resolve, reject) => {
        if (_env === 'node') {
            if (!rl) resolve(0)
            else {
                rl.on("line", line => {
                    rl?.close()
                    try {
                        resolve(parseInt(line))
                    } catch (e) {
                        resolve(0)
                    }
                })
            }
        } else if (_env === 'web') {
            let value = prompt('정수 입력')
            if (!value) resolve(0)
            else {
                try {
                    resolve(parseInt(value))
                } catch (e) {
                    resolve(0)
                }
            }
        }
    })
}

let buffer = ''
export async function input_character(): Promise<number> {
    return new Promise<number>((resolve, reject) => {
        if (_env === 'node') {
            if (buffer) {
                let temp = buffer.substring(0, 1)
                buffer = buffer.substring(1)
                resolve(temp.charCodeAt(0))
            } else {
                if (!rl) resolve(0)
                else {
                    rl.on("line", line => {
                        rl?.close()
                        if (!line) resolve(0)
                        else {
                            buffer = line.substring(1)
                            resolve(line.charCodeAt(0))
                        }
                    })
                }
            }
        } else if (_env === 'web') {
            if (!buffer) {
                let temp = prompt('문자 입력')
                if (!temp) resolve(0)
                else buffer = temp
            }
        
            let temp = buffer.substring(0, 1)
            buffer = buffer.substring(1)
            resolve(temp.charCodeAt(0))
        }
    })
}

let _listener: (text: string) => void | undefined
export function setEventListener(listener: (text: string) => void) {
    _listener = listener
}

export function output_number(value: number) {
    if (_listener)
        _listener(value.toString())
}

export function output_character(value: number) {
    if (_listener)
        _listener(String.fromCharCode(value))
}

export function print_string(str: string) {
    if (_listener)
        _listener(str)
}