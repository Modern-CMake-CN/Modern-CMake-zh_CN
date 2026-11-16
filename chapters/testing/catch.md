# Catch

[Catch2] 是一个独立且强大的测试工具，它的理念（philosophy）类似于 Python 中的 Pytest。他比 GTest 支持更多的编译器版本，并且会紧跟潮流支持新的事物，比如支持在 M1 版本 MacOS 上使用 Catch。他也有一个相似但是更加快速的双胞胎兄弟，[doctest](https://github.com/doctest/doctest)，他编译十分迅速但是缺少了一些类似于匹配器（features）的特性。当前的 Catch2 v3 系列是一个常规库（旧版 v2 的单头文件设计已不复存在），并且要求 C++14 或更高版本。为了在 CMake 项目中使用 Catch2，下面是一些可选的方式：

## 如何配置

Catch2 对 CMake 支持很友好；你可以通过 FetchContent 获取它（或者使用 submodules，又或者通过 `find_package(Catch2 3)` 使用已安装的副本）。[`extended-project`](https://gitlab.com/CLIUtils/modern-cmake/-/tree/master/examples/extended-project)  与 [`fetch`](https://gitlab.com/CLIUtils/modern-cmake/-/tree/master/examples/fetch) 这两个示例用的都是 FetchContent 的方式。更多的可以参考[官方文档](https://github.com/catchorg/Catch2/blob/devel/docs/cmake-integration.md#top)。

```cmake
include(FetchContent)

FetchContent_Declare(
  catch
  GIT_REPOSITORY https://github.com/catchorg/Catch2.git
  GIT_TAG        v3.15.0
)
FetchContent_MakeAvailable(catch)
```

这会提供两个目标：`Catch2::Catch2`，以及同时为你提供默认 `main()` 函数的 `Catch2::Catch2WithMain`；与 v2 不同的是，你不再需要自己编写带有 `CATCH_CONFIG_MAIN` 的 `main.cpp` 文件：

```cmake
add_executable(my_tests test.cpp)
target_link_libraries(my_tests PRIVATE Catch2::Catch2WithMain)
```

随后，你的测试文件只需按需包含所用到的头文件即可，例如 `<catch2/catch_test_macros.hpp>`（v2 中包罗万象的 `<catch2/catch.hpp>` 已被移除）。

## 向 CTest 注册测试

Catch2 还在其 `extras` 文件夹中附带了 CMake 模块，可以将每个 `TEST_CASE` 单独注册到 CTest 中。应当使用的是 `Catch` 模块中的 `catch_discover_tests`（`ParseAndAddCatchTests` 在 v3 中已被弃用）：

```cmake
list(APPEND CMAKE_MODULE_PATH ${catch_SOURCE_DIR}/extras)
include(CTest)
include(Catch)
catch_discover_tests(my_tests)
```

如果你是安装了 Catch2 而不是将其作为子项目添加，那么在调用 `find_package(Catch2 3 REQUIRED)` 之后即可直接使用该模块。

## Vendoring

如果你无法（或者不想）在配置时下载，Catch2 v3 提供了一个合并源码（amalgamated）发行版：包含 `extras/catch_amalgamated.hpp` 和 `extras/catch_amalgamated.cpp` 两个文件，你可以直接将它们放入项目中并作为一个普通库来构建：

```cmake
add_library(catch2 STATIC extern/catch2/catch_amalgamated.cpp)
target_include_directories(catch2 PUBLIC extern/catch2)
target_compile_features(catch2 PUBLIC cxx_std_14)
```

合并源码文件中同样包含了默认的 `main()` 函数。由于你不会导出测试目标，将其定义为一个普通的（非导出的）目标就完全足够了。

[catch2]: https://github.com/catchorg/Catch2
