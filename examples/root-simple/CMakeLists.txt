# CMake ROOT 简单示例

## [main]
cmake_minimum_required(VERSION 3.15...4.4)

project(RootSimpleExample LANGUAGES CXX)

# 查找 ROOT 包
## [find_package]
find_package(ROOT 6.16 CONFIG REQUIRED)
## [find_package]

# 添加可执行程序并链接所需的 ROOT 库
## [add_and_link]
add_executable(RootSimpleExample SimpleExample.cxx)
target_link_libraries(RootSimpleExample PUBLIC ROOT::Physics)
## [add_and_link]

## [main]

enable_testing()
add_test(NAME RootSimpleExample COMMAND RootSimpleExample)
