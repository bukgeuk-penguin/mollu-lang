#include "error.hpp"

error::info::info(int col, int row): col(col), row(row) {}

void error::throwerror(info info, wstring reason, int errcode) {
	wcout << L"�� �κ��� ��?��ھ� (" << info.col << ", " << info.row << ")" << endl;
	exit(errcode);
}
