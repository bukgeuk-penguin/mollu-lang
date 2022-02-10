#include "error.hpp"

error::info::info(int col, int row): col(col), row(row) {}

bool error::repl::_repl = false;

void error::throwerror(info info, wstring reason, int errcode) {
	wcout << L"이 부분을 몰?루겠어 (" << info.col << ", " << info.row << ")" << endl;

	if (!repl::isRepl()) exit(errcode);
}

bool error::repl::isRepl() {
	return _repl;
}

void error::repl::toggleRepl() {
	_repl = !_repl;
}
