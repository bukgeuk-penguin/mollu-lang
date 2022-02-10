#pragma once

#include <iostream>
#include <vector>
#include <string>
#include <tuple>
#include "error.hpp"

using namespace std;

namespace token {
	enum class token_type {
		assign,
		var_value,
		add,
		sub,
		mul,
		div,
		positive_one,
		positive_ten,
		negative_one,
		negative_ten,
		jump_equal,
		jump_less,
		jump_greater,
		define_label,
		label,
		input_number,
		input_character,
		output_number,
		output_character,
		line_comment,
		block_comment_start,
		block_comment_end,
		line_feed,
		unknown
	};

	class token {
	public:
		token_type type;
		wstring str;
		error::info info;

		token(token_type type, wstring str, error::info info);
	};
	typedef vector<token> tokenlist;
	
	tokenlist tokenize(wstring code);
}