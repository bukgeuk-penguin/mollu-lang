#include "token.hpp"

token::tokenlist token::tokenize(wstring code) {
	tokenlist ret;
	int col = 1;
	int row = 1;

	for (size_t i = 0; i < code.length(); i++) {
		++row;

		if (i + 4 < code.length()) { // 5����
			if (code[i] == L'��' && code[i + 1] == L'��' && code[i + 2] == L'��' && code[i + 3] == L'?' && code[i + 4] == L'��') { // ���� (n > 0)
				ret.push_back(token(token_type::jump_greater, code.substr(i, 5), error::info(col, row)));
				i += 4;
				continue;
			}
		}
		if (i + 3 < code.length()) { // 4����
			if (code[i] == L'��' && code[i + 1] == L'��' && code[i + 3] == L'��') {
				if (code[i + 2] == L'?') { // ���� (n < 0)
					ret.push_back(token(token_type::jump_less, code.substr(i, 4), error::info(col, row)));
					i += 3;
					continue;
				} else if (code[i + 2] == L'!') { // ���� ���
					ret.push_back(token(token_type::output_character, code.substr(i, 4), error::info(col, row)));
					i += 3;
					continue;
				}
			} else if (code[i] == L'��' && code[i + 3] == L'��') {
				if (code[i + 1] == L'��' && code[i + 2] == L'?') { // �� ����
					size_t j = 0;
					while (i + j < code.length()) {
						if (code[i + j + 4] == L'��') ++j;
						else break;
					}
					ret.push_back(token(token_type::define_label, code.substr(i, j + 4), error::info(col, row)));
					i += 3 + j;
					continue;
				} else if (code[i + 1] == L'��' && code[i + 2] == L'!') { // ��
					size_t j = 0;
					while (i + j < code.length()) {
						if (code[i + j + 4] == L'��') ++j;
						else break;
					}
					ret.push_back(token(token_type::label, code.substr(i, j + 4), error::info(col, row)));
					i += 3 + j;
					continue;
				}
			} else if (code[i] == L'��' && code[i + 1] == L'��' && code[i + 2] == L'?' && code[i + 3] == L'��') { // ���� �Է�
				ret.push_back(token(token_type::input_character, code.substr(i, 4), error::info(col, row)));
				i += 3;
				continue;
			}
		}
		if (i + 2 < code.length()) { // 3����
			if (code[i] == L'��' && code[i + 2] == L'��') {
				if (code[i + 1] == L'!') { // ���� �Ҵ�
					size_t j = 0;
					while (i + j < code.length()) {
						if (code[i + j + 3] == L'��') ++j;
						else break;
					}
					ret.push_back(token(token_type::assign, code.substr(i, j + 3), error::info(col, row)));
					i += 2 + j;
					continue;
				} else if (code[i + 1] == L'?') { // ���� �Է�
					ret.push_back(token(token_type::input_number, code.substr(i, 3), error::info(col, row)));
					i += 2;
					continue;
				} else if (code[i + 1] == L'��') { // -10
					ret.push_back(token(token_type::negative_ten, code.substr(i, 3), error::info(col, row)));
					i += 2;
					continue;
				}
			} else if (code[i] == L'��' && code[i + 2] == L'��') {
				if (code[i + 1] == L'?') { // ���� (n == 0)
					ret.push_back(token(token_type::jump_equal, code.substr(i, 3), error::info(col, row)));
					i += 2;
					continue;
				} else if (code[i + 1] == L'!') { // ���� ���
					ret.push_back(token(token_type::output_number, code.substr(i, 3), error::info(col, row)));
					i += 2;
					continue;
				}
			} else if (code[i] == L'��' && code[i + 1] == L'��' && code[i + 2] == L'��') { // 10
				ret.push_back(token(token_type::positive_ten, code.substr(i, 3), error::info(col, row)));
				i += 2;
				continue;
			}
		}
		if (i + 1 < code.length()) { // 2����
			if (code[i] == L'��' && code[i + 1] == L'��') { // -1
				ret.push_back(token(token_type::negative_one, code.substr(i, 2), error::info(col, row)));
				++i;
				continue;
			} else if (code[i] == L'��' && code[i + 1] == L'��') { // 1
				ret.push_back(token(token_type::positive_one, code.substr(i, 2), error::info(col, row)));
				++i;
				continue;
			} else if (code[i] == L'?' && code[i + 1] == L'?') { // ����
				ret.push_back(token(token_type::mul, code.substr(i, 2), error::info(col, row)));
				++i;
				continue;
			} else if (code[i] == L'!' && code[i + 1] == L'!') { // ������
				ret.push_back(token(token_type::div, code.substr(i, 2), error::info(col, row)));
				++i;
				continue;
			}
		}
		// 1����
		if (code[i] == L'?') { // ����
			ret.push_back(token(token_type::add, code.substr(i, 1), error::info(col, row)));
			continue;
		} else if (code[i] == L'!') { // ����
			ret.push_back(token(token_type::sub, code.substr(i, 1), error::info(col, row)));
			continue;
		} else if (code[i] == L'��') {
			size_t j = 0;
			while (i + j < code.length()) {
				if (code[i + j + 1] == L'��') ++j;
				else break;
			}
			ret.push_back(token(token_type::sub, code.substr(i, j + 1), error::info(col, row)));
			i += j;
			continue;
		} else if (code[i] == L'\n') {
			++col;
			row = 0;
		}
	}

	return ret;
}

token::token::token(token_type type, wstring str, error::info info): type(type), str(str), info(info) {}
