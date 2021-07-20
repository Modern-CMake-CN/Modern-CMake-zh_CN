# Testing

## General Testing Information

In your main CMakeLists.txt you need to add the following function call (not in a subfolder):

```cmake
if(CMAKE_PROJECT_NAME STREQUAL PROJECT_NAME)
    include(CTest)
endif()
```

Which will enable testing and set a `BUILD_TESTING` option so users can turn testing on and off (along with [a few other things](https://gitlab.kitware.com/cmake/cmake/blob/master/Modules/CTest.cmake)). Or you can do this yourself by directly calling `enable_testing()`.

When you add your test folder, you should do something like this:

```cmake
if(CMAKE_PROJECT_NAME STREQUAL PROJECT_NAME AND BUILD_TESTING)
    add_subdirectory(tests)
endif()
```

The reason for this is that if someone else includes your package, and they use `BUILD_TESTING`, they probably do not want your tests to build. In the rare case that you really do want to enable testing on both packages, you can provide an override:

```cmake
if((CMAKE_PROJECT_NAME STREQUAL PROJECT_NAME OR MYPROJECT_BUILD_TESTING) AND BUILD_TESTING)
    add_subdirectory(tests)
endif()
```

The main use case for the override above is actually in this book's own examples, as the master CMake project really does want to run all the subproject tests.

You can register targets with:

```cmake
add_test(NAME TestName COMMAND TargetName)
```

If you put something else besides a target name after COMMAND, it will register as a command line to run. It would also be valid to put the generator expression:

```cmake
add_test(NAME TestName COMMAND $<TARGET_FILE:${TESTNAME}>)
```

which would use the output location (thus, the executable) of the produced target.


## Building as part of a test

If you want to run CMake to build a project as part of a test, you can do that too (in fact, this is how CMake tests itself). For example, if your master project was called `MyProject` and you had an `examples/simple` project that could build by itself, this would look like:

```cmake
add_test(
  NAME
    ExampleCMakeBuild
  COMMAND
    "${CMAKE_CTEST_COMMAND}"
             --build-and-test "${My_SOURCE_DIR}/examples/simple"
                              "${CMAKE_CURRENT_BINARY_DIR}/simple"
             --build-generator "${CMAKE_GENERATOR}"
             --test-command "${CMAKE_CTEST_COMMAND}"
)
```

## Testing Frameworks

Look at the subchapters for recipes for popular frameworks.

* [GoogleTest](testing/googletest.md): A popular option from Google. Development can be a bit slow.
* [Catch2](testing/catch.md): A modern, PyTest-like framework with clever macros.
* [DocTest](https://github.com/onqtam/doctest): A replacement for Catch2 that is supposed to compile much faster and be cleaner. See Catch2 chapter and replace with DocTest.
