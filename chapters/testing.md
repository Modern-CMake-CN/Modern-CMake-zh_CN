# 测试

## General Testing Information

你需要在你的主 CMakeLists.txt 文件中添加如下函数调用（而不是在子文件夹 CMakeLists.txt 中）：

```cmake
if(CMAKE_PROJECT_NAME STREQUAL PROJECT_NAME)
    include(CTest)
endif()
```

这么做将可以使得具有 CMake 测试功能，并且具有一个 `BUILD_TESTING` 选项使得用户可以选择开启或关闭测试（还有[一些其他的设置](https://gitlab.kitware.com/cmake/cmake/blob/master/Modules/CTest.cmake)）。或者你可以直接通过调用 `enable_testing()` 函数来开启测试。 

当你添加你自己的测试文件夹时，你应该这么做：

```cmake
if(CMAKE_PROJECT_NAME STREQUAL PROJECT_NAME AND BUILD_TESTING)
    add_subdirectory(tests)
endif()
```

这么做的（译者注：需要添加 `CMAKE_PROJECT_NAME STREQUAL PROJECT_NAME`）的原因是，如果有他人包含了你的包，并且他们开启了 `BUILD_TESTING` 选项，但他们并不想构建你包内的测试单元，这样会很有用。在极少数的情况下他们可能真的想要开启所有包的测试功能，你可以提供给他们一个可以覆盖的变量（如下例的 `MYPROJECT_BUILD_TESTING`，当设置 `MYPROJECT_BUILD_TESTING` 为 ON 时，会开启该项目的测试功能）：

```cmake
if((CMAKE_PROJECT_NAME STREQUAL PROJECT_NAME OR MYPROJECT_BUILD_TESTING) AND BUILD_TESTING)
    add_subdirectory(tests)
endif()
```

本书中的[示例](https://github.com/Modern-CMake-CN/Modern-CMake-zh_CN/blob/master/examples/extended-project/CMakeLists.txt)就使用了覆盖变量的形式来开启所有测试，因为主 CMake 项目确实想要运行所有子项目的测试功能。

你可以这样注册一个测试目标(targets)：

```cmake
add_test(NAME TestName COMMAND TargetName)
```

如果你在 `COMMAND` 后写了除 `TargetName` 之外的东西，他将会被注册为在命令行运行的指令。在这里写生成器表达式(generator-expression)也是有效的：

```cmake
add_test(NAME TestName COMMAND $<TARGET_FILE:${TESTNAME}>)
```

这么写将会使用该目标生成的文件（也就是生成的可执行文件）的路径作为参数。

## 将构建作为测试的一部分

如果你想在测试时运行 CMake 构建一个项目，这也是可以的（事实上，这也是 CMake 如何进行自我测试的）。例如，如果你的主项目名为 `MyProject` 并且你有一个 `examples/simple` 项目需要在测试时构建，那么可以这么写：

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

## 测试框架

可以查看子章节了解主流测试框架的使用方式(recipes)：

* [GoogleTest](testing/googletest.md): 一个 Google 出品的主流测试框架。不过开发可能有点慢。
* [Catch2](testing/catch.md): 一个现代的，具有灵巧的宏的 PyTest-like 的测试框架。
* [DocTest](https://github.com/onqtam/doctest):  一个 Catch2 框架的替代品，并且编译速度更快、更干净(cleaner)。See Catch2 chapter and replace with DocTest. 
