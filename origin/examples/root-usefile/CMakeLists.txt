# CMake ROOT usefile example

## [main]
cmake_minimum_required(VERSION 3.1...3.21)

project(RootUseFileExample LANGUAGES CXX)

find_package(ROOT 6.16 CONFIG REQUIRED)

## [core]
# Sets up global settings
include("${ROOT_USE_FILE}")

# This is required for ROOT < 6.16
# string(REPLACE "-L " "-L" ROOT_EXE_LINKER_FLAGS "${ROOT_EXE_LINKER_FLAGS}")

# This is required on if there is more than one flag (like on macOS)
separate_arguments(ROOT_EXE_LINKER_FLAGS)

add_executable(RootUseFileExample SimpleExample.cxx)
target_link_libraries(RootUseFileExample PUBLIC ${ROOT_LIBRARIES}
                                                ${ROOT_EXE_LINKER_FLAGS})
## [core]

## [main]

enable_testing()
add_test(NAME RootUseFileExample COMMAND RootUseFileExample)
