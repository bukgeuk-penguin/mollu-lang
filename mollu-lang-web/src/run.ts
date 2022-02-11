import { tokenize, tokenlist } from './token'
import { input_number, input_character, output_number, output_character } from './io'
import { throwerror, isErrorOccurred } from './error'
import { repl } from './repl';

let vartable: number[] = [];
let labeltable: number[] = [];

let calc_idx: number = 0
async function calc(tokenlist: tokenlist): Promise<number> {
	let isvalue = true;
	let value = 0;
	for (let i = calc_idx; i < tokenlist.length; i++) {
		if (isvalue) {
			let temp = 0;
			switch (tokenlist[i].type) {
			case 'var_value': {
				temp = vartable[tokenlist[i].str.length - 1];
                if (temp === undefined) temp = 0
				break;
			}
			case 'positive_one':
				temp = 1;
				break;
			case 'positive_ten':
				temp = 10;
				break;
			case 'negative_one':
				temp = -1;
				break;
			case 'negative_ten':
				temp = -10;
				break;
			case 'input_number':
                temp = await input_number()
				break;
			case 'input_character':
				temp = await input_character()
				break;
			default:
				throwerror(tokenlist[i].info, '', 0);
			}

			if (i === calc_idx) value += temp;
			else if (tokenlist[i - 1].type == 'add') value += temp;
			else if (tokenlist[i - 1].type == 'sub') value -= temp;
			else if (tokenlist[i - 1].type == 'mul') value *= temp;
			else if (tokenlist[i - 1].type == 'div') value /= temp;
		} else {
			switch (tokenlist[i].type) {
			case 'add':
			case 'sub':
			case 'mul':
			case 'div':
				break;
			default:
				calc_idx = i - 1;
				return value;
			}
		}

		isvalue = !isvalue;
	}

	calc_idx = tokenlist.length - 1;
	return value;
}

export async function run(tokenlist: tokenlist) {
	let comment = 0; // 0 = none, 1 = line, 2 = block

	for (let i = 0; i < tokenlist.length; i++) {
        if (isErrorOccurred()) break;

		switch (tokenlist[i].type) {
			case 'line_comment':
				if (comment == 0) comment = 1;
				break;
			case 'line_feed':
				if (comment == 1) comment = 0;
				break;
			case 'block_comment_start':
				if (comment == 0) comment = 2;
				break;
			case 'block_comment_end':
				if (comment == 2) comment = 0;
				break;
		}
	
		if (comment != 0) continue;

		switch (tokenlist[i].type) {
		case 'assign': {
			let temp = tokenlist[i].str.length;
			++i;
            calc_idx = i
			let value = await calc(tokenlist);
            i = calc_idx
			vartable[temp - 3] = value;
			break;
		}
		case 'jump_equal':
		case 'jump_less': 
		case 'jump_greater': {
			if (i + 2 >= tokenlist.length) {
				throwerror(tokenlist[i].info, "", 0)
				break;
			}
			let temp = tokenlist[i].type;
			++i;
            calc_idx = i
			let value = await calc(tokenlist);
            i = calc_idx
			++i;
			if (tokenlist[i].type == 'label') {
				let togo = labeltable[tokenlist[i].str.length - 4];
				if (togo < 0) {
					throwerror(tokenlist[i].info, "", 0);
				}

				let condition = false;
				if (temp == 'jump_equal') condition = (value == 0);
				else if (temp == 'jump_less') condition = (value < 0);
				else if (temp == 'jump_greater') condition = (value > 0);

				if (condition) {
					i = togo;
				}
			} else {
				throwerror(tokenlist[i].info, "", 0);
			}
			break;
		}
		case 'define_label': {
			labeltable[tokenlist[i].str.length - 4] = i;
			break;
		}
		case 'output_number': {
			++i;
            calc_idx = i
			let value = await calc(tokenlist);
            i = calc_idx
            output_number(value)
			break;
		}
		case 'output_character': {
			++i;
            calc_idx = i
			let value = await calc(tokenlist);
            i = calc_idx
            output_character(value)
			break;
		}
		case 'line_comment':
		case 'line_feed':
		case 'block_comment_start':
		case 'block_comment_end':
			break;
		default:
			throwerror(tokenlist[i].info, "", 0);
		}
	}
}

export async function runRepl(code: string) {
	if (code === 'exit' || code === 'exit()') {
		repl.endRepl()
		return
	}
	let tl = tokenize(code)
	repl.repl_tokenlist = repl.repl_tokenlist.concat(tl)

	for (; repl.repl_idx < repl.repl_tokenlist.length; repl.repl_idx++) {
        if (isErrorOccurred() || !repl.isRepl()) break;

		switch (repl.repl_tokenlist[repl.repl_idx].type) {
			case 'line_comment':
				if (repl.repl_comment == 0) repl.repl_comment = 1;
				break;
			case 'line_feed':
				if (repl.repl_comment == 1) repl.repl_comment = 0;
				break;
			case 'block_comment_start':
				if (repl.repl_comment == 0) repl.repl_comment = 2;
				break;
			case 'block_comment_end':
				if (repl.repl_comment == 2) repl.repl_comment = 0;
				break;
		}
	
		if (repl.repl_comment != 0) continue;

		switch (repl.repl_tokenlist[repl.repl_idx].type) {
		case 'assign': {
			let temp = repl.repl_tokenlist[repl.repl_idx].str.length;
			++repl.repl_idx;
            calc_idx = repl.repl_idx
			let value = await calc(repl.repl_tokenlist);
            repl.repl_idx = calc_idx
			vartable[temp - 3] = value;
			break;
		}
		case 'jump_equal':
		case 'jump_less': 
		case 'jump_greater': {
			if (repl.repl_idx + 2 >= repl.repl_tokenlist.length) {
				throwerror(repl.repl_tokenlist[repl.repl_idx].info, "", 0)
				break;
			}
			let temp = repl.repl_tokenlist[repl.repl_idx].type;
			++repl.repl_idx;
            calc_idx = repl.repl_idx
			let value = await calc(repl.repl_tokenlist);
            repl.repl_idx = calc_idx
			++repl.repl_idx;
			if (repl.repl_tokenlist[repl.repl_idx].type == 'label') {
				let togo = labeltable[repl.repl_tokenlist[repl.repl_idx].str.length - 4];
				if (togo < 0) {
					throwerror(repl.repl_tokenlist[repl.repl_idx].info, "", 0);
				}

				let condition = false;
				if (temp == 'jump_equal') condition = (value == 0);
				else if (temp == 'jump_less') condition = (value < 0);
				else if (temp == 'jump_greater') condition = (value > 0);

				if (condition) {
					repl.repl_idx = togo;
				}
			} else {
				throwerror(repl.repl_tokenlist[repl.repl_idx].info, "", 0);
			}
			break;
		}
		case 'define_label': {
			labeltable[repl.repl_tokenlist[repl.repl_idx].str.length - 4] = repl.repl_idx;
			break;
		}
		case 'output_number': {
			++repl.repl_idx;
            calc_idx = repl.repl_idx
			let value = await calc(repl.repl_tokenlist);
            repl.repl_idx = calc_idx
            output_number(value)
			break;
		}
		case 'output_character': {
			++repl.repl_idx;
            calc_idx = repl.repl_idx
			let value = await calc(repl.repl_tokenlist);
            repl.repl_idx = calc_idx
            output_character(value)
			break;
		}
		case 'line_comment':
		case 'line_feed':
		case 'block_comment_start':
		case 'block_comment_end':
			break;
		default:
			throwerror(repl.repl_tokenlist[repl.repl_idx].info, "", 0);
		}
	}
}