# CMake ROOT dict example

## [main]

cmake_minimum_required(VERSION 3.4...3.21)

project(RootDictExample LANGUAGES CXX)

set(CMAKE_CXX_STANDARD 11 CACHE STRING "C++ standard to use")
set(CMAKE_CXX_STANDARD_REQUIRED ON)
set(CMAKE_CXX_EXTENSIONS OFF)
set(CMAKE_PLATFORM_INDEPENDENT_CODE ON)

find_package(ROOT 6.20 CONFIG REQUIRED)
# If you want to support <6.20, add this line:
# include("${ROOT_DIR}/modules/RootNewMacros.cmake")
# However, it was moved and included by default in 6.201

root_generate_dictionary(G__DictExample DictExample.h LINKDEF DictLinkDef.h)

add_library(DictExample SHARED DictExample.cxx DictExample.h G__DictExample.cxx)
target_include_directories(DictExample PUBLIC "${CMAKE_CURRENT_SOURCE_DIR}")
target_link_libraries(DictExample PUBLIC ROOT::Core)

## Alternative to add the dictionary to an existing target:
# add_library(DictExample SHARED DictExample.cxx DictExample.h)
# target_include_directories(DictExample PUBLIC "${CMAKE_CURRENT_SOURCE_DIR}")
# target_link_libraries(DictExample PUBLIC ROOT::Core)
# root_generate_dictionary(G__DictExample DictExample.h MODULE DictExample LINKDEF DictLinkDef.h)

## [main]

message(STATUS "Found ROOT: ${ROOT_VERSION} at ${ROOT_DIR}")
message(STATUS "Original flags: ${ROOT_CXX_FLAGS}")
message(STATUS "Original definitions: ${ROOT_DEFINITIONS}")
message(STATUS "Original exe flags: ${ROOT_EXE_LINKER_FLAGS}")

enable_testing()
add_test(
  NAME RootDictExample
  WORKING_DIRECTORY "${CMAKE_CURRENT_BINARY_DIR}"
  COMMAND "${ROOT_root_CMD}" -b -l -q "${CMAKE_CURRENT_SOURCE_DIR}/CheckLoad.C")
