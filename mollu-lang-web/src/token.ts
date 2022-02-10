import { info } from './error'

export type token_type = 'assign' | 'var_value' | 'add' | 'sub' | 'mul' | 'div' | 'positive_one' | 'positive_ten' | 'negative_one' | 'negative_ten' |
'jump_equal' | 'jump_less' | 'jump_greater' | 'define_label' | 'label' | 'input_number' | 'input_character' | 'output_number' | 'output_character' |
'line_comment' | 'block_comment_start' |'block_comment_end' | 'line_feed' | 'unknown'

export type tokenlist = Array<token>

export class token {
    type: token_type = 'unknown'
    str: string = ''
    info!: info

    constructor(type: token_type, str: string, info: info) {
        this.type = type
        this.str = str
        this.info = info
    }
}

export function tokenize(code: string): tokenlist {
    let ret: tokenlist = []
    let col = 1, row = 1

    for (let i = 0; i < code.length; i++) {
        ++row

        if (i + 4 < code.length) { // 5글자
			if (code[i] === '모' && code[i + 1] === '오' && code[i + 2] === '올' && code[i + 3] === '?' && code[i + 4] === '루') { // 점프 (n > 0)
				ret.push(new token('jump_greater', code.substring(i, i + 5), new info(col, row)));
				i += 4;
				continue;
			}
		}
		if (i + 3 < code.length) { // 4글자
			if (code[i] === '모' && code[i + 1] === '올' && code[i + 3] === '루') {
				if (code[i + 2] === '?') { // 점프 (n < 0)
					ret.push(new token('jump_less', code.substring(i, i + 4), new info(col, row)));
					i += 3;
					continue;
				} else if (code[i + 2] === '!') { // 문자 출력
					ret.push(new token('output_character', code.substring(i, i + 4), new info(col, row)));
					i += 3;
					continue;
				}
			} else if (code[i] === '왜' && code[i + 3] === '루') {
				if (code[i + 1] === '몰' && code[i + 2] === '?') { // 라벨 정의
					let j = 0;
					while (i + j < code.length) {
						if (code[i + j + 4] === '우') ++j;
						else break;
					}
					ret.push(new token('define_label', code.substring(i, i + j + 4), new info(col, row)));
					i += 3 + j;
					continue;
				} else if (code[i + 1] === '아' && code[i + 2] === '!') { // 라벨
					let j = 0;
					while (i + j < code.length) {
						if (code[i + j + 4] === '우') ++j;
						else break;
					}
					ret.push(new token('label', code.substring(i, i + j + 4), new info(col, row)));
					i += 3 + j;
					continue;
				}
			} else if (code[i] === '아' && code[i + 1] === '아' && code[i + 2] === '?' && code[i + 3] === '루') { // 문자 입력
				ret.push(new token('input_character', code.substring(i, i + 4), new info(col, row)));
				i += 3;
				continue;
			}
		}
		if (i + 2 < code.length) { // 3글자
			if (code[i] === '아' && code[i + 2] === '루') {
				if (code[i + 1] === '!') { // 변수 할당
					let j = 0;
					while (i + j < code.length) {
						if (code[i + j + 3] === '우') ++j;
						else break;
					}
					ret.push(new token('assign', code.substring(i, i + j + 3), new info(col, row)));
					i += 2 + j;
					continue;
				} else if (code[i + 1] === '?') { // 정수 입력
					ret.push(new token('input_number', code.substring(i, i + 3), new info(col, row)));
					i += 2;
					continue;
				} else if (code[i + 1] === '아') { // -10
					ret.push(new token('negative_ten', code.substring(i, i + 3), new info(col, row)));
					i += 2;
					continue;
				}
			} else if (code[i] === '몰' && code[i + 2] === '루') {
				if (code[i + 1] === '?') { // 점프 (n === 0)
					ret.push(new token('jump_equal', code.substring(i, i + 3), new info(col, row)));
					i += 2;
					continue;
				} else if (code[i + 1] === '!') { // 정수 출력
					ret.push(new token('output_number', code.substring(i, i + 3), new info(col, row)));
					i += 2;
					continue;
				}
			} else if (code[i] === '모' && code[i + 1] === '올' && code[i + 2] === '루') { // 10
				ret.push(new token('positive_ten', code.substring(i, i + 3), new info(col, row)));
				i += 2;
				continue;
			}  else if (code[i] === '<' && code[i + 1] === '-' && code[i + 2] === '-') { // 블럭 주석 시작(<--)
				ret.push(new token('block_comment_start', code.substring(i, i + 3), new info(col, row)));
				i += 2;
				continue;
			} else if (code[i] === '-' && code[i + 1] === '-' && code[i + 2] === '>') { // 블럭 주석 끝(-->)
				ret.push(new token('block_comment_end', code.substring(i, i + 3), new info(col, row)));
				i += 2;
				continue;
			}
		}
		if (i + 1 < code.length) { // 2글자
			if (code[i] === '아' && code[i + 1] === '루') { // -1
				ret.push(new token('negative_one', code.substring(i, i + 2), new info(col, row)));
				++i;
				continue;
			} else if (code[i] === '몰' && code[i + 1] === '루') { // 1
				ret.push(new token('positive_one', code.substring(i, i + 2), new info(col, row)));
				++i;
				continue;
			} else if (code[i] === '?' && code[i + 1] === '?') { // 곱셈
				ret.push(new token('mul', code.substring(i, i + 2), new info(col, row)));
				++i;
				continue;
			} else if (code[i] === '!' && code[i + 1] === '!') { // 나눗셈
				ret.push(new token('div', code.substring(i, i + 2), new info(col, row)));
				++i;
				continue;
			} else if ((code[i] === '/' && code[i + 1] === '/') || (code[i] === '=' && code[i + 1] === '>')) { // 라인 주석
				ret.push(new token('line_comment', code.substring(i, i + 2), new info(col, row)));
				++i;
				continue;
			} else if (code[i] === '/' && code[i + 1] === '*') { // 블럭 주석 시작(/*)
				ret.push(new token('block_comment_start', code.substring(i, i + 2), new info(col, row)));
				++i;
				continue;
			} else if (code[i] === '*' && code[i + 1] === '/') { // 블럭 주석 끝(*/)
				ret.push(new token('block_comment_end', code.substring(i, i + 2), new info(col, row)));
				++i;
				continue;
			}
		}
		// 1글자
		if (code[i] === '?') { // 덧셈
			ret.push(new token('add', code.substring(i, i + 1), new info(col, row)));
			continue;
		} else if (code[i] === '!') { // 뺄셈
			ret.push(new token('sub', code.substring(i, i + 1), new info(col, row)));
			continue;
		} else if (code[i] === '루') {
			let j = 0;
			while (i + j < code.length) {
				if (code[i + j + 1] === '우') ++j;
				else break;
			}
			ret.push(new token('var_value', code.substring(i, i + j + 1), new info(col, row)));
			i += j;
			continue;
		} else if (code[i] === '\n') {
			ret.push(new token('line_feed', code.substring(i, i + 1), new info(col, row)));
			++col;
			row = 0;
		}
    }

    return ret
}