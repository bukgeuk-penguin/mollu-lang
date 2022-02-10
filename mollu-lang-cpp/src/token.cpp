#include "token.hpp"

token::tokenlist token::tokenize(wstring code) {
	tokenlist ret;
	int col = 1;
	int row = 1;

	for (size_t i = 0; i < code.length(); i++) {
		++row;

		if (i + 4 < code.length()) { // 5글자
			if (code[i] == L'모' && code[i + 1] == L'오' && code[i + 2] == L'올' && code[i + 3] == L'?' && code[i + 4] == L'루') { // 점프 (n > 0)
				ret.push_back(token(token_type::jump_greater, code.substr(i, 5), error::info(col, row)));
				i += 4;
				continue;
			}
		}
		if (i + 3 < code.length()) { // 4글자
			if (code[i] == L'모' && code[i + 1] == L'올' && code[i + 3] == L'루') {
				if (code[i + 2] == L'?') { // 점프 (n < 0)
					ret.push_back(token(token_type::jump_less, code.substr(i, 4), error::info(col, row)));
					i += 3;
					continue;
				} else if (code[i + 2] == L'!') { // 문자 출력
					ret.push_back(token(token_type::output_character, code.substr(i, 4), error::info(col, row)));
					i += 3;
					continue;
				}
			} else if (code[i] == L'왜' && code[i + 3] == L'루') {
				if (code[i + 1] == L'몰' && code[i + 2] == L'?') { // 라벨 정의
					size_t j = 0;
					while (i + j < code.length()) {
						if (code[i + j + 4] == L'우') ++j;
						else break;
					}
					ret.push_back(token(token_type::define_label, code.substr(i, j + 4), error::info(col, row)));
					i += 3 + j;
					continue;
				} else if (code[i + 1] == L'아' && code[i + 2] == L'!') { // 라벨
					size_t j = 0;
					while (i + j < code.length()) {
						if (code[i + j + 4] == L'우') ++j;
						else break;
					}
					ret.push_back(token(token_type::label, code.substr(i, j + 4), error::info(col, row)));
					i += 3 + j;
					continue;
				}
			} else if (code[i] == L'아' && code[i + 1] == L'아' && code[i + 2] == L'?' && code[i + 3] == L'루') { // 문자 입력
				ret.push_back(token(token_type::input_character, code.substr(i, 4), error::info(col, row)));
				i += 3;
				continue;
			}
		}
		if (i + 2 < code.length()) { // 3글자
			if (code[i] == L'아' && code[i + 2] == L'루') {
				if (code[i + 1] == L'!') { // 변수 할당
					size_t j = 0;
					while (i + j < code.length()) {
						if (code[i + j + 3] == L'우') ++j;
						else break;
					}
					ret.push_back(token(token_type::assign, code.substr(i, j + 3), error::info(col, row)));
					i += 2 + j;
					continue;
				} else if (code[i + 1] == L'?') { // 정수 입력
					ret.push_back(token(token_type::input_number, code.substr(i, 3), error::info(col, row)));
					i += 2;
					continue;
				} else if (code[i + 1] == L'아') { // -10
					ret.push_back(token(token_type::negative_ten, code.substr(i, 3), error::info(col, row)));
					i += 2;
					continue;
				}
			} else if (code[i] == L'몰' && code[i + 2] == L'루') {
				if (code[i + 1] == L'?') { // 점프 (n == 0)
					ret.push_back(token(token_type::jump_equal, code.substr(i, 3), error::info(col, row)));
					i += 2;
					continue;
				} else if (code[i + 1] == L'!') { // 정수 출력
					ret.push_back(token(token_type::output_number, code.substr(i, 3), error::info(col, row)));
					i += 2;
					continue;
				}
			} else if (code[i] == L'모' && code[i + 1] == L'올' && code[i + 2] == L'루') { // 10
				ret.push_back(token(token_type::positive_ten, code.substr(i, 3), error::info(col, row)));
				i += 2;
				continue;
			} else if (code[i] == L'<' && code[i + 1] == L'-' && code[i + 2] == L'-') { // 블럭 주석 시작(<--)
				ret.push_back(token(token_type::block_comment_start, code.substr(i, 3), error::info(col, row)));
				i += 2;
				continue;
			} else if (code[i] == L'-' && code[i + 1] == L'-' && code[i + 2] == L'>') { // 블럭 주석 끝(-->)
				ret.push_back(token(token_type::block_comment_end, code.substr(i, 3), error::info(col, row)));
				i += 2;
				continue;
			}
		}
		if (i + 1 < code.length()) { // 2글자
			if (code[i] == L'아' && code[i + 1] == L'루') { // -1
				ret.push_back(token(token_type::negative_one, code.substr(i, 2), error::info(col, row)));
				++i;
				continue;
			} else if (code[i] == L'몰' && code[i + 1] == L'루') { // 1
				ret.push_back(token(token_type::positive_one, code.substr(i, 2), error::info(col, row)));
				++i;
				continue;
			} else if (code[i] == L'?' && code[i + 1] == L'?') { // 곱셈
				ret.push_back(token(token_type::mul, code.substr(i, 2), error::info(col, row)));
				++i;
				continue;
			} else if (code[i] == L'!' && code[i + 1] == L'!') { // 나눗셈
				ret.push_back(token(token_type::div, code.substr(i, 2), error::info(col, row)));
				++i;
				continue;
			} else if ((code[i] == L'/' && code[i + 1] == L'/') || (code[i] == L'=' && code[i + 1] == L'>')) { // 라인 주석
				ret.push_back(token(token_type::line_comment, code.substr(i, 2), error::info(col, row)));
				++i;
				continue;
			} else if (code[i] == L'/' && code[i + 1] == L'*') { // 블럭 주석 시작(/*)
				ret.push_back(token(token_type::block_comment_start, code.substr(i, 2), error::info(col, row)));
				++i;
				continue;
			} else if (code[i] == L'*' && code[i + 1] == L'/') { // 블럭 주석 끝(*/)
				ret.push_back(token(token_type::block_comment_end, code.substr(i, 2), error::info(col, row)));
				++i;
				continue;
			}
		}
		// 1글자
		if (code[i] == L'?') { // 덧셈
			ret.push_back(token(token_type::add, code.substr(i, 1), error::info(col, row)));
			continue;
		} else if (code[i] == L'!') { // 뺄셈
			ret.push_back(token(token_type::sub, code.substr(i, 1), error::info(col, row)));
			continue;
		} else if (code[i] == L'루') {
			size_t j = 0;
			while (i + j < code.length()) {
				if (code[i + j + 1] == L'우') ++j;
				else break;
			}
			ret.push_back(token(token_type::var_value, code.substr(i, j + 1), error::info(col, row)));
			i += j;
			continue;
		} else if (code[i] == L'\n') {
			ret.push_back(token(token_type::line_feed, code.substr(i, 1), error::info(col, row)));
			++col;
			row = 0;
		}
	}

	return ret;
}

token::token::token(token_type type, wstring str, error::info info): type(type), str(str), info(info) {}
