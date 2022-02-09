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

	void throwerror(info info, wstring reason, int errcode);
}