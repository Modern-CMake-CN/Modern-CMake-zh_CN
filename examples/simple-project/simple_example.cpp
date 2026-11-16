// 这是 Modern-CMake 教程中的示例文件

#include "simple_lib.hpp"

#include <iostream>

int main() {

    std::cout << "Simple example C++ compiled correctly and ran." << std::endl;
    std::cout << simple_lib_function() << std::endl;

    return 0;
}
