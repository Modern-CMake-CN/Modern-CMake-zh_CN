cmake_minimum_required(VERSION 3.14...3.21)

project(FetchExample LANGUAGES CXX)

include(FetchContent)
include(CTest)

FetchContent_Declare(
  catch
  GIT_REPOSITORY https://github.com/catchorg/Catch2.git
  GIT_TAG v2.13.6)

# CMake 3.14+
FetchContent_MakeAvailable(catch)

add_executable(fetch_example main.cpp)
target_link_libraries(fetch_example PRIVATE Catch2::Catch2)
add_test(NAME fetch_example COMMAND fetch_example)
