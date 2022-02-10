#pragma once

#include <iostream>
#include <string>

using namespace std;

namespace error {
	class info {
	public:
		int col;
		int row;

		info(int col, int row);
	};

	class repl {
	private:
		static bool _repl;
	public:
		static bool isRepl();
		static void toggleRepl();
	};

	void throwerror(info info, wstring reason, int errcode);
}