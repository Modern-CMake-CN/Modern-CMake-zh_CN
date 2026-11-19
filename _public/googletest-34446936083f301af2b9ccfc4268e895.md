# GoogleTest

[GoogleTest] 和 GoogleMock 是非常经典的选择；不过就我个人经验而言，我会推荐你使用 Catch2，因为 GoogleTest 十分遵循谷歌的发展理念；它假定用户总是想使用最新的技术，因此会很快的抛弃旧的编译器（不对其适配）等等。添加 GoogleMock 也常常令人头疼，并且你需要使用 GoogleMock 来获得匹配器(matchers)，这在 Catch2 是一个默认特性，而不需要手动添加（但 docstest 没有这个特性）。

## FetchContent 方式

FetchContent 模块自身的文档就是以 GoogleTest 作为示例的，这也是获取它最简单的方式：

```cmake
include(FetchContent)

FetchContent_Declare(
  googletest
  GIT_REPOSITORY https://github.com/google/googletest.git
  GIT_TAG        v1.17.0
)

FetchContent_MakeAvailable(googletest)
```

这会提供带命名空间的目标 `GTest::gtest`、`GTest::gtest_main`、`GTest::gmock` 和 `GTest::gmock_main`；它们与针对已安装副本调用 `find_package(GTest)` 所提供的目标完全一致（现代版本的 GoogleTest 支持标准的 CMake 安装流程，因此直接使用打包安装好的副本也完全没问题）。

## 子模块(Submodule)的方式

当使用这种方式，只需要将 GoogleTest 设定(checkout) 为一个子模块：[^1]

```bash
git submodule add --branch=v1.17.x ../../google/googletest.git extern/googletest
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

## 添加测试

无论你通过哪种方式引入了 GoogleTest，为了增加一个测试，推荐使用下面的宏：

```cmake
macro(package_add_test TESTNAME)
    # 创建一个用于存放测试的可执行文件
    add_executable(${TESTNAME} ${ARGN})
    # 将 GoogleTest 基础库、Mock 库以及默认的 main 函数链接到测试可执行文件。
    # 如果你要自己编写 main 函数，请移除 GTest::gtest_main。
    target_link_libraries(${TESTNAME} GTest::gtest GTest::gmock GTest::gtest_main)
    # gtest_discover_tests 取代了 gtest_add_tests，
    # 更多可传入的选项请参见 https://cmake.org/cmake/help/latest/module/GoogleTest.html
    gtest_discover_tests(${TESTNAME}
        # 将工作目录设置为项目根目录，以便通过相对于项目根目录的路径查找测试数据
        WORKING_DIRECTORY ${PROJECT_SOURCE_DIR}
        PROPERTIES VS_DEBUGGER_WORKING_DIRECTORY "${PROJECT_SOURCE_DIR}"
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
    target_link_libraries(${TESTNAME} GTest::gtest GTest::gmock GTest::gtest_main ${LIBRARIES})
    gtest_discover_tests(${TESTNAME}
        WORKING_DIRECTORY ${TEST_WORKING_DIRECTORY}
        PROPERTIES VS_DEBUGGER_WORKING_DIRECTORY "${TEST_WORKING_DIRECTORY}"
    )
    set_target_properties(${TESTNAME} PROPERTIES FOLDER tests)
endmacro()

package_add_test_with_libraries(test1 test1.cpp lib_to_test "${PROJECT_SOURCE_DIR}/european-test-data/")
```

[^1]: 在这里我假设你在 Github 仓库中使用 googletest，然后使用的是 googletest 的相对路径。

[googletest]: https://github.com/google/googletest
