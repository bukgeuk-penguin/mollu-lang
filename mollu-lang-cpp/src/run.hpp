#pragma once

#include <iostream>
#include <string>
#include "token.hpp"

namespace run {
	const wstring version = L"v1.2.0";

	void runFile(token::tokenlist tokenlist);

	void runRepl();
}