cmake_minimum_required(VERSION 3.15...4.4)

project(FetchExample LANGUAGES CXX)

include(FetchContent)
include(CTest)

FetchContent_Declare(
  catch
  GIT_REPOSITORY https://github.com/catchorg/Catch2.git
  GIT_TAG v3.15.0)

# CMake 3.14+
FetchContent_MakeAvailable(catch)

add_executable(fetch_example main.cpp)
target_link_libraries(fetch_example PRIVATE Catch2::Catch2WithMain)
add_test(NAME fetch_example COMMAND fetch_example)
