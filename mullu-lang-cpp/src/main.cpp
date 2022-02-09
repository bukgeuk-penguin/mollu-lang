#include <iostream>
#include <string>
#include <fstream>
#include <locale.h>

#include "run.hpp"

using namespace std;

void init() {
	setlocale(LC_ALL, "KOREAN");
	wcout.imbue(locale("korean"));
}

int main(int argc, char** argv) {
	if (argc < 2) return 0;

	init();

	string path(argv[1]);
	if (path.substr(path.rfind('.')) != ".mol") {
		wcout << L"몰?루는 파일이야" << endl;
		return 0;
	}
	
	wstring code;
	wifstream file(path);
	file.imbue(locale("korean"));
	if (file.is_open()) {
		wstring line;	
		while (getline(file, line)) {
			code += line;
			code += '\n';
		}
		file.close();
	}

	auto tokenlist = token::tokenize(code);
	run::run(tokenlist);

	return 0;
}