# CMake ROOT simple example

## [main]
cmake_minimum_required(VERSION 3.1...3.21)

project(RootSimpleExample LANGUAGES CXX)

# Finding the ROOT package
## [find_package]
find_package(ROOT 6.16 CONFIG REQUIRED)
## [find_package]

# Adding an executable program and linking to needed ROOT libraries
## [add_and_link]
add_executable(RootSimpleExample SimpleExample.cxx)
target_link_libraries(RootSimpleExample PUBLIC ROOT::Physics)
## [add_and_link]

## [main]

enable_testing()
add_test(NAME RootSimpleExample COMMAND RootSimpleExample)
