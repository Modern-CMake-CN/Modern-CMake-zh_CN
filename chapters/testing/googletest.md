# GoogleTest

GoogleTest 和 GoogleMock 是非常经典的选择；不过就我个人经验而言，我会推荐你使用 Catch2，因为 GoogleTest 十分遵循谷歌的发展理念；它假定用户总是想使用最新的技术，因此会很快的抛弃旧的编译器（不对其适配）等等。添加 GoogleMock 也常常令人头疼，并且你需要使用 GoogleMock 来获得匹配器(matchers)，这在 Catch2 是一个默认特性，而不需要手动添加（但 docstest 没有这个特性）。

## 子模块(Submodule)的方式（首选）

当使用这种方式，只需要将 GoogleTest 设定(checkout) 为一个子模块：[^1]

```cmake
git submodule add --branch=release-1.8.0 ../../google/googletest.git extern/googletest
```

然后，在你的主 `CMakeLists.txt` 中：

```cmake
option(PACKAGE_TESTS "Build the tests" ON)
if(PACKAGE_TESTS)
    enable_testing()
    include(GoogleTest)
    add_subdirectory(tests)
endif()
```

我推荐你使用一些像 `PROJECT_NAME STREQUAL CMAKE_PROJECT_NAME` 来设置 `PACKAGE_TEST` 选项的默认值，因为这样只会在项目为主项目时才构建测试单元。

像之前提到的，你必须在你的主 `CMakeLists.txt` 文件中调用 `enable_testing()` 函数。
现在，在你的 `tests` 目录中：

```cmake
add_subdirectory("${PROJECT_SOURCE_DIR}/extern/googletest" "extern/googletest")
```

如果你在你的主 `CMakeLists.txt` 中调用它，你可以使用普通的 `add_subdirectory`；这里因为我们是从子目录中调用的，所以我们需要一个额外的路径选项来更正构建路径。

下面的代码是可选的，它可以让你的 `CACHE` 更干净：

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

然后，为了增加一个测试，推荐使用下面的宏：

```cmake
macro(package_add_test TESTNAME)
    # create an exectuable in which the tests will be stored
    add_executable(${TESTNAME} ${ARGN})
    # link the Google test infrastructure, mocking library, and a default main fuction to
    # the test executable.  Remove g_test_main if writing your own main function.
    target_link_libraries(${TESTNAME} gtest gmock gtest_main)
    # gtest_discover_tests replaces gtest_add_tests,
    # see https://cmake.org/cmake/help/v3.10/module/GoogleTest.html for more options to pass to it
    gtest_discover_tests(${TESTNAME}
        # set a working directory so your project root so that you can find test data via paths relative to the project root
        WORKING_DIRECTORY ${PROJECT_DIR}
        PROPERTIES VS_DEBUGGER_WORKING_DIRECTORY "${PROJECT_DIR}"
    )
    set_target_properties(${TESTNAME} PROPERTIES FOLDER tests)
endmacro()

package_add_test(test1 test1.cpp)
```

这可以简单、快速的添加测试单元。你可以随意更改来满足你的需求。如果你之前没有了解过 `ARGN`，`ARGN ` 是显式声明的参数外的所有参数。如 `package_add_test(test1 test1.cpp a b c)`，`ARGN` 包含除 `test1` 与 `test1.cpp` 外的所有参数。

可以更改宏来满足你的要求。例如，如果你需要链接不同的库来进行不同的测试，你可以这么写：

```cmake
macro(package_add_test_with_libraries TESTNAME FILES LIBRARIES TEST_WORKING_DIRECTORY)
    add_executable(${TESTNAME} ${FILES})
    target_link_libraries(${TESTNAME} gtest gmock gtest_main ${LIBRARIES})
    gtest_discover_tests(${TESTNAME}
        WORKING_DIRECTORY ${TEST_WORKING_DIRECTORY}
        PROPERTIES VS_DEBUGGER_WORKING_DIRECTORY "${TEST_WORKING_DIRECTORY}"
    )
    set_target_properties(${TESTNAME} PROPERTIES FOLDER tests)
endmacro()

package_add_test_with_libraries(test1 test1.cpp lib_to_test "${PROJECT_DIR}/european-test-data/")
```


## 下载的方式

你可以通过 CMake 的 `include` 指令使用使用我在 [CMake helper repository][CLIUtils/cmake] 中的下载器，

这是一个 [GoogleTest] 的下载器，基于优秀的 [DownloadProject] 工具。为每个项目下载一个副本是使用 GoogleTest 的推荐方式（so much so, in fact, that they have disabled the automatic CMake install target）, so this respects that design decision. 这个方式在项目配置时下载 GoogleTest，所以 IDEs 可以正确的找到这些库。这样使用起来很简单：

```cmake
cmake_minimum_required(VERSION 3.10)
project(MyProject CXX)
list(APPEND CMAKE_MODULE_PATH ${PROJECT_SOURCE_DIR}/cmake)

enable_testing() # Must be in main file

include(AddGoogleTest) # Could be in /tests/CMakeLists.txt
add_executable(SimpleTest SimpleTest.cu)
add_gtest(SimpleTest)
```

> 提示：`add_gtest` 只是一个添加 `gtest`，`gmock` 以及 `gtest_main` 的宏，然后运行 `add_test` 来创建一个具有相同名字的测试单元
>
> ```cmake
> target_link_libraries(SimpleTest gtest gmock gtest_main)
> add_test(SimpleTest SimpleTest)
> ```

## FetchContent: CMake 3.11

这个例子是用 FetchContent 来添加 GoogleTest：

```cmake
include(FetchContent)

FetchContent_Declare(
  googletest
  GIT_REPOSITORY https://github.com/google/googletest.git
  GIT_TAG        release-1.8.0
)

FetchContent_GetProperties(googletest)
if(NOT googletest_POPULATED)
  FetchContent_Populate(googletest)
  add_subdirectory(${googletest_SOURCE_DIR} ${googletest_BINARY_DIR})
endif()
```

[^1]: 在这里我假设你在 Github 仓库中使用 googletest，然后使用的是 googletest 的相对路径。


[CLIUtils/cmake]:  https://github.com/CLIUtils/cmake
[GoogleTest]:      https://github.com/google/googletest
[DownloadProject]: https://github.com/Crascit/DownloadProject
