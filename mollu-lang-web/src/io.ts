export function input_number(): number {
    let value = prompt('정수 입력')
    if (!value) return 0
    try {
        return parseInt(value)
    } catch (e) {
        return 0
    }
}

let buffer = ''
export function input_character(): number {
    if (!buffer) {
        let temp = prompt('문자 입력')
        if (!temp) return 0
        buffer = temp
    }

    let temp = buffer.substring(0, 1)
    buffer = buffer.substring(1)
    return temp.charCodeAt(0)
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