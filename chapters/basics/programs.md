# Running other programs

## Running a command at configure time

Running a command at configure time is relatively easy. Use [`execute_process`][execute_process] to run a process and access the results. It is generally a good idea to avoid hard coding a program path into your CMake; you can use `${CMAKE_COMMAND}`, `find_package(Git)`, or `find_program` to get access to a command to run. Use `RESULT_VARIABLE` to check the return code and `OUTPUT_VARIABLE` to get the output.

Here is an example that updates all git submodules:

```cmake
find_package(Git QUIET)

if(GIT_FOUND AND EXISTS "${PROJECT_SOURCE_DIR}/.git")
    execute_process(COMMAND ${GIT_EXECUTABLE} submodule update --init --recursive
                    WORKING_DIRECTORY ${CMAKE_CURRENT_SOURCE_DIR}
                    RESULT_VARIABLE GIT_SUBMOD_RESULT)
    if(NOT GIT_SUBMOD_RESULT EQUAL "0")
        message(FATAL_ERROR "git submodule update --init --recursive failed with ${GIT_SUBMOD_RESULT}, please checkout submodules")
    endif()
endif()
```

## Running a command at build time

Build time commands are a bit trickier. The main complication comes from the target system; when do you want your command to run? Does it produce an output that another target needs? With this in mind, here is an example that calls a Python script to generate a header file:

```cmake
find_package(PythonInterp REQUIRED)
add_custom_command(OUTPUT "${CMAKE_CURRENT_BINARY_DIR}/include/Generated.hpp"
    COMMAND "${PYTHON_EXECUTABLE}" "${CMAKE_CURRENT_SOURCE_DIR}/scripts/GenerateHeader.py" --argument
    DEPENDS some_target)

add_custom_target(generate_header ALL
    DEPENDS "${CMAKE_CURRENT_BINARY_DIR}/include/Generated.hpp")

install(FILES ${CMAKE_CURRENT_BINARY_DIR}/include/Generated.hpp DESTINATION include)
```

Here, the generation happens after `some_target` is complete, and happens when you run make without a target (`ALL`). If you make this a dependency of another target with `add_dependencies`, you could avoid the `ALL` keyword. Or, you could require that a user explicitly builds the `generate_header` target when making.

## Included common utilities

A useful tool in writing CMake builds that work cross-platform is `cmake -E <mode>` (seen in CMake files as `${CMAKE_COMMAND} -E`). This mode allows CMake to do a variety of things without calling system tools explicitly, like `copy`, `make_directory`, and `remove`. It is mostly used for the build time commands. Note that the very useful `create_symlink` mode used to be Unix only, but was added for Windows in CMake 3.13. [See the docs](https://cmake.org/cmake/help/latest/manual/cmake.1.html#command-line-tool-mode).

[execute_process]: https://cmake.org/cmake/help/latest/command/execute_process.html
