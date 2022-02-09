#include "error.hpp"

error::info::info(int col, int row): col(col), row(row) {}

void error::throwerror(info info, wstring reason, int errcode) {
	wcout << L"이 부분을 몰?루겠어 (" << info.col << ", " << info.row << ")" << endl;
	exit(errcode);
}
