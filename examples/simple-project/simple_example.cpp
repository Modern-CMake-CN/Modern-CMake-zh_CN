// This is an example file as part of Modern-CMake

#include "simple_lib.hpp"

#include <iostream>

int main() {

    std::cout << "Simple example C++ compiled correctly and ran." << std::endl;
    std::cout << simple_lib_function() << std::endl;

    return 0;
}
