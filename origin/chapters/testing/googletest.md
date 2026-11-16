# GoogleTest

[GoogleTest] and GoogleMock are classic options; personally, I would recommend Catch2 instead, as GoogleTest heavily follows the Google development philosophy; it drops old compilers very quickly, it assumes users want to live at HEAD, etc. Adding GoogleMock is also often painful - and you need GoogleMock to get matchers, which are a default feature in Catch2 (but not doctest).

## FetchContent method

The FetchContent module's own documentation uses GoogleTest as its example, and it is the simplest way to get it:

```cmake
include(FetchContent)

FetchContent_Declare(
  googletest
  GIT_REPOSITORY https://github.com/google/googletest.git
  GIT_TAG        v1.17.0
)

FetchContent_MakeAvailable(googletest)
```

This provides the namespaced targets `GTest::gtest`, `GTest::gtest_main`, `GTest::gmock`, and `GTest::gmock_main`; these are the same ones `find_package(GTest)` gives you for an installed copy (modern GoogleTest supports a normal CMake install, so using a packaged copy works fine too).

## Submodule method

To use this method, just checkout GoogleTest as a submodule:[^1]

```bash
git submodule add --branch=v1.17.x ../../google/googletest.git extern/googletest
```

Then, in your main `CMakeLists.txt`:

```cmake
option(PACKAGE_TESTS "Build the tests" ON)
if(PACKAGE_TESTS)
    enable_testing()
    include(GoogleTest)
    add_subdirectory(tests)
endif()
```

I would recommend using something like `PROJECT_NAME STREQUAL CMAKE_PROJECT_NAME` to set the default for the `PACKAGE_TESTS` option, since this should only build by default if this is the current project.
As mentioned before, you have to do the `enable_testing` in your main CMakeLists.

Now, in your tests directory:

```cmake
add_subdirectory("${PROJECT_SOURCE_DIR}/extern/googletest" "extern/googletest")
```

If you did this in your main CMakeLists, you could use a normal `add_subdirectory`; the extra path here is needed to correct the build path because we are calling it from a subdirectory.

The next line is optional, but keeps your `CACHE` cleaner:

```cmake
mark_as_advanced(
    BUILD_GMOCK BUILD_GTEST BUILD_SHARED_LIBS
    gmock_build_tests gtest_build_samples gtest_build_tests
    gtest_disable_pthreads gtest_force_shared_crt gtest_hide_internal_symbols
)
```

If you are interested in keeping IDEs that support folders clean, I would also add these lines:

```cmake
set_target_properties(gtest PROPERTIES FOLDER extern)
set_target_properties(gtest_main PROPERTIES FOLDER extern)
set_target_properties(gmock PROPERTIES FOLDER extern)
set_target_properties(gmock_main PROPERTIES FOLDER extern)
```

## Adding tests

Whichever way you added GoogleTest, to add a test, I'd recommend the following macro:

```cmake
macro(package_add_test TESTNAME)
    # create an executable in which the tests will be stored
    add_executable(${TESTNAME} ${ARGN})
    # link the Google test infrastructure, mocking library, and a default main function to
    # the test executable.  Remove GTest::gtest_main if writing your own main function.
    target_link_libraries(${TESTNAME} GTest::gtest GTest::gmock GTest::gtest_main)
    # gtest_discover_tests replaces gtest_add_tests,
    # see https://cmake.org/cmake/help/latest/module/GoogleTest.html for more options to pass to it
    gtest_discover_tests(${TESTNAME}
        # set a working directory to your project root so that you can find test data via paths relative to the project root
        WORKING_DIRECTORY ${PROJECT_SOURCE_DIR}
        PROPERTIES VS_DEBUGGER_WORKING_DIRECTORY "${PROJECT_SOURCE_DIR}"
    )
    set_target_properties(${TESTNAME} PROPERTIES FOLDER tests)
endmacro()

package_add_test(test1 test1.cpp)
```

This will allow you to quickly and simply add tests. Feel free to adjust to suit your needs. If you haven't seen it before, `ARGN` is "every argument after the listed ones".
Modify the macro to meet your needs. For example, if you're testing libraries and need to link in different libraries for different tests, you might use this:

```cmake
macro(package_add_test_with_libraries TESTNAME FILES LIBRARIES TEST_WORKING_DIRECTORY)
    add_executable(${TESTNAME} ${FILES})
    target_link_libraries(${TESTNAME} GTest::gtest GTest::gmock GTest::gtest_main ${LIBRARIES})
    gtest_discover_tests(${TESTNAME}
        WORKING_DIRECTORY ${TEST_WORKING_DIRECTORY}
        PROPERTIES VS_DEBUGGER_WORKING_DIRECTORY "${TEST_WORKING_DIRECTORY}"
    )
    set_target_properties(${TESTNAME} PROPERTIES FOLDER tests)
endmacro()

package_add_test_with_libraries(test1 test1.cpp lib_to_test "${PROJECT_SOURCE_DIR}/european-test-data/")
```

[^1]: Here I've assumed that you are working on a GitHub repository by using the relative path to googletest.

[googletest]: https://github.com/google/googletest
